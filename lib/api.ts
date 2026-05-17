import { NextResponse } from 'next/server'

// ─── Consistent API response shape ───────────────────────────────────────────
// All routes return: { data: T | null, error: string | null }
// This makes client-side handling uniform and predictable.

export function success<T>(data: T, status = 200): NextResponse {
  return NextResponse.json({ data, error: null }, { status })
}

export function fail(message: string, status = 400): NextResponse {
  return NextResponse.json({ data: null, error: message }, { status })
}
