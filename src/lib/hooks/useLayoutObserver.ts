import { useCallback, useEffect, useMemo, useState } from 'react'
import { LayoutChangeEvent } from 'react-native'
import { throttle } from 'lodash-es'

export function useLayoutObserver(throttleTime = 30) {
  const [layout, setLayout] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  })

  const throttleSetDimensions = useMemo(
    () =>
      throttle(
        (x: number, y: number, width: number, height: number) => {
          setLayout({ x, y, width, height })
        },
        throttleTime,
        { leading: false }
      ),
    [throttleTime]
  )

  useEffect(() => {
    return () => throttleSetDimensions.cancel()
  }, [throttleSetDimensions])

  const onLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const { x, y, width, height } = e.nativeEvent.layout
      throttleSetDimensions(x, y, width, height)
    },
    [throttleSetDimensions]
  )

  return { layout, onLayout }
}
