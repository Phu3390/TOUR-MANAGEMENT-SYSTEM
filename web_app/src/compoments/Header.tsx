import HeaderProfile from './Profile'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useMemo } from 'react'
import { logout } from '../store/auth/slice'
import { useAppDispatch } from '../store/hooks'

type HeaderProps = {
  onToggleMobileSidebar: () => void
}

type JwtPayload = {
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

export default function Header({ onToggleMobileSidebar }: HeaderProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const isClientRoute = location.pathname.startsWith('/client')

  const isAdmin = useMemo(() => {
    if (typeof window === 'undefined') return false

    const token = localStorage.getItem('token')
    if (!token) return false

    const payload = decodeJwtPayload(token)
    const rawScope = payload?.scope || payload?.scp || ''
    return rawScope.toUpperCase().includes('ADMIN')
  }, [])

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login', { replace: true })
  }

  return (
    <header className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-violet-300 hover:text-violet-700 lg:hidden"
          aria-label="Mo menu"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 7H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M4 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        {isClientRoute ? (
          <>
            <Link
              to="/client"
              className="inline-flex items-baseline rounded-md px-1 py-1 text-blue-700 transition hover:text-blue-800"
              aria-label="TourTravel"
            >
              <span className="text-lg font-extrabold tracking-tight sm:text-xl">Tour</span>
              <span className="text-lg font-black tracking-tight text-orange-500 sm:text-xl">Travel</span>
            </Link>

            <div className="hidden lg:flex items-center gap-3 sm:gap-4">
              <Link to="/client" className="rounded-md px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
                Trang chủ
              </Link>
              <Link to="/client/tours" className="rounded-md px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
                Tours
              </Link>
              <Link to="/client/destinations" className="rounded-md px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
                Điểm đến
              </Link>
              <Link to="/client/dashboard" className="rounded-md px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
                Dashboard
              </Link>
            </div>

            <div className="ml-auto flex items-center gap-3">
              <button
                type="button"
                aria-label="Tim kiem"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                  <path d="M20 20L17 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>

              <Link
                to="/client/book"
                className="inline-flex rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
              >
                Book Now
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-600 transition hover:border-rose-300 hover:bg-rose-50"
              >
                Đăng xuất
              </button>

              {isAdmin && (
                <Link
                  to="/admin/dashboard"
                  className="inline-flex rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Admin
                </Link>
              )}

              <HeaderProfile />
            </div>
          </>
        ) : (
          <div className="ml-auto">
            <HeaderProfile />
          </div>
        )}
      </div>
    </header>
  )
}
