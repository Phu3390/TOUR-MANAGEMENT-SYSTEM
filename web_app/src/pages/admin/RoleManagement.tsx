import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { getById } from '../../api/auth/role.api'
import RoleFilters, { type RoleFilterState } from '../../compoments/admin/role/RoleFilters'
import RoleFormModal from '../../compoments/admin/role/RoleFormModal'
import RolePageHeader from '../../compoments/admin/role/RolePageHeader'
import RolePagination from '../../compoments/admin/role/RolePagination'
import RoleTable from '../../compoments/admin/role/RoleTable'
import type { RoleFormValues } from '../../schema/roleSchema'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { createRole, fetchRoles, lockRole, setKeyword, setPageNumber, setStatusFilter, unlockRole, updateRole } from '../../store/role/slice'
import type { RoleAndRolePermissionRequest, RoleResponse } from '../../types/auth/role.type'

export default function RoleManagement() {
  const dispatch = useAppDispatch()
  const { roles, loading, submitting, pageNumber, totalPages, size, keyword, statusFilter } = useAppSelector(
    (state) => state.role,
  )

  const [searchInput, setSearchInput] = useState(keyword)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null)
  const [editingRolePreview, setEditingRolePreview] = useState<RoleResponse | null>(null)
  const [editingRoleDetail, setEditingRoleDetail] = useState<RoleResponse | null>(null)
  const [editDetailLoading, setEditDetailLoading] = useState(false)

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (searchInput !== keyword) {
        dispatch(setKeyword(searchInput.trim()))
        dispatch(setPageNumber(0))
      }
    }, 350)

    return () => window.clearTimeout(timeout)
  }, [dispatch, keyword, searchInput])

  useEffect(() => {
    dispatch(
      fetchRoles({
        keyword,
        pageNumber,
        size,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
      }),
    )
  }, [dispatch, keyword, pageNumber, size, statusFilter])

  useEffect(() => {
    if (!isEditModalOpen || !editingRoleId) {
      return
    }

    let alive = true
    setEditDetailLoading(true)

    void getById(editingRoleId)
      .then((res) => {
        if (!alive) return
        if (res.code !== 200 || !res.data) {
          throw new Error('Khong the tai chi tiet vai tro')
        }
        setEditingRoleDetail(res.data)
      })
      .catch((error: unknown) => {
        if (!alive) return
        const message = error instanceof Error ? error.message : 'Khong the tai chi tiet vai tro'
        toast.error(message)
        setIsEditModalOpen(false)
        setEditingRoleId(null)
        setEditingRolePreview(null)
        setEditingRoleDetail(null)
      })
      .finally(() => {
        if (alive) setEditDetailLoading(false)
      })

    return () => {
      alive = false
    }
  }, [editingRoleId, isEditModalOpen])

  const handleCreateRole = async (values: RoleFormValues) => {
    const payload: RoleAndRolePermissionRequest = {
      role: { name: values.name },
      role_permissions: values.role_permissions || [],
    }

    const result = await dispatch(createRole(payload))
    if (result.type.endsWith('/rejected')) {
      const responsePayload = result.payload as { message?: string } | undefined
      toast.error(responsePayload?.message || 'Không thể tạo vai trò')
      return
    }

    toast.success('Thêm vai trò thành công')
    setIsCreateModalOpen(false)
    dispatch(
      fetchRoles({
        keyword,
        pageNumber,
        size,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
      }),
    )
  }

  const handleUpdateRole = async (values: RoleFormValues) => {
    if (!editingRoleId) return

    const payload: RoleAndRolePermissionRequest = {
      role: { name: values.name },
      role_permissions: values.role_permissions || [],
    }

    const result = await dispatch(updateRole({ id: editingRoleId, data: payload }))
    if (result.type.endsWith('/rejected')) {
      const responsePayload = result.payload as { message?: string } | undefined
      toast.error(responsePayload?.message || 'Không thể cập nhật vai trò')
      return
    }

    toast.success('Cập nhật vai trò thành công')
    setIsEditModalOpen(false)
    setEditingRoleId(null)
    setEditingRolePreview(null)
    setEditingRoleDetail(null)
    dispatch(
      fetchRoles({
        keyword,
        pageNumber,
        size,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
      }),
    )
  }

  const handleEditRole = (role: RoleResponse) => {
    setEditingRoleId(role.id)
    setEditingRolePreview(role)
    setIsEditModalOpen(true)
  }

  const handleLockRole = async (id: string) => {
    const ok = window.confirm('Bạn có chắc chắn muốn khóa vai trò này không?')
    if (!ok) return

    const result = await dispatch(lockRole(id))
    if (result.type.endsWith('/rejected')) {
      const responsePayload = result.payload as { message?: string } | undefined
      toast.error(responsePayload?.message || 'Không thể khóa vai trò')
      return
    }

    toast.success('Khóa vai trò thành công')
  }

  const handleUnlockRole = async (id: string) => {
    const ok = window.confirm('Bạn có chắc chắn muốn mở khóa vai trò này không?')
    if (!ok) return

    const result = await dispatch(unlockRole(id))
    if (result.type.endsWith('/rejected')) {
      const responsePayload = result.payload as { message?: string } | undefined
      toast.error(responsePayload?.message || 'Không thể mở khóa vai trò')
      return
    }

    toast.success('Mở khóa vai trò thành công')
  }

  const handleResetFilters = () => {
    setSearchInput('')
    dispatch(setKeyword(''))
    dispatch(setStatusFilter('ALL'))
    dispatch(setPageNumber(0))
  }

  return (
    <div className="space-y-5 text-left">
      <RolePageHeader onCreate={() => setIsCreateModalOpen(true)} />

      <RoleFilters
        keyword={searchInput}
        status={statusFilter as RoleFilterState}
        onKeywordChange={setSearchInput}
        onStatusChange={(status) => dispatch(setStatusFilter(status))}
        onReset={handleResetFilters}
      />

      <RoleTable roles={roles} loading={loading} onEdit={handleEditRole} onLock={handleLockRole} onUnlock={handleUnlockRole} />

      <RolePagination currentPage={pageNumber} totalPages={totalPages} onPageChange={(page) => dispatch(setPageNumber(page))} />

      <RoleFormModal
        open={isCreateModalOpen}
        loading={submitting}
        mode="create"
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateRole}
      />

      <RoleFormModal
        open={isEditModalOpen}
        loading={submitting || editDetailLoading}
        mode="edit"
        initialValues={{
          name: editingRoleDetail?.name || editingRolePreview?.name || '',
          rolePermissions: editingRoleDetail?.rolePermissions || editingRolePreview?.rolePermissions,
        }}
        onClose={() => {
          setIsEditModalOpen(false)
          setEditingRoleId(null)
          setEditingRolePreview(null)
          setEditingRoleDetail(null)
        }}
        onSubmit={handleUpdateRole}
      />
    </div>
  )
}
