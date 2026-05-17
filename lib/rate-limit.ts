// lib/rate-limit.ts
// Simple in-memory rate limiter — suitable for intern challenge scope.
// In production, replace with Redis (Upstash) for multi-instance safety.

const requests = new Map<string, number[]>()

/**
 * Returns true if the request is within the allowed rate.
 * @param key     Unique identifier, e.g. `ai:${userId}`
 * @param max     Max requests allowed in the window
 * @param windowMs  Window size in milliseconds (default 1 hour)
 */
export function checkRateLimit(key: string, max = 20, windowMs = 3_600_000): boolean {
  const now = Date.now()
  const windowStart = now - windowMs
  const timestamps = (requests.get(key) ?? []).filter((t) => t > windowStart)

  if (timestamps.length >= max) return false

  timestamps.push(now)
  requests.set(key, timestamps)
  return true
}
