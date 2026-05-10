type Props = {
  current: number
  totalPages: number
  onChange: (page: number) => void
}

export default function TourPagination({ current, totalPages, onChange }: Props) {
  const pages = []
  for (let i = 0; i < totalPages; i++) pages.push(i)

  return (
    <nav className="mt-6 flex items-center justify-center gap-2">
      <button disabled={current === 0} onClick={() => onChange(Math.max(0, current - 1))} className="px-3 py-1 rounded border bg-white disabled:opacity-50">
        {'<'}
      </button>
      {pages.map((p) => (
        <button key={p} onClick={() => onChange(p)} className={`px-3 py-1 rounded border ${p === current ? 'bg-blue-600 text-white' : 'bg-white'}`}>
          {p + 1}
        </button>
      ))}
      <button disabled={current >= totalPages - 1} onClick={() => onChange(Math.min(totalPages - 1, current + 1))} className="px-3 py-1 rounded border bg-white disabled:opacity-50">
        {'>'}
      </button>
    </nav>
  )
}
