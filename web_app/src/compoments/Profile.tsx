import { useMemo, useState } from 'react'
import { getMe } from '../api/auth/user.api'
import type { UserResponse } from '../types/auth/user.type'

type JwtPayload = {
  sub?: string
  name?: string
  fullName?: string
  username?: string
  preferred_username?: string
  email?: string
  scope?: string
  scp?: string
}

function decodeJwtPayload(token: string): JwtPayload | null {
  const parts = token.split('.')
  if (parts.length < 2) return null

  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')
    const json = decodeURIComponent(
      atob(padded)
        .split('')
        .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`)
        .join('')
    )

    return JSON.parse(json) as JwtPayload
  } catch {
    return null
  }
}

export default function HeaderProfile() {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isLoadingProfile, setIsLoadingProfile] = useState(false)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [profile, setProfile] = useState<UserResponse | null>(null)

  const displayName = useMemo(() => {
    if (typeof window === 'undefined') {
      return 'Admin User'
    }

    const token = localStorage.getItem('token')
    if (!token) {
      return 'Admin User'
    }

    const payload = decodeJwtPayload(token)
    return (
      payload?.fullName?.trim() ||
      payload?.name?.trim() ||
      payload?.username?.trim() ||
      payload?.preferred_username?.trim() ||
      payload?.sub?.trim() ||
      payload?.email?.trim() ||
      'Admin User'
    )
  }, [])

  const scopeLabel = useMemo(() => {
    if (typeof window === 'undefined') {
      return 'SCOPE'
    }

    const token = localStorage.getItem('token')
    if (!token) {
      return 'SCOPE'
    }

    const payload = decodeJwtPayload(token)
    const rawScope = payload?.scope || payload?.scp || ''
    const firstScope = rawScope.split(' ').find(Boolean) || ''

    if (!firstScope) {
      return 'SCOPE'
    }

    return firstScope.length > 12 ? `${firstScope.slice(0, 12)}...` : firstScope
  }, [])

  const openProfileDialog = async () => {
    setIsProfileOpen(true)

    if (profile || isLoadingProfile) {
      return
    }

    try {
      setIsLoadingProfile(true)
      setProfileError(null)

      const res = await getMe()
      if (!res?.data) {
        setProfileError('Khong co du lieu nguoi dung')
        return
      }

      setProfile(res.data)
    } catch {
      setProfileError('Khong the tai thong tin nguoi dung')
    } finally {
      setIsLoadingProfile(false)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={openProfileDialog}
        className="flex shrink-0 items-center gap-3 border-l border-slate-200 pl-3 text-left transition-colors hover:text-violet-700 sm:pl-4"
      >
        <span className="hidden leading-tight sm:block">
          <span className="block text-sm font-semibold text-slate-900">{displayName}</span>
        </span>
        <span className="relative grid h-10 w-10 place-items-center rounded-full border-2 border-blue-600 bg-blue-50 text-lg transition-colors hover:border-violet-600">
          <span aria-hidden="true">👤</span>
          <span className="absolute -bottom-1 -right-2 rounded-full border border-white bg-blue-600 px-1.5 py-0.5 text-[10px] font-semibold uppercase leading-none text-white shadow-sm">
            {scopeLabel}
          </span>
        </span>
      </button>

      {isProfileOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 p-4" onClick={() => setIsProfileOpen(false)}>
          <div
            className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-5 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-slate-900">Thong tin nguoi dung</h3>
              <button
                type="button"
                onClick={() => setIsProfileOpen(false)}
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {isLoadingProfile && <p className="text-sm text-slate-600">Dang tai thong tin...</p>}

            {!isLoadingProfile && profileError && <p className="text-sm text-rose-600">{profileError}</p>}

            {!isLoadingProfile && !profileError && profile && (
              <div className="space-y-3 text-sm text-slate-700">
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Ho va ten</p>
                  <p className="mt-1 font-semibold text-slate-900">{profile.fullName || 'Chua cap nhat'}</p>
                </div>

                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Email</p>
                  <p className="mt-1 font-medium text-slate-900">{profile.email || 'Chua cap nhat'}</p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs uppercase tracking-wide text-slate-500">Vai tro</p>
                    <p className="mt-1 font-medium text-slate-900">{profile.role?.name || 'Chua cap nhat'}</p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs uppercase tracking-wide text-slate-500">Trang thai</p>
                    <p className="mt-1 font-medium text-slate-900">{profile.status || 'Chua cap nhat'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}