interface TourDetailActionsProps {
  onBack: () => void
  onEdit?: () => void
}

export default function TourDetailActions({ onBack, onEdit }: TourDetailActionsProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 flex items-center justify-between border-t border-slate-200 bg-white px-6 py-4 shadow-lg">
      <button
        onClick={onBack}
        className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
      >
        ← Quay lại
      </button>

      <div className="flex items-center gap-2">
        {onEdit && (
          <button
            onClick={onEdit}
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            ✏️ Chỉnh sửa
          </button>
        )}
      </div>
    </div>
  )
}
