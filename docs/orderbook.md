# Orderbook

https://user-images.githubusercontent.com/760314/162643278-90a79b66-5263-45e9-aa3c-eb1329fdeb99.mov

## Installation

```bash
yarn add @lightfin/react-native
```

```ts
import { Orderbook } from '@lightfin/react-native'
```

## Example

You can find an example of the orderbook in the [OrderbookScreen.tsx](../../src/screens/OrderbookScreen.tsx).

```tsx
function OrderbookScreen() {
  const { bids, asks } = useBinanceOrderbook('BTCBUSD')
  const [tickSize, setTickSize] = useState(baseTickSize)
  return (
    <Orderbook
      bids={bids}
      asks={asks}
      aggregation={{
        baseTickSize,
        tickSizes,
        tickSize,
        onTickSizeChange: setTickSize,
      }}
      sizeLabel="Size (BTC)"
    />
  )
}
```

## Props

**`bids: OBLevel[]`**

An _ordered_ array of bid price levels `{ price, size, cumSize }` from best to worst (high price to low price).

**`asks: OBLevel[]`**

An _ordered_ array of ask price levels `{ price, size, cumSize }` from best to worst (low price to high price).

**`maxLevelsPerSide? number`**

The maximum price levels to render and aggregate per side. Defaults to 30.

**`aggregation?: OBAggregation`**

An optional object which describes how to aggregate the orderbook.

```ts
interface OBAggregation {
  /** The natural tick size of this instrument */
  baseTickSize: number
  /** The currently selected tick size */
  tickSize: number
  /** The possible tick sizes the user can select. You can omit this and
   * `onTickSizeChange` if you don't want aggregation controls to be rendered. */
  tickSizes: number[]
  /** Called when a user selects another aggregation */
  onTickSizeChange: (nextTickSize: number) => void
}
```

**`aggregationBtn?: AggregationBtn`**

A function which passes `(selectedTickSize, tickSize, onChange)` and returns a `ReactNode`. Use this if you want to render custom aggregation buttons.

**`aggregationBorderColor?: string`**

Use to change the bottom border color of the aggregation controls.

**`priceFormatter?: (n: number) => React.ReactNode`**

Use to change how prices are formatted. The default is thousand separators with 2 decimal places.

**`sizeFormatter?: (n: number) => React.ReactNode`**

Use to change how sizes are formatted. The default is thousand separators with 4 decimal places.

**`columnLabelColor?: string`**

The label color of column headers (the "Size" columns).

**`sizeColor?: string`**

The text color of size cells in the level rows.

**`bidPriceColor?: string`**

The text color of bid price cells in the level rows.

**`askPriceColor?: string`**

The text color of ask price cells in the level rows.

**`sizeLabel?: ReactNode`**

Customize the column header lable of the the size columns. Defaults to "Size".

**`style?: StyleProp<ViewStyle>`**

Styles for orderbook container view

**`cellTextStyle?: StyleProp<TextStyle>`**

Styles for a column cell Text element. Typically used to change font, use `sizeColor`, `bidPriceColor`, `askPriceColor` to change the color.

**`midPriceNode?: (midPrice: number) => React.ReactNode`**

A function which receives the mid price and can return a custom mid price node.

**`loadingNode?: React.ReactNode`**

A custom loading node. Defaults to "Loading...".
