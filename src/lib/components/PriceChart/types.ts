export type Candlestick = [
  /** The open time for this time window (ms since epoch) */
  openTime: number,
  /** The open price for this time window */
  open: string | number,
  /** The high price in this time window */
  high: string | number,
  /** The low price in this time window */
  low: string | number,
  /** The close price for this time window */
  close: string | number,
  /** If you don't have volume data or don't want
   * to show volume you can set this to 0. */
  volume: string | number,
  /** The close time for this time window (ms since epoch) */
  closeTime: number
]

export type CandlestickMap = Record<string, Candlestick>
