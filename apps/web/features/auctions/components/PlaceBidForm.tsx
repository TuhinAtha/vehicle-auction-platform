"use client"

import { type AuctionDetailDealer, getMinimumBid } from "@repo/shared"
import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useController } from "react-hook-form"

import { NumberStepper } from "@/components/NumberStepper"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { ApiError } from "@/lib/http"
import { price } from "@/lib/intl"
import { placeBid, raiseBid } from "../data/mutations"
import { AUCTION_QUERY_KEYS } from "../data/queryKeys"
import { usePlaceBidForm } from "../hooks/usePlaceBidForm"
import { serializeMyBidsSearchParams } from "../searchParams"
import type { PlaceBidFormValues } from "../lib/placeBidFormSchema"

export const PlaceBidForm = ({ auction }: { auction: AuctionDetailDealer }) => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { myBid, minIncrement } = auction
  const minimum = getMinimumBid(auction, myBid?.amount ?? null)
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = usePlaceBidForm(minimum)
  const { field } = useController({ control, name: "amount" })

  const onSubmit = async ({ amount }: PlaceBidFormValues) => {
    try {
      await (myBid ? raiseBid : placeBid)(auction.id, amount)
    } catch (error) {
      setError("root", {
        message:
          error instanceof ApiError
            ? error.message
            : "Something went wrong. Please try again.",
      })
      return
    }

    await queryClient.invalidateQueries({ queryKey: AUCTION_QUERY_KEYS.all })
    router.push(
      serializeMyBidsSearchParams("/dealer/mybids", { phase: "ACTIVE" })
    )
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-3"
    >
      <Field data-invalid={!!errors.amount}>
        <FieldLabel htmlFor="amount">Your bid</FieldLabel>
        <NumberStepper
          id="amount"
          suffix="€"
          min={minimum}
          step={minIncrement}
          value={field.value ?? null}
          onChange={field.onChange}
          aria-invalid={!!errors.amount}
          aria-describedby="amount-hint"
        />
        <FieldError errors={[errors.amount]} />
        <FieldDescription id="amount-hint">
          Minimum {price.format(minimum)} (
          {myBid ? "your bid plus the minimum increment" : "starting price"}).
        </FieldDescription>
      </Field>

      {errors.root && (
        <Alert variant="destructive">
          <AlertDescription>{errors.root.message}</AlertDescription>
        </Alert>
      )}

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Placing…" : myBid ? "Raise bid" : "Place bid"}
      </Button>
      <p className="text-xs text-muted-foreground">
        Your bid is sealed. You can raise it until the auction ends, but you
        cannot lower or withdraw it.
      </p>
    </form>
  )
}
