import React from 'react'
import { Text } from 'react-native'

import { monoFamily, priceFmt } from '../../utils'

export const defaultMidPriceNode = (midPrice: number) => (
  <Text style={{ fontWeight: 'bold', fontFamily: monoFamily, color: 'white' }}>{priceFmt(midPrice)}</Text>
)
