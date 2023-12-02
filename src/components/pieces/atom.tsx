import { CommonProps } from "@/utils/common-props";
import { twMerge } from "tailwind-merge";

export function Atom({ className, style }: CommonProps) {
  return (
    <div
      className={twMerge("h-10 w-10 border border-solid border-gray-500", className)}
      style={style}
    />
  );
}
