import React, { useMemo } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { Skia, Canvas, Line, Group, Path, Paint, Text, vec } from '@shopify/react-native-skia'
import { scaleLinear } from 'd3-scale'
import type { ScaleLinear } from 'd3-scale'
import tinycolor from 'tinycolor2'

import { NTick, OBLevel } from '../../types'
import { useLayoutObserver } from '../../hooks'
import {
  getMidPrice,
  abbrevNumFmt,
  priceFmt,
  getClosestIndex,
  getClosestIndexRev,
  monoFamily,
} from '../../utils'

import { DefaultLoadingNode } from './DefaultLoadingNode'

const xAxisHeight = 30
const yAxisWidth = 32
const halfFontHeight = 4
const lineStrokeWidth = 1.5

type Scale = ScaleLinear<number, number, never>
enum Side {
  Bid,
  Ask,
}

export function levelsToPath(levels: OBLevel[], scaleX: Scale, scaleY: Scale, side: Side) {
  const path = Skia.Path.Make()

  if (levels.length <= 1) {
    return path
  }

  // Start from y 0.
  path.moveTo(scaleX(levels.at(0)?.price ?? 0), scaleY(0))

  for (let i = 0; i < levels.length; i++) {
    const level = levels[i]
    path.lineTo(scaleX(level.price), scaleY(level.cumSize))

    if (i < levels.length - 1) {
      const nextLevel = levels[i + 1]
      path.lineTo(scaleX(nextLevel.price), scaleY(level.cumSize))
    }
  }

  // Close off the line.
  if (side === Side.Bid) {
    path.lineTo(scaleX(0), scaleY(levels.at(-1)?.cumSize ?? 0))
    path.lineTo(scaleX(0), scaleY(0))
  } else {
    const endX = scaleX.domain()[1] + 3 // + 3 so the stroke isn't visible
    path.lineTo(scaleX(endX), scaleY(levels.at(-1)?.cumSize ?? 0))
    path.lineTo(scaleX(endX), scaleY(0))
  }
  // path.close()

  return path
}

interface MarketDepthChartProps {
  /** The sorted best to worst (high to low) bid levels */
  bids: OBLevel[]
  /** The sorted best to worst (low to high) ask levels */
  asks: OBLevel[]
  /** The % from mid that you want to show the depth for. Defaults to 1% */
  priceRange?: number
  /** The background color of the chart */
  bgColor?: string
  /** Bid line (stroke) color */
  bidLineColor?: string
  /** Ask line (stroke) color */
  askLineColor?: string
  /** Axis label color */
  axisLabelColor?: string
  /** Color of ticks (notches) on x axis */
  axisTickColor?: string
  /** Color of y-axis (horizontal) lines on the chart */
  axisYLineColor?: string
  /** Color of the bottom y-axis lines on the chart */
  axisYBottomLineColor?: string
  /** A custom loading node. Defaults to "Loading...". */
  loadingNode?: React.ReactNode
  /** Styles for the container (outer) view */
  style?: StyleProp<ViewStyle>
}

