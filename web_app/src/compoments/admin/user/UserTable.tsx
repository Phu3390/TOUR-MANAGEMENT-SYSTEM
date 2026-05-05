import type { UserResponse } from '../../../types/auth/user.type'

type UserTableProps = {
  users: UserResponse[]
  loading: boolean
  onLock: (id: string) => void
  onUnlock: (id: string) => void
  onEdit: (id: string) => void
}

function formatRole(roleName: string) {
  return roleName || 'Không xác định'
}

function getStatusConfig(status: string) {
  if (status === 'ACTIVE') {
    return {
      dot: 'bg-emerald-600',
      text: 'Hoạt động',
      textClass: 'text-emerald-700',
    }
  }

  return {
    dot: 'bg-rose-600',
    text: 'Bị khóa',
    textClass: 'text-rose-700',
  }
}

export default function UserTable({ users, loading, onLock, onUnlock, onEdit }: UserTableProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Họ và tên</th>
              <th className="px-4 py-3">Vai trò</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3 text-right">Thao tác</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                  Đang tải...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                  Không có người dùng nào
                </td>
              </tr>
            ) : (
              users.map((user) => {
                const statusConfig = getStatusConfig(user.status)
                return (
                  <tr key={user.id} className="hover:bg-slate-50/80">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-800">{user.fullName}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                        {formatRole(user.role?.name)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-2 text-sm font-medium ${statusConfig.textClass}`}>
                        <span className={`h-2 w-2 rounded-full ${statusConfig.dot}`} />
                        {statusConfig.text}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{user.email}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => onEdit(user.id)}
                          className="rounded-lg border border-blue-200 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-50 whitespace-nowrap"
                        >
                          Sửa
                        </button>
                        {user.status === 'ACTIVE' ? (
                          <button
                            type="button"
                            onClick={() => onLock(user.id)}
                            className="rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-50 whitespace-nowrap"
                          >
                            Khóa
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onUnlock(user.id)}
                            className="rounded-lg border border-emerald-200 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50 whitespace-nowrap"
                          >
                            Mở khóa
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
