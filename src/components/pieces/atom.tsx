import { twMerge } from "tailwind-merge"

import { CommonProps } from "@/utils/common-props"

export function Atom({ className, style }: CommonProps) {
  return (
    <div
      className={twMerge("h-10 w-10 border border-solid border-gray-500", className)}
      style={style}
    />
  )
}
