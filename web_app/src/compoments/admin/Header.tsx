import HeaderProfile from '../Profile'

type HeaderProps = {
  onToggleMobileSidebar: () => void
}

export default function Header({ onToggleMobileSidebar }: HeaderProps) {
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

        <div className="relative w-full max-w-full sm:max-w-107.5">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="M20 20L17 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
          <input
            type="search"
            placeholder="Tìm kiếm "
            className="w-full rounded-full bg-slate-100 py-2 pl-10 pr-4 text-sm text-slate-700 outline-none ring-violet-500 transition focus:ring-2"
          />
        </div>

        <HeaderProfile />
      </div>
    </header>
  )
}
