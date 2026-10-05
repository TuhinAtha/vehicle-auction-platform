"use client"

import type { AuctionDetailAdmin, BidWithDealer } from "@repo/shared"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { ApiError } from "@/lib/http"
import { price } from "@/lib/intl"
import { useSaveAuctionResult } from "../hooks/useSaveAuctionResult"

export const AuctionReview = ({
  auction,
  highestBid,
}: {
  auction: AuctionDetailAdmin
  highestBid: BidWithDealer | null
}) => {
  const { potentialWinningBid } = auction
  const reserve = price.format(auction.reservePrice)
  const {
    mutate: saveResult,
    isPending,
    variables: savingResult,
    error,
  } = useSaveAuctionResult(auction.id)

  return (
    <>
      <Alert className="border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
        <AlertTitle>Review the result</AlertTitle>
        <AlertDescription className="text-amber-800 dark:text-amber-300">
          {highestBid ? (
            <>
              Highest bid: {price.format(highestBid.amount)} from{" "}
              {highestBid.dealer.name}.{" "}
              {potentialWinningBid
                ? `This meets the reserve of ${reserve}.`
                : `This is ${price.format(auction.reservePrice - highestBid.amount)} below the reserve of ${reserve}.`}
            </>
          ) : (
            "No bids were placed."
          )}
        </AlertDescription>
      </Alert>
      <div className="flex flex-col gap-2">
        {potentialWinningBid && (
          <Button
            type="button"
            size="lg"
            className="w-full"
            disabled={isPending}
            onClick={() => saveResult("SOLD")}
          >
            {isPending && savingResult === "SOLD"
              ? "Saving…"
              : `Confirm sold · ${price.format(potentialWinningBid.amount)}`}
          </Button>
        )}
        <Button
          type="button"
          size="lg"
          variant="outline"
          className="w-full"
          disabled={isPending}
          onClick={() => saveResult("UNSOLD")}
        >
          {isPending && savingResult === "UNSOLD"
            ? "Saving…"
            : "Mark as unsold"}
        </Button>
      </div>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>
            {error instanceof ApiError
              ? error.message
              : "Something went wrong. Please try again."}
          </AlertDescription>
        </Alert>
      )}
    </>
  )
}
