import type { Auction } from '../interfaces/auction.interface'

/** Lowest amount a dealer may bid, given their own highest bid so far. */
export function getMinimumBid(
  {
    startingPrice,
    minIncrement,
  }: Pick<Auction, 'startingPrice' | 'minIncrement'>,
  ownHighestAmount: number | null,
) {
  return ownHighestAmount === null
    ? startingPrice
    : ownHighestAmount + minIncrement
}
