type UserPaginationProps = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

function getVisiblePages(currentPage: number, totalPages: number) {
  const pages: number[] = []
  const start = Math.max(0, currentPage - 1)
  const end = Math.min(totalPages - 1, currentPage + 1)

  for (let page = start; page <= end; page += 1) {
    pages.push(page)
  }

  if (start > 0) pages.unshift(0)
  if (end < totalPages - 1) pages.push(totalPages - 1)

  return [...new Set(pages)]
}

export default function UserPagination({ currentPage, totalPages, onPageChange }: UserPaginationProps) {
  if (totalPages <= 0) return null

  const pages = getVisiblePages(currentPage, totalPages)

  return (
    <div className="flex items-center justify-end gap-2">
      <button
        type="button"
        disabled={currentPage === 0}
        onClick={() => onPageChange(currentPage - 1)}
        className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 transition enabled:hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Truoc
      </button>

      {pages.map((page, index) => {
        const previousPage = pages[index - 1]
        const showEllipsis = previousPage !== undefined && page - previousPage > 1

        return (
          <div key={page} className="flex items-center gap-2">
            {showEllipsis && <span className="text-sm text-slate-400">...</span>}
            <button
              type="button"
              onClick={() => onPageChange(page)}
              className={`h-9 min-w-9 rounded-lg px-3 text-sm font-semibold transition ${
                page === currentPage
                  ? 'bg-blue-600 text-white'
                  : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {page + 1}
            </button>
          </div>
        )
      })}

      <button
        type="button"
        disabled={currentPage >= totalPages - 1}
        onClick={() => onPageChange(currentPage + 1)}
        className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 transition enabled:hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Sau
      </button>
    </div>
  )
}
