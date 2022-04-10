import { useEffect, useMemo, useRef, useState } from 'react'
import useWebSocket from 'react-use-websocket'

import { OBLevel } from '../lib'

type LevelArrayItem = [price: string, amount: string]
type LevelArray = Array<LevelArrayItem>
type LevelMap = Map<string, string>

interface SnapshotResponse {
  lastUpdateId: number
  bids: LevelArray
  asks: LevelArray
}

interface DepthMessage {
  // The first processed event should have U <= lastUpdateId+1 AND u >= lastUpdateId+1.
  // While listening to the stream, each new event's U should be equal to the previous event's u+1.
  U: number
  // Drop any event where u is <= lastUpdateId in the snapshot.
  u: number
  b: LevelArray
  a: LevelArray
}

function updateLevels(levelMap: LevelMap, updates: LevelArrayItem[]) {
  updates.forEach(([price, amount]) => {
    if (Number(amount) === 0) {
      levelMap.delete(price)
    } else {
      levelMap.set(price, amount)
    }
  })
}

function mapToLevelsArray(levelMap: LevelMap) {
  const levels: OBLevel[] = []
  levelMap.forEach((size, price) => {
    levels.push({
      price: Number(price),
      size: Number(size),
      cumSize: 0,
    })
  })
  return levels
}

function makeBidLevels(levelMap: LevelMap) {
  const levels = mapToLevelsArray(levelMap)

  // Sort high to low.
  const bids = levels.sort((a, b) => b.price - a.price)

  let cumSize = 0
  let maxBidSize = 0

  // Sum up sizes.
  bids.forEach(bid => {
    if (bid.size > maxBidSize) maxBidSize = bid.size
    cumSize += bid.size
    bid.cumSize = cumSize
  })

  return { bids, maxBidSize }
}

function makeAskLevels(levelMap: LevelMap) {
  const levels = mapToLevelsArray(levelMap)

  // Sort low to high.
  const asks = levels.sort((a, b) => a.price - b.price)

  let cumSize = 0
  let maxAskSize = 0

  // Sum up sizes.
  asks.forEach(ask => {
    if (ask.size > maxAskSize) maxAskSize = ask.size
    cumSize += ask.size
    ask.cumSize = cumSize
  })

  return { asks, maxAskSize }
}

interface Orderbook {
  loaded: boolean
  bids: OBLevel[]
  asks: OBLevel[]
  maxBidSize: number
  maxAskSize: number
}

const emptyOrderbook: Orderbook = {
  loaded: false,
  bids: [],
  asks: [],
  maxBidSize: 0,
  maxAskSize: 0,
}

// Just for demo purposes, a prod implementation should follow the updateID checking rules:
// https://github.com/binance-us/binance-official-api-docs/blob/master/web-socket-streams.md#how-to-manage-a-local-order-book-correctly
export function useBinanceOrderbook(symbol: string) {
  const [websocketReady, setWebsocketReady] = useState(false)
  const [orderbook, setOrderbook] = useState(emptyOrderbook)
  const bidsMap = useRef<LevelMap>(new Map())
  const asksMap = useRef<LevelMap>(new Map())
  // Some of their APIs need lowercase, some upper... 💩
  const lowerCaseSymbol = useMemo(() => symbol.toLowerCase(), [symbol])

  // Snapshot.
  useEffect(() => {
    if (websocketReady) {
      setOrderbook(emptyOrderbook)
      fetch(`https://api.binance.com/api/v3/depth?symbol=${symbol}&limit=1000`)
        .then(r => r.json() as Promise<SnapshotResponse>)
        .then(r => {
          bidsMap.current = new Map(r.bids)
          asksMap.current = new Map(r.asks)

          const { bids, maxBidSize } = makeBidLevels(bidsMap.current)
          const { asks, maxAskSize } = makeAskLevels(asksMap.current)

          setOrderbook({
            loaded: true,
            bids,
            asks,
            maxBidSize,
            maxAskSize,
          })
        })
    }
  }, [websocketReady, symbol])

  // Delta.
  const { lastJsonMessage, sendJsonMessage } = useWebSocket('wss://stream.binance.com/stream')

  useEffect(() => {
    const id = Math.round(Math.random() * 0xffffff)

    setWebsocketReady(false)
    sendJsonMessage({
      id,
      method: 'SUBSCRIBE',
      params: [`${lowerCaseSymbol}@depth`], // 5,10,20
    })

    return () => {
      sendJsonMessage({
        id,
        method: 'UNSUBSCRIBE',
        params: [`${lowerCaseSymbol}@depth`],
      })
    }
  }, [sendJsonMessage, lowerCaseSymbol])

  useEffect(() => {
    if (lastJsonMessage && lastJsonMessage.stream === `${lowerCaseSymbol}@depth`) {
      setWebsocketReady(true)

      if (orderbook.loaded) {
        const data = lastJsonMessage.data as DepthMessage
        updateLevels(bidsMap.current, data.b)
        updateLevels(asksMap.current, data.a)

        // Binance throttles their messages to 1s by default, if your
        // API doesn't then this state update should be throttled.
        const { bids, maxBidSize } = makeBidLevels(bidsMap.current)
        const { asks, maxAskSize } = makeAskLevels(asksMap.current)

        setOrderbook({
          loaded: true,
          bids,
          asks,
          maxBidSize,
          maxAskSize,
        })
      }
    }
  }, [orderbook.loaded, lastJsonMessage, lowerCaseSymbol])

  return orderbook
}
