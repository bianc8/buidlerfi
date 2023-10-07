import { GetEnsResponse } from "@/app/api/ens/route";
import { DEFAULT_PROFILE_PICTURE } from "@/lib/assets";
import { shortAddress } from "@/lib/utils";
import { ApiResponse } from "@/models/apiResponse.model";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { addHours, isAfter } from "date-fns";
import { get, set } from "idb-keyval";
import { useEffect, useMemo } from "react";
import { useGetWalletSocials } from "./useAirstackApi";

export interface SocialData {
  address: `0x${string}`;
  avatar: string;
  name: string;
  socialsList: {
    dappName: string;
    profileName: string;
  }[];
}

interface CachedSocialData extends SocialData {
  cachedAt: Date;
}

const CACHE_VALIDITY_HOURS = 24;

export const useSocialData = (address: `0x${string}`): SocialData => {
  const cachedData = useQuery<CachedSocialData>(["useSocialData", address], () => get(`social-data-${address}`));

  const isNotInCache = useMemo(() => {
    //We return true while loading to prevent fetching from other sources
    if (cachedData.isLoading || cachedData.isFetching) return false;
    if (!cachedData.data) return true;
    //Check if cached data is older than 24 hours
    return isAfter(new Date(), addHours(cachedData.data.cachedAt, CACHE_VALIDITY_HOURS));
  }, [cachedData]);

  //First try to fetch from farcaster with airstack
  const { data: walletDetails, isLoading } = useGetWalletSocials(address, { enabled: isNotInCache });

  const farcasterInfo = useMemo(
    () => walletDetails?.socials?.find(social => social.dappName === "farcaster"),
    [walletDetails?.socials]
  );

  const lensInfo = useMemo(
    () => walletDetails?.socials?.find(social => social.dappName === "lens"),
    [walletDetails?.socials]
  );

  const ensData = useQuery(
    ["getEnsData", address],
    () => axios.get<ApiResponse<GetEnsResponse>>(`api/ens`, { params: { address } }).then(res => res.data.data),
    {
      enabled: isNotInCache && !!address
    }
  );

  const res = useMemo(
    () => ({
      address: address,
      socialsList:
        cachedData.data?.socialsList ||
        walletDetails?.socials
          ?.filter(i => i.profileName)
          .map(i => ({ dappName: i.dappName, profileName: i.profileName })) ||
        [],
      avatar:
        cachedData.data?.avatar ||
        farcasterInfo?.profileImage ||
        lensInfo?.profileImage ||
        ensData.data?.avatar ||
        DEFAULT_PROFILE_PICTURE,
      name:
        cachedData.data?.name ||
        farcasterInfo?.profileName ||
        walletDetails?.primaryDomain?.name ||
        shortAddress(address) ||
        "Buidler"
    }),
    [address, cachedData, ensData, farcasterInfo, lensInfo, walletDetails]
  );

  useEffect(() => {
    if (isNotInCache && !cachedData.isLoading && !isLoading && !ensData.isLoading && res) {
      set(`social-data-${address}`, {
        ...res,
        cachedAt: new Date()
      });
    }
  }, [address, cachedData.isLoading, ensData.isLoading, isLoading, isNotInCache, res]);

  return res;
};
