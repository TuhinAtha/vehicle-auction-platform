import { z } from "zod"

import { price } from "@/lib/price"
import { euros } from "@/lib/validation"

export const getPlaceBidFormSchema = (minimum: number) =>
  z.object({
    amount: euros.min(minimum, `Must be at least ${price.format(minimum)}.`),
  })

export type PlaceBidFormValues = z.infer<
  ReturnType<typeof getPlaceBidFormSchema>
>
