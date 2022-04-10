export interface OBLevel {
  /** The price of this level */
  price: number
  /** The size of this level */
  size: number
  /** The cumulative size of all levels up to and including this one */
  cumSize: number
}

export type Tick<T> = [coord: number, value: T]
export type NTick = Tick<number>
