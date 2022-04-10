import React, { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import Svg, { G, Line, Polygon, Text } from 'react-native-svg'
import { scaleLinear } from 'd3-scale'
import type { ScaleLinear } from 'd3-scale'
import tinycolor from 'tinycolor2'

import { NTick, OBLevel } from '../../types'
import { useLayoutObserver } from '../../hooks'
import { getMidPrice, abbrevNumFmt, priceFmt } from '../../utils'
import { getClosestIndex, getClosestIndexRev } from '../../utils/getClosestIndex'

import { DefaultLoadingNode } from './DefaultLoadingNode'

const xAxisHeight = 44
const yAxisWidth = 32
const halfFontHeight = 4
const lineStrokeWidth = 1.5

type Scale = ScaleLinear<number, number, never>
enum Side {
  Bid,
  Ask,
}

export function levelsToPoints(levels: OBLevel[], scaleX: Scale, scaleY: Scale, side: Side) {
  let s = ''

  // Start from y 0.
  if (levels.length > 1) {
    s += ` ${scaleX(levels.at(0)?.price ?? 0)}, ${scaleY(0)}`
  }

  for (let i = 0; i < levels.length; i++) {
    const level = levels[i]
    s += ` ${scaleX(level.price)},${scaleY(level.cumSize)}`
  }

  // Close off the line.
  if (levels.length > 1) {
    if (side === Side.Bid) {
      s += ` ${scaleX(0)}, ${scaleY(levels.at(-1)?.cumSize ?? 0)} ${scaleX(0)}, ${scaleY(0)}`
    } else {
      // + 3 so the stroke isn't visible
      const endX = scaleX.domain()[1] + 3
      s += ` ${scaleX(endX)}, ${scaleY(levels.at(-1)?.cumSize ?? 0)} ${scaleX(endX)}, ${scaleY(0)}`
    }
  }

  return s.substring(1)
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
}

export function MarketDepthChart({
  bids,
  asks,
  priceRange = 1,
  bgColor = '#101723',
  bidLineColor = '#5981f2',
  askLineColor = 'rgb(246, 70, 93)',
  axisLabelColor = '#9ba0bd',
  axisTickColor = '#bfc5df',
  axisYBottomLineColor = '#353845',
  axisYLineColor = '#252731',
  loadingNode = <DefaultLoadingNode />,
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

  function renderContent() {
    if (isEmpty) {
      return loadingNode
    }

    return (
      <>
        {Boolean(layout.width && layout.height) && (
          <Svg width={layout.width} height={layout.height}>
            {yTicks.map(([coord, value]) => (
              <React.Fragment key={coord}>
                <Line
                  x1={0}
                  y1={coord - halfFontHeight}
                  x2={layout.width - yAxisWidth - 4}
                  y2={coord - halfFontHeight}
                  stroke={axisYLineColor}
                  strokeWidth="1"
                />
                <Text
                  key={coord}
                  textAnchor="end"
                  translateY={coord}
                  translateX={layout.width - 8}
                  fill={axisLabelColor}
                  fontSize={10}
                >
                  {abbrevNumFmt(value)}
                </Text>
              </React.Fragment>
            ))}
            <Polygon
              points={levelsToPoints(rangedBids, scaleX, scaleY, Side.Bid)}
              fill={bidFillColor}
              stroke={bidLineColor}
              strokeWidth={lineStrokeWidth}
            />
            <Polygon
              points={levelsToPoints(rangedAsks, scaleX, scaleY, Side.Ask)}
              fill={askFillColor}
              stroke={askLineColor}
              strokeWidth={lineStrokeWidth}
            />
            <G translateY={layout.height - xAxisHeight}>
              <Line x1="0" y1="0" x2={layout.width} y2="0" stroke={bgColor} strokeWidth="2" />
              <Line x1="0" y1="0" x2={layout.width} y2="0" stroke={axisYBottomLineColor} strokeWidth="1" />
              {xTicks.map(([coord, value]) => (
                <React.Fragment key={coord}>
                  <Line x1={coord} y1="1" x2={coord} y2="6" stroke={axisTickColor} strokeWidth="1" />
                  <Text
                    textAnchor="middle"
                    translateY={20}
                    translateX={coord}
                    fill={axisLabelColor}
                    fontSize={10}
                  >
                    {priceFmt(value)}
                  </Text>
                </React.Fragment>
              ))}
            </G>
          </Svg>
        )}
      </>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]} onLayout={onLayout}>
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