export function MarketDepthChart({
  bids,
  asks,
  priceRange = 1,
  bgColor = '#101723',
  bidLineColor = '#5981f2',
  askLineColor = 'rgb(246, 70, 93)',
  axisLabelColor = '#9ba0bd',
  axisTickColor = '#4a4c58',
  axisYBottomLineColor = '#353845',
  axisYLineColor = '#252731',
  loadingNode = <DefaultLoadingNode />,
  style,
}: MarketDepthChartProps) {
  const { onLayout, layout } = useLayoutObserver()

  const bestBid = bids[0]?.price ?? 0
  const bestAsk = asks[0]?.price ?? 0
  const midPrice = getMidPrice(bestBid, bestAsk)
  const fromMid = (priceRange / 100) * midPrice
  const startPrice = midPrice - fromMid
  const endPrice = midPrice + fromMid
  const bidFillColor = useMemo(() => tinycolor(bidLineColor).setAlpha(0.08).toRgbString(), [bidLineColor])
  const askFillColor = useMemo(() => tinycolor(askLineColor).setAlpha(0.08).toRgbString(), [askLineColor])

  // Slice off orders outside the price range.
  const rangedBids = useMemo(
    () => bids.slice(0, getClosestIndexRev(bids, startPrice, b => b.price) + 1),
    [midPrice, fromMid, bids]
  )
  const rangedAsks = useMemo(
    () => asks.slice(0, getClosestIndex(asks, endPrice, a => a.price) + 1),
    [midPrice, fromMid, asks]
  )
  const isEmpty = !rangedBids.length && !rangedAsks.length

  // Calc max cumulative order size for Y axis.
  const maxCumSize = useMemo(
    () =>
      Math.max(
        rangedBids[rangedBids.length - 1]?.cumSize ?? 0,
        rangedAsks[rangedAsks.length - 1]?.cumSize ?? 0
      ),
    [rangedBids, rangedAsks]
  )

  const scaleX = useMemo(
    () => scaleLinear().domain([startPrice, endPrice]).range([0, layout.width]),
    [layout.width, startPrice, endPrice]
  )
  const scaleY = useMemo(
    () =>
      scaleLinear()
        .domain([0, maxCumSize + (20 * maxCumSize) / 100])
        .range([layout.height - xAxisHeight, 0]),
    [0, maxCumSize]
  )

  const xTicks = useMemo(() => {
    if (!layout.width) {
      return []
    }

    const domain = scaleX.domain()
    if (domain[0] === domain[1]) {
      return []
    }

    const padding = 40

    return [
      [padding, scaleX.invert(padding)],
      [layout.width / 2, midPrice],
      [layout.width - padding, scaleX.invert(layout.width - padding)],
    ]
  }, [layout.width, scaleX])

  const yTicks = useMemo(() => {
    if (!layout.height) {
      return []
    }

    const domain = scaleY.domain()
    if (domain[0] === domain[1]) {
      return []
    }

    const availableHeight = layout.height - xAxisHeight

    const spacePerTick = 80
    const axisStep = Math.floor(availableHeight / spacePerTick)
    const distance = availableHeight / axisStep

    const ticks: NTick[] = []

    for (let i = 1; i <= axisStep - 1; i++) {
      const coord = availableHeight - i * distance
      ticks.push([coord, scaleY.invert(coord)])
    }

    return ticks
  }, [layout.height, scaleY])

  const bidPath = useMemo(
    () => levelsToPath(rangedBids, scaleX, scaleY, Side.Bid),
    [rangedBids, scaleX, scaleY, Side.Bid]
  )
  const askPath = useMemo(
    () => levelsToPath(rangedAsks, scaleX, scaleY, Side.Ask),
    [rangedAsks, scaleX, scaleY, Side.Ask]
  )

  function renderContent() {
    if (isEmpty) {
      return loadingNode
    }

    if (!layout.width || !layout.height) {
      return null
    }

    return (
      <Canvas style={{ width: layout.width, height: layout.height }}>
        {yTicks.map(([coord, value]) => (
          <React.Fragment key={coord}>
            <Line
              p1={vec(0, coord - halfFontHeight)}
              p2={vec(layout.width - yAxisWidth - 4, coord - halfFontHeight)}
              style="stroke"
              color={axisYLineColor}
              strokeWidth={1}
            />
            <Text
              y={coord - 1}
              x={layout.width - 28}
              color={axisLabelColor}
              size={10}
              familyName={monoFamily}
              text={abbrevNumFmt(value)}
            />
          </React.Fragment>
        ))}
        <Path path={bidPath} color={bidLineColor} style="stroke" strokeWidth={1}>
          <Paint color={bidFillColor} />
        </Path>
        <Path path={askPath} color={askLineColor} style="stroke" strokeWidth={1}>
          <Paint color={askFillColor} />
        </Path>
        <Group transform={[{ translateY: layout.height - xAxisHeight }]}>
          <Line p1={vec(0, 0)} p2={vec(layout.width, 0)} color={bgColor} style="stroke" strokeWidth={2} />
          <Line
            p1={vec(0, 0)}
            p2={vec(layout.width, 0)}
            color={axisYBottomLineColor}
            style="stroke"
            strokeWidth={1}
          />
          {xTicks.map(([coord, value]) => {
            const label = priceFmt(value)
            const centerX = coord - (label.length / 2) * 5
            return (
              <React.Fragment key={coord}>
                <Line
                  p1={vec(coord, 1)}
                  p2={vec(coord, 6)}
                  color={axisTickColor}
                  style="stroke"
                  strokeWidth={1}
                />
                <Text
                  y={20}
                  x={centerX}
                  color={axisLabelColor}
                  familyName={monoFamily}
                  size={10}
                  text={label}
                />
              </React.Fragment>
            )
          })}
        </Group>
      </Canvas>
    )
  }

  return (
    <View style={[styles.container, style, { backgroundColor: bgColor }]} onLayout={onLayout}>
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
