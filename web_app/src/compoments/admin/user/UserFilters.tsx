export type UserFilterState = 'ALL' | 'ACTIVE' | 'INACTIVE'
import { STATIC_USER_ROLE_OPTIONS } from '../../../utils/userRoles'

type UserFiltersProps = {
  keyword: string
  status: UserFilterState
  role: string
  onKeywordChange: (value: string) => void
  onStatusChange: (value: UserFilterState) => void
  onRoleChange: (value: string) => void
  onReset: () => void
}

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100'

export default function UserFilters({
  keyword,
  status,
  role,
  onKeywordChange,
  onStatusChange,
  onRoleChange,
  onReset,
}: UserFiltersProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="xl:col-span-2">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Tìm kiếm</label>
          <input
            value={keyword}
            onChange={(event) => onKeywordChange(event.target.value)}
            type="search"
            placeholder="Nhập tên hoặc email..."
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Trạng thái</label>
          <select
            value={status}
            onChange={(event) => onStatusChange(event.target.value as UserFilterState)}
            className={inputClass}
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="ACTIVE">Hoạt động</option>
            <option value="INACTIVE">Bị khóa</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Vai trò</label>
          <select
            value={role}
            onChange={(event) => onRoleChange(event.target.value)}
            className={inputClass}
          >
            <option value="ALL">Tất cả vai trò</option>
            {STATIC_USER_ROLE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
        >
          Làm mới bộ lọc
        </button>
      </div>
    </section>
  )
}
