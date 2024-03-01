import * as devalue from "devalue"
import { z } from "zod"

export const PeerDataSchema = z.object({
  id: z.string(),
  data: z.any(),
})

export type PeerDataSchema = z.infer<typeof PeerDataSchema>

export function writeMessage<T>(id: string, data: T) {
  return devalue.stringify({ id, data })
}

export function readMessage(data: unknown) {
  console.log("data", data)
  if (typeof data !== "string") {
    throw new Error("data should be a string")
  }

  const dataObject = devalue.parse(data)

  return PeerDataSchema.parse(dataObject)
}
