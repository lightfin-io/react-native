import * as React from 'react'
import { NavigationContainer, DarkTheme } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { RootStackParamList } from './types'
import { HomeScreen, MarketDepthChartScreen, OrderbookScreen } from './screens'

const demoTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#101723',
    card: '#101723',
    primary: '#5981f2',
  },
}

const Stack = createNativeStackNavigator<RootStackParamList>()

export function App() {
  return (
    <NavigationContainer theme={demoTheme}>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="MarketDepthChart" component={MarketDepthChartScreen} />
        <Stack.Screen name="Orderbook" component={OrderbookScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
