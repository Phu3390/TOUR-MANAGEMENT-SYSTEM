interface TourCreateActionsProps {
  currentStep: number
  submitting: boolean
  onBack: () => void
  onCancel: () => void
  onSaveDraft: () => void
  onNext: () => void
  onSubmit: () => void
}

export default function TourCreateActions({ currentStep, submitting, onBack, onCancel, onNext, onSubmit }: TourCreateActionsProps) {
  const isLastStep = currentStep === 4

  return (
    <div className="sticky bottom-0 z-10 border-t border-slate-200 bg-white/95 px-4 py-4 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
        >
          Hủy
        </button>

        <div className="flex items-center gap-3">


          {currentStep > 1 && (
            <button
              type="button"
              onClick={onBack}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Quay lại
            </button>
          )}

          <button
            type="button"
            onClick={isLastStep ? onSubmit : onNext}
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Đang lưu...' : isLastStep ? 'Hoàn tất' : 'Tiếp theo'}
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </div>
  )
}