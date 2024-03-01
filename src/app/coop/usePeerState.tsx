import * as devalue from "devalue"
import { Dispatch, SetStateAction, useCallback, useEffect, useId, useState } from "react"

import { GamePieceSchema } from "@/components/types"

import { usePeerContext } from "../../utils/peer"
import { useConnectionData } from "../../utils/peer"
import { PeerDataSchema, readMessage, writeMessage } from "../../utils/peer-game-message"

function isStateSetterFunction<T>(
  v: SetStateAction<T | undefined>,
): v is (prevState: T | undefined) => T | undefined {
  return !!v && typeof v === "function" && v.length === 1
}

export function useCoopState<T>(initialState: T | (() => T)): [T, Dispatch<SetStateAction<T>>]

export function useCoopState<T = undefined>(): [
  T | undefined,
  Dispatch<SetStateAction<T | undefined>>,
]

export function useCoopState<T>(initialState?: T | (() => T)) {
  const { conn } = usePeerContext()

  const stateId = useId()
  const [state, setState] = useState(initialState)
  const connectionData = useConnectionData()

  const customSetData: Dispatch<SetStateAction<T | undefined>> = useCallback(
    (action) => {
      setState((v) => {
        const newState = isStateSetterFunction(action) ? action(v) : action

        console.log("Sending data to peers: ", { stateId, data: newState })
        conn.send(writeMessage(stateId, newState))

        return newState
      })
    },
    [conn, stateId],
  )

  useEffect(() => {
    if (!connectionData) return

    const { id: messageId, data } = readMessage(connectionData)
    const messageIsForThisState = messageId === stateId
    if (!messageIsForThisState) {
      return
    }

    console.log("Receiving data from peers: ", { stateId, data })
    setState(data) // TODO: We should validate if `data` is the same type as this `state`
  }, [connectionData, stateId])

  return [state, customSetData] as const
}

export function useMyState<T>(initialState: T | (() => T)): [T, Dispatch<SetStateAction<T>>, T]

export function useMyState<T = undefined>(): [
  T | undefined,
  Dispatch<SetStateAction<T | undefined>>,
  T | undefined,
]

export function useMyState<T>(initialState?: T | (() => T)) {
  const { conn } = usePeerContext()

  const stateId = useId()
  const [myState, setMyState] = useState(initialState)
  const [theirState, setTheirState] = useState()
  const connectionData = useConnectionData()

  const customSetData: Dispatch<SetStateAction<T | undefined>> = useCallback(
    (action) => {
      setMyState((v) => {
        const newState = isStateSetterFunction(action) ? action(v) : action

        console.log("Sending data to peers: ", { stateId, data: newState })
        conn.send(writeMessage(stateId, newState))

        return newState
      })
    },
    [conn, stateId],
  )

  useEffect(() => {
    if (!connectionData) return

    const { id: messageId, data } = readMessage(connectionData)
    const messageIsForThisState = messageId === stateId
    if (!messageIsForThisState) {
      return
    }

    console.log("Receiving data from peers: ", { stateId, data })
    setTheirState(data) // TODO: We should validate if `data` is the same type as this `state`
  }, [connectionData, stateId])

  return [myState, customSetData, theirState] as const
}
