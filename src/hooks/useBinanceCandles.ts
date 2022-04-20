import { useEffect, useMemo, useState } from 'react'
import useWebSocket from 'react-use-websocket'

// m -> minutes; h -> hours; d -> days; w -> weeks; M -> months
type Interval =
  | '1m'
  | '3m'
  | '5m'
  | '15m'
  | '30m'
  | '1h'
  | '2h'
  | '4h'
  | '6h'
  | '8h'
  | '12h'
  | '1d'
  | '3d'
  | '1w'
  | '1M'

type Candlestick = [
  openTime: number, // e.g. 1499040000000
  open: string, // e.g. "0.01634790"
  high: string, // e.g. "0.80000000"
  low: string, // e.g. "0.01575800"
  close: string, // e.g. "0.01577100"
  volume: string, // e.g. "148976.11427815"
  closeTime: number, // e.g. 1499644799999
  quoteAssetVolumes: string, // e.g. "2434.19055334"
  numberOfTrades: number, // e.g. 308
  baseAssetVolume: string, // e.g. "1756.87402397"
  quoteAssetVolume: string // e.g. "28.46694368"
]

type KlineSnapshot = Candlestick[]

interface KlineDelta {
  e: 'kline' // Event type
  E: number // Event time
  s: string // Symbol
  k: {
    t: number // Kline start time
    T: number // Kline close time
    s: string // Symbol
    i: Interval // Interval
    f: number // First trade ID
    L: number // Last trade ID
    o: string // Open price
    c: string // Close price
    h: string // High price
    l: string // Low price
    v: string // Base asset volume
    n: number // Number of trades
    x: boolean // Is this kline closed?
    q: string // Quote asset volume
    V: string // Taker buy base asset volume
    Q: string // Taker buy quote asset volume
    B: string // Ignore
  }
}

export function useBinanceCandles(marketId: string, interval: Interval, startTime: number, endTime: number) {
  // Some of their APIs need lowercase, some upper...
  const lowerMarketId = useMemo(() => marketId.toLowerCase(), [marketId])
  const [candles, setCandles] = useState<Record<string, Candlestick>>({})

  // Snapshot.
  useEffect(() => {
    // limit=1000 // default 500
    fetch(
      `https://api.binance.com/api/v3/klines?symbol=${marketId}&interval=${interval}&startTime=${startTime}&endTime=${endTime}`
    )
      .then(r => {
        if (!r.ok) {
          const err = new Error(r.statusText)
          ;(err as any).code = r.status
          throw err
        }
        return r
      })
      .then(r => r.json() as Promise<KlineSnapshot>)
      .then(data => {
        console.log(data)
      })
  }, [marketId, interval, startTime, endTime])

  // Delta.
  const { lastJsonMessage, sendJsonMessage } = useWebSocket('wss://stream.binance.com/stream')

  useEffect(() => {
    const id = Math.round(Math.random() * 0xffffff)

    sendJsonMessage({
      id,
      method: 'SUBSCRIBE',
      params: [`${lowerMarketId}@kline_1m`],
    })

    return () => {
      sendJsonMessage({
        id,
        method: 'UNSUBSCRIBE',
        params: [`${lowerMarketId}@kline_1m`],
      })
    }
  }, [sendJsonMessage, lowerMarketId])

  useEffect(() => {
    if (lastJsonMessage && lastJsonMessage.stream === `${lowerMarketId}@depth`) {
      const delta = lastJsonMessage as KlineDelta
      console.log(lastJsonMessage)
    }
  }, [lastJsonMessage, lowerMarketId])

  // https://binance-docs.github.io/apidocs/spot/en/#trade-streams
}
