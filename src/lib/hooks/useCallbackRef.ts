import { useRef } from 'react'

export function useCallbackRef<T>(val: T) {
  const valRef = useRef(val)
  valRef.current = val
  return valRef
}
