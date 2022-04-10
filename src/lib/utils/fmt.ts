export const abbrevNumFmt = Intl.NumberFormat(undefined, {
  notation: 'compact',
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
}).format

export const priceFmt = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
}).format

export const sizeFmt = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 4,
  maximumFractionDigits: 4,
}).format
