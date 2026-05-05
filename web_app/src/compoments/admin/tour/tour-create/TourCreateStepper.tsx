interface StepItem {
  label: string
  description: string
}

interface TourCreateStepperProps {
  currentStep: number
  steps: StepItem[]
}

export default function TourCreateStepper({ currentStep, steps }: TourCreateStepperProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-3 md:grid-cols-4">
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isActive = stepNumber === currentStep
          const isDone = stepNumber < currentStep

          return (
            <div key={step.label} className="flex items-center gap-3">
              <div className="flex flex-1 items-center gap-3">
                <div
                  className={`grid h-10 w-10 place-items-center rounded-full border text-sm font-semibold ${
                    isDone || isActive ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-200 bg-slate-50 text-slate-400'
                  }`}
                >
                  {stepNumber}
                </div>
                <div className="min-w-0">
                  <p className={`text-xs font-semibold uppercase tracking-wide ${isDone || isActive ? 'text-blue-600' : 'text-slate-400'}`}>
                    {step.label}
                  </p>
                  <p className="truncate text-sm text-slate-500">{step.description}</p>
                </div>
              </div>

              {index < steps.length - 1 && <div className="hidden h-px flex-1 bg-slate-200 md:block" />}
            </div>
          )
        })}
      </div>
    </div>
  )
}