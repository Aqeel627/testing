import { icons } from "@/icons/icons";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type IconName = keyof typeof icons;

// Helper to list all names in the registry (server-safe)
export function getIconNames(): IconName[] {
  return Object.keys(icons) as IconName[];
}