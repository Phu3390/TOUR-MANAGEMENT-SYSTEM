import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { logout } from '../store/auth/slice'
import { useAppDispatch } from '../store/hooks'

type MenuIconProps = {
  className?: string
}

function DashboardIcon({ className }: MenuIconProps) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 4H10V10H4V4Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M14 4H20V14H14V4Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4 14H10V20H4V14Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M14 17H20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function UsersIcon({ className }: MenuIconProps) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M8 11C9.65685 11 11 9.65685 11 8C11 6.34315 9.65685 5 8 5C6.34315 5 5 6.34315 5 8C5 9.65685 6.34315 11 8 11Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 19C3 16.7909 4.79086 15 7 15H9C11.2091 15 13 16.7909 13 19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M17 10C18.1046 10 19 9.10457 19 8C19 6.89543 18.1046 6 17 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M16 15H17C19.2091 15 21 16.7909 21 19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function TourIcon({ className }: MenuIconProps) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 11V8C7 5.79086 8.79086 4 11 4H13C15.2091 4 17 5.79086 17 8V11" stroke="currentColor" strokeWidth="1.8" />
      <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="15.5" r="1" fill="currentColor" />
    </svg>
  )
}

function BookingIcon({ className }: MenuIconProps) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 4H17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M7 8H17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M6 4H18C19.1046 4 20 4.89543 20 6V19C20 20.1046 19.1046 21 18 21H6C4.89543 21 4 20.1046 4 19V6C4 4.89543 4.89543 4 6 4Z" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="9" cy="14" r="1.5" fill="currentColor" />
      <path d="M12 14H16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 18H16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function VoucherIcon({ className }: MenuIconProps) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 5C4 3.89543 4.89543 3 6 3H18C19.1046 3 20 3.89543 20 5V9.5C19.3 10 18.8 10.7 18.8 11.5C18.8 12.3 19.3 13 20 13.5V19C20 20.1046 19.1046 21 18 21H6C4.89543 21 4 20.1046 4 19V13.5C4.7 13 5.2 12.3 5.2 11.5C5.2 10.7 4.7 10 4 9.5V5Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="11.5" r="1" fill="currentColor" />
    </svg>
  )
}

const menuItems = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: DashboardIcon },
  { label: 'User Management', to: '/admin/users', icon: UsersIcon },
  { label: 'Tour Management', to: '/admin/tours', icon: TourIcon },
  { label: 'Booking Management', to: '/admin/bookings', icon: BookingIcon },
  { label: 'Voucher Management', to: '/admin/vouchers', icon: VoucherIcon },
]

type SidebarProps = {
  collapsed: boolean
  mobileOpen: boolean
  onToggleDesktopSidebar: () => void
  onCloseMobile: () => void
}

export default function Sidebar({
  collapsed,
  mobileOpen,
  onToggleDesktopSidebar,
  onCloseMobile,
}: SidebarProps) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [isDesktopViewport, setIsDesktopViewport] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : false,
  )

  useEffect(() => {
    const updateViewport = () => {
      setIsDesktopViewport(window.innerWidth >= 1024)
    }

    updateViewport()
    window.addEventListener('resize', updateViewport)
    return () => window.removeEventListener('resize', updateViewport)
  }, [])

  const handleLogout = () => {
    dispatch(logout())
    onCloseMobile()
    navigate('/login', { replace: true })
  }

  return (
    <>
      {mobileOpen && !isDesktopViewport && (
        <button
          type="button"
          aria-label="Dong menu"
          onClick={onCloseMobile}
          className="fixed inset-0 z-30 bg-slate-900/35 transition-opacity"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white px-4 py-5 shadow-lg transition-all duration-300 lg:static lg:z-auto lg:min-h-screen lg:h-auto lg:translate-x-0 lg:border-b-0 lg:px-5 lg:py-6 lg:shadow-none ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } ${collapsed ? 'lg:w-20' : 'lg:w-58.75'}`}
      >
      <div
        className={`mb-2 flex items-start gap-2 ${
          collapsed ? 'justify-center lg:flex-col lg:items-center lg:gap-1' : 'justify-between'
        }`}
      >
        <div className={`min-w-0 ${collapsed ? 'lg:text-center' : ''}`}>
          <p
            className={`leading-none font-extrabold tracking-tight text-blue-700 transition-all ${
              collapsed ? 'text-xl lg:text-xl' : 'text-2xl sm:text-3xl lg:text-4xl'
            } ${collapsed ? 'text-center' : 'text-left'}`}
          >
            <span className={collapsed ? 'lg:hidden' : ''}>TRAVEL</span>
            <span className={collapsed ? 'hidden lg:inline' : 'hidden'}>TP</span>
          </p>
          <p
            className={`mt-2 text-center text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-500 lg:mt-3 ${
              collapsed ? 'lg:hidden' : ''
            }`}
          >
            Management Suite
          </p>
        </div>

        <div className={`flex items-center ${collapsed ? 'lg:mt-1' : ''}`}>
          <button
            type="button"
            onClick={onCloseMobile}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition hover:text-violet-700 lg:hidden"
            aria-label="Dong sidebar"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 7H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M4 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          <button
            type="button"
            onClick={onToggleDesktopSidebar}
            className={`hidden items-center justify-center rounded-lg text-slate-600 transition hover:text-violet-700 lg:inline-flex ${
              collapsed ? 'h-8 w-8' : 'h-9 w-9'
            }`}
            aria-label="Thu gon sidebar"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 7H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M4 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      <div className="my-6 border-t border-slate-200" />

      <nav className="space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onCloseMobile}
            className={({ isActive }) =>
              `flex items-center justify-between rounded-lg px-3 py-3 text-sm font-semibold transition-colors ${
                isActive
                  ? 'bg-violet-50 text-slate-900'
                  : 'text-slate-500 hover:bg-violet-50 hover:text-violet-700'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`flex items-center ${collapsed ? 'gap-0 lg:justify-center' : 'gap-3'}`}>
                  <span className={`${isActive ? 'text-violet-700' : 'text-blue-600'}`}>
                    <item.icon />
                  </span>
                  <span className={collapsed ? 'lg:hidden' : ''}>{item.label}</span>
                </span>
                <span
                  className={`h-7 w-1 rounded-full bg-violet-600 transition ${
                    isActive ? 'opacity-100' : 'opacity-0'
                  } ${collapsed ? 'lg:hidden' : ''}`}
                />
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-6 border-t border-slate-200 pt-4 lg:mt-auto">
        <NavLink
          to="/client"
          onClick={onCloseMobile}
          className={`mb-2 flex items-center px-3 py-2 text-sm font-semibold text-blue-600 transition hover:text-violet-700 ${
            collapsed ? 'gap-0 lg:justify-center' : 'gap-3'
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M15 19L8 12L15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M3 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className={collapsed ? 'lg:hidden' : ''}>Về trang client</span>
        </NavLink>

        <button
          type="button"
          onClick={handleLogout}
          className={`flex items-center px-3 py-2 text-sm font-semibold text-red-500 transition hover:text-violet-700 ${
            collapsed ? 'gap-0 lg:justify-center' : 'gap-3'
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M10 17L15 12L10 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M15 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M13 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className={collapsed ? 'lg:hidden' : ''}>Logout</span>
        </button>
      </div>
      </aside>
    </>
  )
}
