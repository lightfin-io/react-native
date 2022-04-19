import React from 'react'
import { View, Button } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

import { RootStackParamList } from '../types'

export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>

export function HomeScreen({ navigation }: HomeScreenProps) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Go to Orderbook" onPress={() => navigation.navigate('Orderbook')} />
      <Button title="Go to Market Depth Chart" onPress={() => navigation.navigate('MarketDepthChart')} />
      <Button title="Go to Price Chart" onPress={() => navigation.navigate('PriceChart')} />
    </View>
  )
}
