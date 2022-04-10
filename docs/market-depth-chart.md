# Market Depth Chart

https://user-images.githubusercontent.com/760314/162641453-721bb45c-8b83-4352-9990-b04a9ecb0cda.mov

## Installation

```bash
yarn add @lightfin/react-native
```

```ts
import { MarketDepthChart } from '@lightfin/react-native'
```

## Example

You can find an example of the Market Depth Chart in the [MarketDepthChartScreen.tsx](../../master/src/screens/MarketDepthChartScreen.tsx).

```tsx
function MarketDepthChartScreen() {
  const { bids, asks } = useBinanceOrderbook('BTCBUSD')
  return <MarketDepthChart bids={bids} asks={asks} />
}
```

## Props

**`bids: OBLevel[]`**

An _ordered_ array of bid price levels `{ price, size, cumSize }` from best to worst (high price to low price).

**`asks: OBLevel[]`**

An _ordered_ array of ask price levels `{ price, size, cumSize }` from best to worst (low price to high price).

**`priceRange? number`**

The % from mid that you want to show the depth for. Defaults to 1%.

**`bgColor? string`**

The background color of the chart.

**`bidLineColor?: string`**

Bid line (stroke) color.

**`askLineColor?: string`**

Ask line (stroke) color.

**`axisLabelColor?: string`**

Axis label color.

**`axisTickColor?: React.ReactNode`**

Color of ticks (notches) on x axis.

**`axisYLineColor?: React.ReactNode`**

Color of y-axis lines on the chart.

**`axisYBottomLineColor?: React.ReactNode`**

Color of the bottom y-axis lines on the chart.

**`loadingNode?: React.ReactNode`**

A custom loading node. Defaults to "Loading...".
