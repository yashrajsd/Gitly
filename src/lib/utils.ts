import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// this for chnge 2
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
