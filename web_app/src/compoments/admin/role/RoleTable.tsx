import type { RoleResponse } from '../../../types/auth/role.type'

type RoleTableProps = {
  roles: RoleResponse[]
  loading: boolean
  onEdit: (role: RoleResponse) => void
  onLock: (id: string) => void
  onUnlock: (id: string) => void
}

function RoleStatusBadge({ status }: { status: string }) {
  const active = status === 'ACTIVE'
  return (
    <span className={`inline-flex items-center gap-2 text-sm font-medium ${active ? 'text-emerald-700' : 'text-rose-700'}`}>
      <span className={`h-2 w-2 rounded-full ${active ? 'bg-emerald-600' : 'bg-rose-600'}`} />
      {active ? 'Hoạt động' : 'Bị khóa'}
    </span>
  )
}

export default function RoleTable({ roles, loading, onEdit, onLock, onUnlock }: RoleTableProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="w-1/3 px-6 py-4">Tên vai trò</th>
              <th className="w-1/3 px-6 py-4">Trạng thái</th>
              <th className="w-1/3 px-6 py-4 text-right">Thao tác</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : roles.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                  Không có vai trò nào
                </td>
              </tr>
            ) : (
              roles.map((role) => (
                <tr key={role.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="w-1/3 px-6 py-4">
                    <p className="font-semibold text-slate-800">{role.name}</p>
                  </td>
                  <td className="w-1/3 px-6 py-4">
                    <RoleStatusBadge status={role.status} />
                  </td>
                  <td className="w-1/3 px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(role)}
                        className="whitespace-nowrap rounded-lg border border-blue-200 px-3 py-1.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-50"
                      >
                        Sửa
                      </button>
                      {role.status === 'ACTIVE' ? (
                        <button
                          type="button"
                          onClick={() => onLock(role.id)}
                          className="whitespace-nowrap rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-50"
                        >
                          Khóa
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onUnlock(role.id)}
                          className="whitespace-nowrap rounded-lg border border-emerald-200 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50"
                        >
                          Mở khóa
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
