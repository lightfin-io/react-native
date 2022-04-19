import React from 'react'
import { View, FlatList, StyleSheet, StyleProp, ViewStyle, TextStyle, Text } from 'react-native'

import { getMidPrice, monoFamily, priceFmt, sizeFmt } from '../../utils'
import { OBLevel } from '../../types'
import { useLayoutObserver } from '../../hooks'

interface PriceChartProps {
  /** Styles for the container (outer) view */
  style?: StyleProp<ViewStyle>
}

export function PriceChart({ style }: PriceChartProps) {
  const { onLayout, layout } = useLayoutObserver()

  return (
    <View style={[styles.container, style]} onLayout={onLayout}>
      <Text>Price chart</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
})
