import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCenterXYForElement(args: {
  width: number;
  height: number;
  canvasWidth: number;
  canvasHeight: number;
}): { x: number; y: number } {
  return {
    x: args.canvasWidth / 2 - args.width / 2,
    y: args.canvasHeight / 2 - args.height / 2,
  };
}
