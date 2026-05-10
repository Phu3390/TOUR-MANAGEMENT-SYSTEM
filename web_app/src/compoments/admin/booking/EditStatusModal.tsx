import { useEffect, useState } from 'react'

type EditStatusModalProps = {
  open: boolean
  loading: boolean
  currentStatus: string
  onClose: () => void
  onSubmit: (status: string) => void
}

const inputClass =
  'w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100'

export default function EditStatusModal({ open, loading, currentStatus, onClose, onSubmit }: EditStatusModalProps) {
  const [status, setStatus] = useState(currentStatus)

  useEffect(() => {
    if (open) {
      setStatus(currentStatus)
    }
  }, [open, currentStatus])

  const handleSubmit = () => {
    onSubmit(status)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 p-4" onClick={onClose}>
      <div
        className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-5 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-slate-900">Cập nhật trạng thái</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Trạng thái</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className={inputClass}>
              <option value="DRAFT">Bản nháp</option>
              <option value="ACTIVE">Hoạt động</option>
              <option value="INACTIVE">Ngưng hoạt động</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Đang xử lý...' : 'Cập nhật'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
