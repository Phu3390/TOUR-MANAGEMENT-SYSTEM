import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import UserFilters from '../../compoments/admin/user/UserFilters'
import UserFormModal from '../../compoments/admin/user/UserFormModal'
import UserPageHeader from '../../compoments/admin/user/UserPageHeader'
import UserPagination from '../../compoments/admin/user/UserPagination'

import UserTable from '../../compoments/admin/user/UserTable'
import type { CreateUserFormValues, UpdateUserFormValues } from '../../schema/userSchema'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { createUser, fetchUsers, setKeyword, setPageNumber, setStatusFilter, setRoleFilter, lockUser, unlockUser, updateUser } from '../../store/user/slice'
import type { UpdateUserRequest, UserRequest } from '../../types/auth/user.type'

export default function UserManagement() {
  const dispatch = useAppDispatch()
  const { users, loading, submitting, pageNumber, totalPages, size, keyword, statusFilter, roleFilter } = useAppSelector(
    (state) => state.user,
  )

  const [searchInput, setSearchInput] = useState(keyword)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingUserId, setEditingUserId] = useState<string | null>(null)

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
      fetchUsers({
        keyword,
        pageNumber,
        size,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        role: roleFilter !== 'ALL' ? roleFilter : undefined,
      }),
    )
  }, [dispatch, keyword, pageNumber, size, statusFilter, roleFilter])

  const editingUser = useMemo(() => users.find((user) => user.id === editingUserId) || null, [users, editingUserId])

  const handleCreateUser = async (values: CreateUserFormValues) => {
    const payload: UserRequest = {
      fullName: values.fullName,
      email: values.email,
      password: values.password,
      role_id: values.role_id,
    }
    console.log('Creating user with payload:', payload)

    const result = await dispatch(createUser(payload))
    if (result.type.endsWith('/rejected')) {
      const payload = result.payload as { message?: string } | undefined
      const message = payload?.message || 'Không thể tạo người dùng'
      toast.error(message)
      return
    }

    toast.success('Thêm người dùng thành công')
    setIsCreateModalOpen(false)
    dispatch(
      fetchUsers({
        keyword,
        pageNumber,
        size,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        role: roleFilter !== 'ALL' ? roleFilter : undefined,
      }),
    )
  }

  const handleLockUser = async (id: string) => {
    const ok = window.confirm('Bạn có chắc chắn muốn khóa người dùng này không?')
    if (!ok) return

    const result = await dispatch(lockUser(id))
    if (result.type.endsWith('/rejected')) {
      const payload = result.payload as { message?: string } | undefined
      const message = payload?.message || 'Không thể khóa người dùng'
      toast.error(message)
      return
    }

    toast.success('Khóa người dùng thành công')
  }

  const handleUnlockUser = async (id: string) => {
    const ok = window.confirm('Bạn có chắc chắn muốn mở khóa không?')
    if (!ok) return

    const result = await dispatch(unlockUser(id))
    if (result.type.endsWith('/rejected')) {
      const payload = result.payload as { message?: string } | undefined
      const message = payload?.message || 'Không thể mở khóa người dùng'
      toast.error(message)
      return
    }

    toast.success('Mở khóa thành công')
  }

  const handleEditUser = (id: string) => {
    setEditingUserId(id)
    setIsEditModalOpen(true)
  }

  const handleUpdateUser = async (values: CreateUserFormValues | UpdateUserFormValues) => {
    if (!editingUserId) return

    const payload: UpdateUserRequest = {
      fullName: values.fullName,
      email: values.email,
      role_id: values.role_id,
    }

    const nextPassword = values.password?.trim()
    if (nextPassword) {
      payload.password = nextPassword
    }

    const result = await dispatch(updateUser({ id: editingUserId, data: payload }))
    if (result.type.endsWith('/rejected')) {
      const responsePayload = result.payload as { message?: string } | undefined
      const message = responsePayload?.message || 'Không thể cập nhật người dùng'
      toast.error(message)
      return
    }

    toast.success('Cập nhật người dùng thành công')
    setIsEditModalOpen(false)
    setEditingUserId(null)
    dispatch(
      fetchUsers({
        keyword,
        pageNumber,
        size,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        role: roleFilter !== 'ALL' ? roleFilter : undefined,
      }),
    )
  }

  const handleResetFilters = () => {
    setSearchInput('')
    dispatch(setKeyword(''))
    dispatch(setStatusFilter('ALL'))
    dispatch(setRoleFilter('ALL'))
    dispatch(setPageNumber(0))
  }

  return (
    <div className="space-y-5 text-left">
      <UserPageHeader onCreate={() => setIsCreateModalOpen(true)} />
      <UserFilters
        keyword={searchInput}
        status={statusFilter}
        role={roleFilter}
        onKeywordChange={setSearchInput}
        onStatusChange={(status) => dispatch(setStatusFilter(status))}
        onRoleChange={(role) => dispatch(setRoleFilter(role))}
        onReset={handleResetFilters}
      />

      <UserTable users={users} loading={loading} onLock={handleLockUser} onUnlock={handleUnlockUser} onEdit={handleEditUser} />

      <UserPagination currentPage={pageNumber} totalPages={totalPages} onPageChange={(page) => dispatch(setPageNumber(page))} />

      <UserFormModal
        open={isCreateModalOpen}
        loading={submitting}
        mode="create"
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateUser}
      />

      <UserFormModal
        open={isEditModalOpen}
        loading={submitting}
        mode="edit"
        initialValues={
          editingUser
            ? {
                fullName: editingUser.fullName,
                email: editingUser.email,
                role_id: editingUser.role?.name || 'USER',
              }
            : undefined
        }
        onClose={() => {
          setIsEditModalOpen(false)
          setEditingUserId(null)
        }}
        onSubmit={handleUpdateUser}
      />
    </div>
  )
}
