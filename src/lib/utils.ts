import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPriceBDT(amount: number, isBangla: boolean = false): string {
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(amount);

  if (!isBangla) {
    return `৳ ${formatted}`;
  }

  // Convert English digits to Bangla
  const banglaDigits: { [key: string]: string } = {
    '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
    '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯',
    ',': ',',
  };

  const bnFormatted = formatted.replace(/[0-9,]/g, (char) => banglaDigits[char] || char);
  return `৳ ${bnFormatted}`;
}

export function timeAgo(dateInput: Date | string, isBangla: boolean = false): string {
  const date = new Date(dateInput);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) {
    return isBangla ? 'এইমাত্র' : 'Just now';
  }
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return isBangla ? `${toBanglaNumber(minutes)} মিনিট আগে` : `${minutes}m ago`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return isBangla ? `${toBanglaNumber(hours)} ঘণ্টা আগে` : `${hours}h ago`;
  }
  const days = Math.floor(hours / 24);
  if (days < 30) {
    return isBangla ? `${toBanglaNumber(days)} দিন আগে` : `${days}d ago`;
  }
  const months = Math.floor(days / 30);
  return isBangla ? `${toBanglaNumber(months)} মাস আগে` : `${months}mo ago`;
}

export function toBanglaNumber(num: number | string): string {
  const banglaDigits: { [key: string]: string } = {
    '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
    '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯',
  };
  return num.toString().replace(/[0-9]/g, (digit) => banglaDigits[digit] || digit);
}
