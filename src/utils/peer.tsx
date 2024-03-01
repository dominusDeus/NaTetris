/**
 * This file contains Peer+React utils.
 * This file should not have any logic specific to this project.
 */

import { DataConnection, Peer } from "peerjs"
import { createContext, use, useEffect, useState } from "react"

const PeerContext = createContext<{ conn: DataConnection } | null>(null)

export const PeerProvider = PeerContext.Provider

export function usePeerContext() {
  const context = use(PeerContext)
  if (!context) {
    throw new Error("No Peer context found")
  }

  if (!context.conn.open) {
    // BUG: when the other person disconnects, this error should not be thrown.
    throw new Error("You need to provide an open connection")
  }

  return context
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

/**
 *
 * @returns Returns undefined on the first call and the message data on the rest.
 */
export function useConnectionData() {
  const { conn } = usePeerContext()

  const [state, setState] = useState<unknown>()

  useEffect(() => {
    conn.on("data", setState)

    return () => {
      conn.off("data", setState)
    }
  }, [conn])

  return state
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
