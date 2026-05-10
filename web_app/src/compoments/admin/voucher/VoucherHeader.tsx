type VoucherHeaderProps = {

  onCreateClick: () => void
}

export default function VoucherHeader({ onCreateClick }: VoucherHeaderProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex flex-col gap-1">
        <h1 className="text-4xl font-semibold text-slate-800 sm:text-5xl">Quản lý voucher</h1>
      </div>
      <button
        type="button"
        onClick={onCreateClick}
        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        Thêm voucher
      </button>
    </div>
  )
}
