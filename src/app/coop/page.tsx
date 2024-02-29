"use client"

import Peer, { DataConnection } from "peerjs"
import { useEffect, useState } from "react"

import { Box } from "@/components/box"
import ComingPiecesBox, { ComingPieces } from "@/components/coming-pieces-box"
import { VIEWPORT_WIDTH } from "@/components/constants"
import HoldBox from "@/components/hold-box"
import { GamePiece, PieceStructure } from "@/components/types"
import { generateRandomPiece } from "@/utils/pieces"

function useWs(peer?: Peer, connection?: DataConnection) {
  useEffect(() => {
    if (!peer) {
      return
    }

    const handlePeerConnection = (conn: DataConnection) => {
      conn.on("data", (data) => {
        // Will print 'hi!'
        console.log(data)
      })
      conn.on("open", () => {
        conn.send("hello!")
      })
    }

    peer.on("connection", handlePeerConnection)

    if (!connection) {
      return
    }

    const handleOpen = () => {
      connection.send("hi!")
    }

    connection.on("open", handleOpen)

    return () => {
      connection.off("open", handleOpen)
      peer.off("connection", handlePeerConnection)
    }
  }, [connection, peer])
}

function Game() {
  const [currentPieceInViewport, setCurrentPiece] = useState<GamePiece>(() => generateRandomPiece())
  const [comingPieces, setComingPieces] = useState<ComingPieces>(() => ({
    piece1: generateRandomPiece(),
    piece2: generateRandomPiece(),
    piece3: generateRandomPiece(),
  }))
  const [holdBoxPiece, setHoldBoxPiece] = useState<PieceStructure>(
    () => generateRandomPiece().piece,
  )

  const [peer, setPeer] = useState<Peer>()
  const [connection, setConnection] = useState<DataConnection>()
  useWs(peer, connection)

  return (
    <div className="flex h-full items-center justify-center gap-4">
      {connection ? (
        <p>You are connected!</p>
      ) : peer ? (
        <form
          onSubmit={(ev) => {
            ev.preventDefault()

            const formData = new FormData(ev.currentTarget)
            const user2Id = formData.get("user2")
            if (typeof user2Id !== "string") {
              throw new Error()
            }

            setConnection(peer.connect(user2Id))
          }}
        >
          <label>Their Id</label>
          <input name="user2" />
          <button>Connect</button>
        </form>
      ) : (
        <form
          onSubmit={(ev) => {
            ev.preventDefault()

            const formData = new FormData(ev.currentTarget)
            const user1Id = formData.get("user1")
            if (typeof user1Id !== "string") {
              throw new Error()
            }

            setPeer(new Peer(user1Id))
          }}
        >
          <label>Your Id</label>
          <input name="user1" />
          <button>Log in</button>
        </form>
      )}
    </div>
  )
}

export default Game
