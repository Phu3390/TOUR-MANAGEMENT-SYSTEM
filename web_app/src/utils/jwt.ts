import type { StaticUserRole } from './userRoles'

export interface JwtPayload {
  sub: string
  scope: StaticUserRole
  fullName: string
  userId: string
  iat: number
  exp: number
}

/**
 * Decode JWT token and extract payload
 * @param token JWT token string
 * @returns Decoded JWT payload or null if invalid
 */
export function decodeJwt(token: string): JwtPayload | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null

    const decoded = JSON.parse(atob(parts[1]))
    return decoded as JwtPayload
  } catch {
    return null
  }
}

/**
 * Get user role from token
 * @param token JWT token string
 * @returns User role or null if token is invalid
 */
export function getRoleFromToken(token: string | null): StaticUserRole | null {
  if (!token) return null
  const payload = decodeJwt(token)
  return payload?.scope || null
}

/**
 * Check if token is expired
 * @param token JWT token string
 * @returns true if expired, false otherwise
 */
export function isTokenExpired(token: string | null): boolean {
  if (!token) return true
  const payload = decodeJwt(token)
  if (!payload?.exp) return true
  return payload.exp * 1000 < Date.now()
}
