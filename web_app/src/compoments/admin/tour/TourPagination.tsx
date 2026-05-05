interface PaginationProps {
  current: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  onPageSizeChange?: (size: number) => void
}

export default function TourPagination({
  current,
  pageSize,
  total,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.ceil(total / pageSize)

  const getVisiblePages = () => {
    const pages: (number | string)[] = []
    const range = 1

    if (totalPages <= 5) {
      for (let page = 1; page <= totalPages; page += 1) {
        pages.push(page)
      }
      return pages
    }

    if (current > 2) {
      pages.push(1)
      if (current > 3) pages.push('...')
    }

    for (let page = Math.max(1, current - range); page <= Math.min(totalPages, current + range); page += 1) {
      pages.push(page)
    }

    if (current < totalPages - 1) {
      if (current < totalPages - 2) pages.push('...')
      pages.push(totalPages)
    }

    return [...new Set(pages)]
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <button
        type="button"
        disabled={current === 1}
        onClick={() => onPageChange(current - 1)}
        className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 transition enabled:hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Trước
      </button>

      <div className="flex items-center gap-2">
        {getVisiblePages().map((page, index) => {
          const previousPage = getVisiblePages()[index - 1]
          const showEllipsis = previousPage !== undefined && page !== '...' && previousPage !== '...' && Number(page) - Number(previousPage) > 1

          if (page === '...') {
            return <span key={`ellipsis-${index}`} className="text-sm text-slate-400">...</span>
          }

          return (
            <div key={page} className="flex items-center gap-2">
              {showEllipsis && <span className="text-sm text-slate-400">...</span>}
              <button
                type="button"
                onClick={() => onPageChange(page as number)}
                className={`h-9 min-w-9 rounded-lg px-3 text-sm font-semibold transition ${
                  page === current ? 'bg-blue-600 text-white' : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {page}
              </button>
            </div>
          )
        })}
      </div>

        <button
        type="button"
        disabled={current === totalPages}
        onClick={() => onPageChange(current + 1)}
        className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 transition enabled:hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Sau
      </button>
    </div>
  )
}
