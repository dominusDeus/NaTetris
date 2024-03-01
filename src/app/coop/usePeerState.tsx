import * as devalue from "devalue"
import Peer, { DataConnection } from "peerjs"
import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useId,
  useState,
} from "react"
import { z } from "zod"

import { GamePieceSchema } from "@/components/types"

const CoopContext = createContext<{ conn: DataConnection } | null>(null)

export const CoopProvider = CoopContext.Provider

export function useCoop() {
  const context = useContext(CoopContext)
  if (!context) {
    throw new Error("No Coop context found")
  }

  return context
}

const PeerDataSchema = z.object({
  id: z.string(),
  data: z.any(),
})

type PeerDataSchema = z.infer<typeof PeerDataSchema>

export function sendDataToConnection(id: string, data: unknown, conn: DataConnection) {
  conn.send(devalue.stringify({ id, data }))
}

function useConnectionData() {
  const { conn } = useCoop()

  const [state, setState] = useState<unknown>()

  useEffect(() => {
    conn.on("data", setState)

    return () => {
      conn.off("data", setState)
    }
  }, [conn])

  return state
}

export function usePeerData(id: string) {
  const data = useConnectionData()
  console.log("usePlayerData state:", data)
  if (typeof data !== "string") {
    throw new Error("")
  }

  return PeerDataSchema.parse(devalue.parse(data)).data
}

export function usePeerState<T>(initialState: T | (() => T)): [T, Dispatch<SetStateAction<T>>]

export function usePeerState<T = undefined>(): [
  T | undefined,
  Dispatch<SetStateAction<T | undefined>>,
]

export function usePeerState<T>(initialState?: T | (() => T)) {
  const { conn } = useCoop()
  if (!conn.open) {
    throw new Error("You need to provide an open connection")
  }

  const stateId = useId()
  const [state, setState] = useState(initialState)

  useEffect(() => {
    // console.log("conn is: ", conn.open)
    console.log("Sending state to peers: ", state)
    sendDataToConnection(stateId, state, conn)
  }, [conn, state, stateId])

  return [state, setState] as const
}

export function usePState<T>(initialState?: T | (() => T)) {
  const { conn } = useCoop()
  if (!conn.open) {
    throw new Error("You need to provide an open connection")
  }

  const stateId = useId()
  const [state, setState] = useState(initialState)

  useEffect(() => {
    // console.log("conn is: ", conn.open)
    console.log("Sending state to peers: ", state)
    sendDataToConnection(stateId, state, conn)
  }, [conn, state, stateId])

  return [state, setState] as const
}

export function usePlayerGamePiece(id: string) {
  const data = usePeerData(id)
  return GamePieceSchema.optional().parse(data)
}

/**
 * Listen to other peers
 */
export function usePeerConnections(peer: Peer) {
  const [conns, setConns] = useState<DataConnection[]>([])

  useEffect(() => {
    const handleIncommingConnection = (conn: DataConnection) => {
      const handleOpen = () => {
        console.log("Someone has connected with you:", conn.peer)
        setConns((v) => [...v, conn])
      }

      conn.on("open", handleOpen)
    }

    // Someone is trying to connect with me
    peer.on("connection", handleIncommingConnection)

    return () => {
      peer.off("connection", handleIncommingConnection)
    }
  }, [peer])

  return conns
}

export function connectWithOtherPeer(myself: Peer, otherId: string) {
  const connection = myself.connect(otherId)

  return new Promise<DataConnection>((resolve) => {
    const handleOpen = () => {
      resolve(connection)
    }

    connection.on("open", handleOpen)
  })
}
