import type { AuctionResult } from "@repo/shared"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

import { VEHICLE_QUERY_KEYS } from "@/features/vehicles/data/queryKeys"
import { confirmSold, markUnsold } from "../data/mutations"
import { AUCTION_QUERY_KEYS } from "../data/queryKeys"
import { serializeAuctionsSearchParams } from "../searchParams"

export const useSaveAuctionResult = (auctionId: string) => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (result: AuctionResult) =>
      (result === "SOLD" ? confirmSold : markUnsold)(auctionId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: AUCTION_QUERY_KEYS.all }),
        queryClient.invalidateQueries({ queryKey: VEHICLE_QUERY_KEYS.all }),
      ])
      router.push(
        serializeAuctionsSearchParams("/admin/auctions", { phase: "PENDING" })
      )
    },
  })
}
