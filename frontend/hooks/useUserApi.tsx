import {
  UpdateUserArgs,
  getNewUsers,
  getTopUsers,
  getTopUsersByAnswersGiven,
  getTopUsersByKeysOwned,
  getTopUsersByQuestionsAsked,
  getUser,
  search
} from "@/backend/user/user";
import {
  checkUsersExistSA,
  createUserSA,
  generateChallengeSA,
  getRecommendedUserSA,
  getRecommendedUsersSA,
  getUserStatsSA,
  linkNewWalletSA,
  refreshCurrentUserProfileSA,
  updateUserSA
} from "@/backend/user/userServerActions";
import { SimpleUseQueryOptions } from "@/models/helpers.model";
import { Prisma } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useAxios } from "./useAxios";
import { useDebounce } from "./useDebounce";
import { useInfiniteQueryAxios } from "./useInfiniteQueryAxios";
import { useMutationSA } from "./useMutationSA";
import { useQuerySA } from "./useQuerySA";

export type GetCurrentUserResponse = Prisma.UserGetPayload<{
  include: { inviteCodes: true; points: true; socialProfiles: true };
}>;

export type GetUserResponse = Prisma.UserGetPayload<{ include: { socialProfiles: true } }>;

export const useCreateUser = () => {
  return useMutationSA(async (options, inviteCode: string) => {
    return createUserSA(inviteCode, options);
  });
};

export const useGetUser = (address?: string, reactQueryOptions?: { enabled?: boolean }) => {
  const axios = useAxios();
  return useQuery(
    ["useGetUser", address],
    async () => axios.get<Awaited<ReturnType<typeof getUser>>>(`/api/user/${address}`).then(res => res.data.data),
    {
      enabled: !!address,
      ...reactQueryOptions
    }
  );
};

export const useGetNewUsers = () => {
  return useInfiniteQueryAxios<Awaited<ReturnType<typeof getNewUsers>>>(["useGetNewUsers"], "/api/user/new");
};

export const useGetTopUsersByAnswersGiven = () => {
  return useInfiniteQueryAxios<Awaited<ReturnType<typeof getTopUsersByAnswersGiven>>>(
    ["useGetTopUsersByAnswersGiven"],
    "/api/user/answers"
  );
};

export const useGetTopUsersByQuestionsAsked = () => {
  return useInfiniteQueryAxios<Awaited<ReturnType<typeof getTopUsersByQuestionsAsked>>>(
    ["useGetTopUsersByQuestionsAsked"],
    "/api/user/questions"
  );
};

export const useGetTopUsersByKeysOwned = () => {
  return useInfiniteQueryAxios<Awaited<ReturnType<typeof getTopUsersByKeysOwned>>>(
    ["useGetTopUsersByKeysOwned"],
    "/api/user/keys"
  );
};

export const useGetTopUsers = () => {
  return useInfiniteQueryAxios<Awaited<ReturnType<typeof getTopUsers>>>(["useGetTopUsers"], "/api/user/holders");
};

export const useRefreshCurrentUser = () => {
  return useMutationSA(async options => refreshCurrentUserProfileSA(options));
};

export const useCheckUsersExist = (wallets?: string[]) => {
  return useQuerySA(["useCheckUsersExist", wallets], async options => checkUsersExistSA(wallets!, options), {
    enabled: !!wallets
  });
};

export const useLinkWallet = () => {
  return useMutationSA(async (options, signature: string) => linkNewWalletSA(signature, options));
};

export const useUpdateUser = () => {
  return useMutationSA(async (options, updatedUser: UpdateUserArgs) => updateUserSA(updatedUser, options));
};

export const useGenerateChallenge = () => {
  return useMutationSA(async (options, publicKey: string) => generateChallengeSA(publicKey, options));
};

export const useGetRecommendedUser = (address?: string) => {
  return useQuerySA(["useGetRecommendedUser", address], async options => getRecommendedUserSA(address!, options), {
    enabled: !!address
  });
};

export const useRecommendedUsers = (wallet: string) => {
  return useQuerySA(["useRecommendedUsers", wallet], async options => getRecommendedUsersSA(wallet, options));
};

export const useSearch = (searchValue: string, includeOwnedKeysOnly = false, queryOptions?: SimpleUseQueryOptions) => {
  const debouncedValue = useDebounce(searchValue, 500);
  return useInfiniteQueryAxios<Awaited<ReturnType<typeof search>>>(
    ["useSearch", debouncedValue],
    "/api/user/search",
    {
      enabled: !!debouncedValue,
      ...queryOptions
    },
    { includeOwnedKeysOnly: includeOwnedKeysOnly, search: debouncedValue }
  );
};

export const useGetUserStats = (userId?: number) => {
  return useQuerySA(["useGetUserStats", userId], async options => getUserStatsSA(userId!, options), {
    enabled: !!userId
  });
};
