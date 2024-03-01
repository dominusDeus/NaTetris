"use client"

import { useRouter, useSearchParams } from "next/navigation"
import Peer, { DataConnection } from "peerjs"
import { useMemo, useState } from "react"
import { z } from "zod"

import { connectWithOtherPeer } from "@/utils/peer"

import { PeerProvider, usePeerConnections } from "../../utils/peer"
import { CoopGame } from "./game"

const SearchParamsSchema = z.object({
  me: z.string().min(1).optional(),
  them: z.string().min(1).optional(),
})

function CoopPage() {
  const router = useRouter()
  const searchParams = SearchParamsSchema.parse(Object.fromEntries(useSearchParams()!.entries()))
  console.log({ searchParams })

  const peer = useMemo(() => {
    if (searchParams.me === undefined) {
      return null
    }

    return new Peer(searchParams.me)
  }, [searchParams.me])
  console.log("myself", peer)

  const [myConnectionToOtherUser, setMyConnectionToOtherUser] = useState<DataConnection>()
  const [usersConnectedToMe] = usePeerConnections(peer!)
  const conn = myConnectionToOtherUser || usersConnectedToMe
  console.log("Playing game with following connection: ", conn)

  return (
    <div className="flex h-full items-center justify-center gap-4">
      <PeerProvider value={conn ? { conn } : null}>
        {conn ? (
          conn.open ? (
            <CoopGame player2Id={conn.peer} />
          ) : (
            <span>Conn is not yet open</span>
          )
        ) : peer ? (
          <div className="flex h-52 flex-col items-center justify-center gap-y-8">
            <form
              onSubmit={async (ev) => {
                ev.preventDefault()

                const formData = new FormData(ev.currentTarget)
                const userId = formData.get("user2")
                if (typeof userId !== "string") {
                  throw new Error()
                }

                // const searchParamss = new URLSearchParams([
                //   ...Object.entries(searchParams),
                //   ["them", userId],
                // ])

                // router.push("?" + searchParamss)

                setMyConnectionToOtherUser(await connectWithOtherPeer(peer, userId))
              }}
            >
              <label>Player 2 ID</label>
              <input
                className="border border-slate-400"
                name="user2"
                key={1}
                defaultValue={searchParams.them}
              />
              <button>Connect</button>
            </form>
            <hr className="w-full" />
            <span>Or wait for other people to connect to you</span>
          </div>
        ) : (
          <form
            onSubmit={(ev) => {
              ev.preventDefault()

              const formData = new FormData(ev.currentTarget)
              const userId = formData.get("user1")
              if (typeof userId !== "string") {
                throw new Error()
              }

              const searchParamss = new URLSearchParams([
                ...Object.entries(searchParams),
                ["me", userId],
              ])

              router.push("?" + searchParamss)
            }}
          >
            <label>Your Id</label>
            <input
              className="border border-slate-400"
              name="user1"
              key={2}
              defaultValue={searchParams.me}
            />
            <button>Log in</button>
          </form>
        )}
      </PeerProvider>
    </div>
  )
}

export default CoopPage
