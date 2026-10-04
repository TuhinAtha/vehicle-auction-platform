import { QueryFailedError } from 'typeorm'

export const PgErrorCode = {
  UniqueViolation: '23505',
} as const

export type PgErrorCode = (typeof PgErrorCode)[keyof typeof PgErrorCode]

export function isPgError(error: unknown, code: PgErrorCode) {
  return (
    error instanceof QueryFailedError &&
    (error.driverError as { code?: string }).code === code
  )
}
