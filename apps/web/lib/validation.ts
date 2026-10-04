import { z } from "zod"
export const wholeNumber = z
  .number("Enter a number.")
  .int("Enter a whole number.")
export const euros = wholeNumber.min(0, "Can't be negative.")
