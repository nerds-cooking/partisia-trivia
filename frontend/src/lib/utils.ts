import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function ellipsisAddress(
  address: string,
  start: number = 6,
  end: number = 4
) {
  return `${address.slice(0, start)}...${address.slice(-end)}`;
}
