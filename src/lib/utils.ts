import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getRemainingTime(expiresAt: string): string {
  const expiresDate = new Date(expiresAt);
  const now = new Date();

  const diffMs = expiresDate.getTime() - now.getTime();

  if (diffMs <= 0) {
    return "";
  }

  const minutes = Math.floor(diffMs / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

  return `${minutes}m ${seconds}s remaining`;
}