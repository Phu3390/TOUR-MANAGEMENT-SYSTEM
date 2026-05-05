interface TourDetailActionsProps {
  onBack: () => void
  onContinue?: () => void
  continueLabel?: string
  disabled?: boolean
}

export default function TourDetailActions({ onBack, onContinue, continueLabel, disabled }: TourDetailActionsProps) {
  return (
    <div className="sticky bottom-0 z-10 border-t border-slate-200 bg-white/95 px-4 py-4 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
        >
          ← Quay lại
        </button>

        {onContinue && (
          <div className="flex items-center">
            <button
              type="button"
              onClick={onContinue}
              disabled={disabled}
              className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
            >
              {continueLabel || 'Tiếp tục →'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
