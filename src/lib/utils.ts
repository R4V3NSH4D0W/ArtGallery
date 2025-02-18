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

  return `Resend in ${minutes}m ${seconds}s`;
}


export const formatCurrency = (amount: number) => {
  return `Rs. ${amount.toLocaleString('en-NP')}`;
};

export const formatPercentage = (value: number) => {
  return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
};

export const getLastMonthStart = () => {
  const date = new Date();
  date.setMonth(date.getMonth() - 1);
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
  return date;
};

export const getCurrentMonthStart = () => {
  const date = new Date();
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
  return date;
};

export function getAcronym(text: string): string {
  return text
    .split(" ")               // Split the text into words
    .map((word) => word[0])   // Take the first letter of each word
    .join("")                 // Join them into a single string
    .toUpperCase();           // Ensure the acronym is uppercase
}
