import React from 'react'

export type AggregationBtn = (
  /** The currently selected tick size */
  selectedTickSize: number,
  /** The tick size of this button */
  tickSize: number,
  /** Should be called on press of the button, passing this button's tick size */
  onChange: (tickSize: number) => void
) => React.ReactNode
