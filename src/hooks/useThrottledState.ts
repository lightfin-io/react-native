import { useState, useRef, useEffect, useCallback } from 'react'

export type StateSetter<S> = (intermediateState: S) => S

// For optimal performance mutate state in setIntermediateState
// and pass a custom `makeNewState` for when the final state is
// updated. e.g. `obj => {...obj}` or `arr => [...arr]`
export function useThrottledState<S>(
  initialState: S | (() => S),
  timeout = 300,
  makeNewState: (s: S) => S = s => s
): [S, (setter: StateSetter<S>) => void] {
  const [finalState, setState] = useState(initialState)
  const intermediateState = useRef(finalState)
  const timeoutId = useRef<ReturnType<typeof setTimeout>>()

  const updateState = useCallback(() => {
    setState(makeNewState(intermediateState.current))
    timeoutId.current = undefined
  }, [])

  const setIntermediateState = useCallback(
    (setter: StateSetter<S>) => {
      intermediateState.current = setter(intermediateState.current)

      if (!timeoutId.current) {
        timeoutId.current = setTimeout(updateState, timeout)
      }
    },
    [timeout, updateState]
  )

  // Cleanup if unmounted.
  useEffect(
    () => () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current)
      }
    },
    []
  )

  return [finalState, setIntermediateState]
}
