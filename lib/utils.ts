import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges multiple Tailwind and conditional class names safely, resolving utility conflicts.
 * Uses tailwind-merge to avoid CSS specificity collisions when custom overrides are passed.
 * @param inputs - List of class names, conditionals, or objects
 * @returns Consolidated deduplicated class name string
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

