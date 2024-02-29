import { PropsWithChildren } from "react"

import { CommonProps } from "@/utils/common-props"
import { tw } from "@/utils/tw"

import { PIXEL_SIZE } from "./constants"
import { Coords } from "./types"

type BoxProps = CommonProps & {
  width: number
}

export function Box(props: PropsWithChildren<BoxProps>) {
  const { children, className, style, width } = props

  return (
    <div
      className={tw("relative", className)}
      style={{ width: PIXEL_SIZE * width + "px", ...style }}
    >
      {children}
    </div>
  )
}

type BoxPieceProps = CommonProps & Coords

Box.Place = function Place(props: PropsWithChildren<BoxPieceProps>) {
  const { children, className, style, x, y } = props

  return (
    <div
      className={tw("absolute", className)}
      style={{
        top: y * PIXEL_SIZE,
        left: x * PIXEL_SIZE,
        ...style,
      }}
    >
      {children}
    </div>
  )
}
