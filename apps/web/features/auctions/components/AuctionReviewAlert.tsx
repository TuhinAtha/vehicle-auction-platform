import type { AuctionDetailAdmin, BidWithDealer } from "@repo/shared"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { price } from "@/lib/price"

export const AuctionReviewAlert = ({
  auction,
  highestBid,
}: {
  auction: AuctionDetailAdmin
  highestBid: BidWithDealer | null
}) => {
  const reserve = price.format(auction.reservePrice)

  return (
    <>
      <Alert className="border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
        <AlertTitle>Review the result</AlertTitle>
        <AlertDescription className="text-amber-800 dark:text-amber-300">
          {highestBid ? (
            <>
              Highest bid: {price.format(highestBid.amount)} from{" "}
              {highestBid.dealer.name}.{" "}
              {highestBid.amount >= auction.reservePrice
                ? `This meets the reserve of ${reserve}.`
                : `This is ${price.format(auction.reservePrice - highestBid.amount)} below the reserve of ${reserve}.`}
            </>
          ) : (
            "No bids were placed."
          )}
        </AlertDescription>
      </Alert>
      <div className="flex flex-col gap-2">
        {highestBid && (
          <Button type="button" size="lg" className="w-full">
            Confirm sold · {price.format(highestBid.amount)}
          </Button>
        )}
        <Button type="button" size="lg" variant="outline" className="w-full">
          Mark as unsold
        </Button>
      </div>
    </>
  )
}
