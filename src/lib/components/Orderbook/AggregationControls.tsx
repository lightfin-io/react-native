import React from 'react'
import { ScrollView, StyleSheet } from 'react-native'

import { AggregationBtn } from './types'

interface AggregationControlsProps {
  aggregationBtn: AggregationBtn
  aggregationBorderColor: string
  tickSize: number
  tickSizes: number[]
  onChange: (nextTickSize: number) => void
}

export function AggregationControls({
  aggregationBtn,
  aggregationBorderColor,
  tickSizes,
  tickSize,
  onChange,
}: AggregationControlsProps) {
  return (
    <ScrollView
      style={[styles.container, { borderBottomColor: aggregationBorderColor }]}
      contentContainerStyle={styles.contentContainer}
    >
      {tickSizes.map(size => (
        <React.Fragment key={size}>{aggregationBtn(tickSize, size, onChange)}</React.Fragment>
      ))}
    </ScrollView>
  )
}

const controlHeight = 50

const styles = StyleSheet.create({
  container: {
    height: controlHeight,
    flexShrink: 0,
    flexGrow: 0,
    borderBottomWidth: 1,
  },
  contentContainer: {
    height: controlHeight,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    marginRight: 8,
  },
})
