import { useEffect, useRef } from "react"

export function useInterval(runWhileCondition: boolean, fn: () => void, time: number) {
  const ref = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (!runWhileCondition) return

    const interval = setInterval(() => {
      fn()
    }, time)

    ref.current = interval

    return () => {
      clearInterval(interval)
      ref.current = undefined
    }
  }, [runWhileCondition, fn, time])

  return ref
}
