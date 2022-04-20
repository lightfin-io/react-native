import React from 'react'
import { View, StyleSheet, StyleProp, ViewStyle, Text } from 'react-native'

import { useLayoutObserver } from '../../hooks'

import { Candlestick, CandlestickMap } from './types'
import { DefaultLoadingNode } from './DefaultLoadingNode'

const defaultIntervals = [
  '1m',
  '3m',
  '5m',
  '15m',
  '30m',
  '1h',
  '2h',
  '4h',
  '6h',
  '8h',
  '12h',
  '1d',
  '3d',
  '1w',
  '1M',
]

const emptyData: CandlestickMap = {}

interface PriceChartProps {
  /** The market ID e.g. BTC-USD that the chart data is representing.
   * Displayed and also passed in callbacks such as `onDataRequested` */
  marketId: string
  /** The OHLC candlestick data for the chart, which is an object
   * indexed by open time */
  data: CandlestickMap
  /** The currently selected time interval of candle sticks */
  interval: string
  /** The possible intervals that the user can select. Defaults to ['1m',
   * '3m', '5m', '15m', '30m', '1h', '2h', '4h', '6h', '8h', '12h', '1d',
   * '3d', '1w', '1M']. */
  intervals?: string[]
  /** If you have an update for the open candle pass it in here. Ensure
   * that it is a new reference for each update. */
  openCandle?: Candlestick
  /** Called if the user selects another interval. You must then set this
   * and pass it in via the `interval` prop */
  onIntervalChange: (nextInterval: string) => void
  /** Called initially and whenever the user pans to a new time with data
   * that hasn't been fetched yet. It's your responsibility to fetch the
   * data and pass the updated data in via the `data` prop */
  onDataRequested: (marketId: string, interval: string, startTime: number, endTime: number) => void
  /** A custom loading node. Defaults to "Loading...". */
  loadingNode?: React.ReactNode
  /** Styles for the container (outer) view */
  style?: StyleProp<ViewStyle>
}

export function PriceChart({
  marketId,
  data = emptyData,
  interval,
  intervals = defaultIntervals,
  openCandle,
  onIntervalChange,
  onDataRequested,
  loadingNode = <DefaultLoadingNode />,
  style,
}: PriceChartProps) {
  const { onLayout, layout } = useLayoutObserver()
  const isEmpty = Object.keys(data).length === 0

  function renderContent() {
    if (isEmpty) {
      return loadingNode
    }

    if (!layout.width || !layout.height) {
      return null
    }

    return <Text>Price chart</Text>
  }

  return (
    <View style={[styles.container, style]} onLayout={onLayout}>
      {renderContent()}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
})
