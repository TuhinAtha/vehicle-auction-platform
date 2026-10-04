/** Time left until `target` as its two largest units, e.g. `1d 1h`, `5h 12m`, `45s`. */
export function formatCountdown(target: string | Date, now = Date.now()) {
  const total = Math.max(
    0,
    Math.floor((new Date(target).getTime() - now) / 1000)
  )
  const days = Math.floor(total / 86_400)
  const hours = Math.floor((total % 86_400) / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const seconds = total % 60

  if (days > 0) return `${days}d ${hours}h`
  if (hours > 0) return `${hours}h ${minutes}m`
  if (minutes > 0) return `${minutes}m ${seconds}s`
  return `${seconds}s`
}
