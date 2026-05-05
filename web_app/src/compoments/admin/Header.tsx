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
            placeholder="Tìm kiếm hệ thống..."
            className="w-full rounded-full bg-slate-100 py-2 pl-10 pr-4 text-sm text-slate-700 outline-none ring-violet-500 transition focus:ring-2"
          />
        </div>

        <button
          type="button"
          className="ml-auto flex shrink-0 items-center gap-3 border-l border-slate-200 pl-3 text-left transition-colors hover:text-violet-700 sm:pl-4"
        >
          <span className="hidden leading-tight sm:block">
            <span className="block text-sm font-semibold text-slate-900">Admin User</span>
            <span className="block text-xs text-slate-500">Quản trị viên</span>
          </span>
          <span className="grid h-10 w-10 place-items-center rounded-full border-2 border-blue-600 bg-blue-50 text-lg transition-colors hover:border-violet-600">
            <span aria-hidden="true">👤</span>
          </span>
        </button>
      </div>
    </header>
  )
}
