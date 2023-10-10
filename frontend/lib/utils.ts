import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatUnits } from "viem";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const shortAddress = (address: `0x${string}`) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatEth = (eth?: bigint) => {
  return `${formatUnits(eth || BigInt(0), 18)}`;
};

export const encodeQueryData = (data: Record<string, string>) => {
  const ret = [];
  for (const d in data) {
    ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
  }
  return ret.join("&");
};

export const tryParseBigInt = (value?: string | bigint | number) => {
  if (typeof value === "bigint") return value;
  if (!value) return BigInt(0);
  else return BigInt(value);
};

export const formatError = (error: unknown) => {
  if (typeof error === "string") return error;
  if (error instanceof Error) {
    return error.message;
  }
  return JSON.stringify(error);
};
