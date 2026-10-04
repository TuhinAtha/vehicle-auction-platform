import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import {
  getPlaceBidFormSchema,
  type PlaceBidFormValues,
} from "../lib/placeBidFormSchema"

export const usePlaceBidForm = (minimum: number) => {
  return useForm<PlaceBidFormValues>({
    resolver: zodResolver(getPlaceBidFormSchema(minimum)),
    defaultValues: { amount: minimum },
  })
}
