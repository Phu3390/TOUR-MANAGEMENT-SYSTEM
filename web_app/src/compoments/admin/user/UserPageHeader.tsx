type UserPageHeaderProps = {
  onCreate: () => void
}

export default function UserPageHeader({ onCreate }: UserPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h1 className="text-4xl font-semibold text-slate-800 sm:text-5xl">Quản lý người dùng</h1>

      <button
        type="button"
        onClick={onCreate}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        Thêm người dùng
      </button>
    </div>
  )
}
