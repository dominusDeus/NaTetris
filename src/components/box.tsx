import { PropsWithChildren } from "react"

import { CommonProps } from "@/utils/common-props"
import { tw } from "@/utils/tw"

import { ATOM_SIZE } from "./constants"
import { Coords } from "./types"

type BoxProps = CommonProps & {
  height: number

  /** How many atoms-width? */
  width: number
}

export function Box(props: PropsWithChildren<BoxProps>) {
  const { children, className, height, style, width } = props

  const toPixels = (n: number) => ATOM_SIZE * n + "px"

  return (
    <div
      className={tw("relative", className)}
      style={{ height: toPixels(height), width: toPixels(width), ...style }}
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
        top: y * ATOM_SIZE,
        left: x * ATOM_SIZE,
        ...style,
      }}
    >
      {children}
    </div>
  )
}
