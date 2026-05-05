import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify'
import { getAll as getAllPermissions } from '../../../api/auth/permission.api'
import { roleFormSchema, type RoleFormValues } from '../../../schema/roleSchema'
import type { PermissionResponse } from '../../../types/auth/permission.type'
import type { RolePermissionResponse } from '../../../types/auth/role.type'

type RoleFormModalProps = {
  open: boolean
  loading: boolean
  mode?: 'create' | 'edit'
  initialValues?: {
    name: string
    rolePermissions?: RolePermissionResponse[]
  }
  onClose: () => void
  onSubmit: (values: RoleFormValues) => void
}

const inputClass =
  'w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100'

const ACTIONS = ['view', 'create', 'update', 'delete'] as const

export default function RoleFormModal({
  open,
  loading,
  mode = 'create',
  initialValues,
  onClose,
  onSubmit,
}: RoleFormModalProps) {
  const [permissions, setPermissions] = useState<PermissionResponse[]>([])
  const [permissionsLoading, setPermissionsLoading] = useState(false)
  const [selectedPermissions, setSelectedPermissions] = useState<Map<string, Set<string>>>(new Map())

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RoleFormValues>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      name: initialValues?.name || '',
      role_permissions: [],
    },
  })

  // Fetch permissions on mount
  useEffect(() => {
    if (!open) return

    const fetchPermissions = async () => {
      try {
        setPermissionsLoading(true)
        const res = await getAllPermissions()
        if (res.code === 200 && res.data) {
          setPermissions(Array.isArray(res.data) ? res.data : [])

          // Initialize selected permissions from initial values (for edit mode)
          if (mode === 'edit' && initialValues?.rolePermissions) {
            const permMap = new Map<string, Set<string>>()
            initialValues.rolePermissions.forEach((rp) => {
              const permId = rp.permission.id
              if (!permMap.has(permId)) {
                permMap.set(permId, new Set())
              }
              permMap.get(permId)!.add(rp.action)
            })
            setSelectedPermissions(permMap)
          } else {
            // Reset for create mode
            setSelectedPermissions(new Map())
          }
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Khong the tai danh sach quyen'
        toast.error(message)
      } finally {
        setPermissionsLoading(false)
      }
    }

    void fetchPermissions()
  }, [open, mode, initialValues])

  // Reset form when modal closes or mode changes
  useEffect(() => {
    if (!open) return
    reset({
      name: initialValues?.name || '',
      role_permissions: Array.from(selectedPermissions.entries()).flatMap(([permId, actions]) =>
        Array.from(actions).map((action) => ({
          permission_id: permId,
          action: action as 'create' | 'update' | 'delete' | 'view',
        })),
      ),
    })
  }, [open, reset, initialValues, selectedPermissions])

  const handleCheckboxChange = (permissionId: string, action: string, checked: boolean) => {
    setSelectedPermissions((prev) => {
      const newMap = new Map(prev)
      if (!newMap.has(permissionId)) {
        newMap.set(permissionId, new Set())
      }

      const actions = newMap.get(permissionId)!
      if (checked) {
        actions.add(action)
      } else {
        // If unchecking 'view', uncheck all other actions for this permission
        if (action === 'view') {
          actions.clear()
        } else {
          actions.delete(action)
        }
      }

      if (actions.size === 0) {
        newMap.delete(permissionId)
      }

      return newMap
    })
  }

  const isActionEnabled = (permissionId: string, action: string): boolean => {
    if (action === 'view') return true
    const actions = selectedPermissions.get(permissionId)
    return actions?.has('view') ?? false
  }

  const isActionChecked = (permissionId: string, action: string): boolean => {
    return selectedPermissions.get(permissionId)?.has(action) ?? false
  }

  const handleFormSubmit = (values: RoleFormValues) => {
    // Build role_permissions from selectedPermissions
    const rolePermissions = Array.from(selectedPermissions.entries()).flatMap(([permId, actions]) =>
      Array.from(actions).map((action) => ({
        permission_id: permId,
        action: action as 'create' | 'update' | 'delete' | 'view',
      })),
    )

    onSubmit({
      ...values,
      role_permissions: rolePermissions,
    })
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 p-4" onClick={onClose}>
      <div
        className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-5 shadow-xl max-h-[90vh] overflow-y-auto"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-slate-900">
            {mode === 'create' ? 'Thêm vai trò mới' : 'Cập nhật vai trò'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(handleFormSubmit)}>
          {/* Role Name */}
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Tên vai trò
            </label>
            <input {...register('name')} className={inputClass} placeholder="Quản trị viên" />
            {errors.name && <p className="mt-1 text-xs text-rose-600">{errors.name.message}</p>}
          </div>

          {/* Permissions */}
          <div>
            <label className="mb-3 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Quyền hạn
            </label>

            {permissionsLoading ? (
              <div className="flex justify-center py-4">
                <div className="text-sm text-slate-500">Đang tải danh sách quyền...</div>
              </div>
            ) : permissions.length === 0 ? (
              <div className="text-sm text-slate-500">Không có quyền hạn nào</div>
            ) : (
              <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
                {permissions.map((permission) => (
                  <div key={permission.id} className="border-b border-slate-200 pb-3 last:border-b-0">
                    <div className="mb-2 text-sm font-semibold text-slate-700">{permission.name}</div>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {ACTIONS.map((action) => {
                        const isEnabled = isActionEnabled(permission.id, action)
                        const isChecked = isActionChecked(permission.id, action)
                        const isView = action === 'view'

                        return (
                          <label key={action} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => handleCheckboxChange(permission.id, action, e.target.checked)}
                              disabled={!isView && !isEnabled}
                              className="h-4 w-4 rounded border-slate-300 text-blue-600 disabled:opacity-50"
                            />
                            <span className={`text-sm capitalize ${!isView && !isEnabled ? 'text-slate-400' : 'text-slate-700'}`}>
                              {action === 'view' ? 'Xem' : action === 'create' ? 'Thêm' : action === 'update' ? 'Sửa' : 'Xóa'}
                            </span>
                            {!isView && !isEnabled && <span className="text-xs text-slate-400">(cần xem)</span>}
                          </label>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading || permissionsLoading}
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Đang xử lý...' : mode === 'create' ? 'Lưu' : 'Cập nhật'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
