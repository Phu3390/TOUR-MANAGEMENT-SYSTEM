import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import VoucherFilters from '../../../compoments/admin/booking/VoucherFilters'
import VoucherHeader from '../../../compoments/admin/booking/VoucherHeader'
import VoucherList from '../../../compoments/admin/booking/VoucherList'
import VoucherPagination from '../../../compoments/admin/booking/VoucherPagination'
import VoucherFormModal from '../../../compoments/admin/booking/VoucherFormModal'
import { voucherFilterSchema, toNullableNumber } from '../../../schema/voucherSchema'
import type { CreateVoucherFormValues } from '../../../schema/voucherSchema'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import {
  fetchVouchers,
  resetFilters,
  setKeyword,
  setPageNumber,
  setStatusFilter,
  setMinDiscountPercent,
  setMaxDiscountPercent,
  setMinDiscountAmount,
  setMaxDiscountAmount,
  setMinQuantity,
  setMaxQuantity,
  createVoucher,
  updateVoucher,
  editStatus,
} from '../../../store/booking/voucher'
import type { VoucherRequest } from '../../../types/booking/voucher.type'

export default function VoucherManagement() {
  const dispatch = useAppDispatch()
  const {
    vouchers,
    loading,
    submitting,
    pageNumber,
    totalPages,
    size,
    totalElements,
    keyword,
    statusFilter,
    minDiscountPercent,
    maxDiscountPercent,
    minDiscountAmount,
    maxDiscountAmount,
    minQuantity,
    maxQuantity,
    error,
  } = useAppSelector((state) => state.voucher)

  const [searchInput, setSearchInput] = useState(keyword)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingVoucherId, setEditingVoucherId] = useState<string | null>(null)

  const editingVoucher = useMemo(() => vouchers.find((v) => v.id === editingVoucherId) || null, [vouchers, editingVoucherId])

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const nextKeyword = searchInput.trim()
      if (nextKeyword !== keyword) {
        dispatch(setKeyword(nextKeyword))
        dispatch(setPageNumber(0))
      }
    }, 350)

    return () => window.clearTimeout(timeout)
  }, [dispatch, keyword, searchInput])

  const parsedFilter = useMemo(
    () =>
      voucherFilterSchema.safeParse({
        keyword,
        status: statusFilter,
        minDiscountPercent,
        maxDiscountPercent,
        minDiscountAmount,
        maxDiscountAmount,
        minQuantity,
        maxQuantity,
      }),
    [keyword, statusFilter, minDiscountPercent, maxDiscountPercent, minDiscountAmount, maxDiscountAmount, minQuantity, maxQuantity],
  )

  useEffect(() => {
    if (!parsedFilter.success) {
      const firstError = parsedFilter.error.issues[0]?.message || 'Bộ lọc voucher không hợp lệ'
      toast.error(firstError)
      return
    }

    const filterValues = parsedFilter.data

    dispatch(
      fetchVouchers({
        code: filterValues.keyword || undefined,
        status: filterValues.status !== 'ALL' ? filterValues.status : undefined,
        minDiscountPercent: filterValues.minDiscountPercent ? Number(filterValues.minDiscountPercent) : undefined,
        maxDiscountPercent: filterValues.maxDiscountPercent ? Number(filterValues.maxDiscountPercent) : undefined,
        minDiscountAmount: filterValues.minDiscountAmount ? Number(filterValues.minDiscountAmount) : undefined,
        maxDiscountAmount: filterValues.maxDiscountAmount ? Number(filterValues.maxDiscountAmount) : undefined,
        minQuantity: filterValues.minQuantity ? Number(filterValues.minQuantity) : undefined,
        maxQuantity: filterValues.maxQuantity ? Number(filterValues.maxQuantity) : undefined,
        pageNumber,
        size,
      }),
    )
  }, [dispatch, parsedFilter, pageNumber, size])

  useEffect(() => {
    if (error) toast.error(error)
  }, [error])

  const handleResetFilters = () => {
    setSearchInput('')
    dispatch(resetFilters())
  }

  const handleCreateVoucher = async (values: CreateVoucherFormValues) => {
    const payload: VoucherRequest = {
      code: values.code,
      discountPercent: toNullableNumber(values.discountPercent),
      discountAmount: toNullableNumber(values.discountAmount),
      quantity: Number(values.quantity),
      startDate: new Date(values.startDate),
      endDate: new Date(values.endDate),
      status: values.status as 'ACTIVE' | 'INACTIVE',
    }

    const result = await dispatch(createVoucher(payload))
    if (result.type.endsWith('/rejected')) {
      return
    }

    toast.success('Tạo voucher thành công')
    setIsCreateModalOpen(false)
    dispatch(
      fetchVouchers({
        code: keyword || undefined,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        minDiscountPercent: minDiscountPercent ? Number(minDiscountPercent) : undefined,
        maxDiscountPercent: maxDiscountPercent ? Number(maxDiscountPercent) : undefined,
        minDiscountAmount: minDiscountAmount ? Number(minDiscountAmount) : undefined,
        maxDiscountAmount: maxDiscountAmount ? Number(maxDiscountAmount) : undefined,
        minQuantity: minQuantity ? Number(minQuantity) : undefined,
        maxQuantity: maxQuantity ? Number(maxQuantity) : undefined,
        pageNumber,
        size,
      }),
    )
  }

  const handleEditVoucher = (id: string) => {
    setEditingVoucherId(id)
    setIsEditModalOpen(true)
  }

  const handleUpdateVoucher = async (values: CreateVoucherFormValues) => {
    if (!editingVoucherId) return

    const payload: VoucherRequest = {
      code: values.code,
      discountPercent: toNullableNumber(values.discountPercent),
      discountAmount: toNullableNumber(values.discountAmount),
      quantity: Number(values.quantity),
      startDate: new Date(values.startDate),
      endDate: new Date(values.endDate),
      status: values.status as 'ACTIVE' | 'INACTIVE',
    }

    const result = await dispatch(updateVoucher({ id: editingVoucherId, data: payload }))
    if (result.type.endsWith('/rejected')) {
      const responsePayload = result.payload as { message?: string } | undefined
      const message = responsePayload?.message || 'Không thể cập nhật voucher'
      toast.error(message)
      return
    }

    toast.success('Cập nhật voucher thành công')
    setIsEditModalOpen(false)
    setEditingVoucherId(null)
  }

  const handleUpdateStatus = async (id: string, status: string) => {
    if (!id) return

    const result = await dispatch(editStatus({ id, status }))
    if (result.type.endsWith('/rejected')) {
      const responsePayload = result.payload as { message?: string } | undefined
      const message = responsePayload?.message || 'Không thể cập nhật trạng thái'
      toast.error(message)
      return
    }

    toast.success('Cập nhật trạng thái thành công')
  }

  return (
    <div className="space-y-5 text-left">
      <VoucherHeader total={totalElements} onCreateClick={() => setIsCreateModalOpen(true)} />

      <VoucherFilters
        keyword={searchInput}
        status={statusFilter}
        minDiscountPercent={minDiscountPercent}
        maxDiscountPercent={maxDiscountPercent}
        minDiscountAmount={minDiscountAmount}
        maxDiscountAmount={maxDiscountAmount}
        minQuantity={minQuantity}
        maxQuantity={maxQuantity}
        onKeywordChange={setSearchInput}
        onStatusChange={(val) => dispatch(setStatusFilter(val))}
        onMinDiscountPercentChange={(val) => dispatch(setMinDiscountPercent(val))}
        onMaxDiscountPercentChange={(val) => dispatch(setMaxDiscountPercent(val))}
        onMinDiscountAmountChange={(val) => dispatch(setMinDiscountAmount(val))}
        onMaxDiscountAmountChange={(val) => dispatch(setMaxDiscountAmount(val))}
        onMinQuantityChange={(val) => dispatch(setMinQuantity(val))}
        onMaxQuantityChange={(val) => dispatch(setMaxQuantity(val))}
        onReset={handleResetFilters}
      />

      <VoucherList 
        vouchers={vouchers} 
        loading={loading} 
        onEdit={handleEditVoucher}
        onChangeStatus={(id, status) => void handleUpdateStatus(id, status)}
      />

      <VoucherPagination currentPage={pageNumber} totalPages={totalPages} onPageChange={(page) => dispatch(setPageNumber(page))} />

      <VoucherFormModal 
        open={isCreateModalOpen} 
        loading={submitting} 
        mode="create"
        onClose={() => setIsCreateModalOpen(false)} 
        onSubmit={handleCreateVoucher} 
      />

      <VoucherFormModal 
        open={isEditModalOpen} 
        loading={submitting} 
        mode="edit"
        initialValues={
          editingVoucher
            ? {
                code: editingVoucher.code,
                discountPercent: editingVoucher.discountPercent,
                discountAmount: editingVoucher.discountAmount,
                quantity: editingVoucher.quantity,
                startDate: new Date(editingVoucher.startDate).toISOString().split('T')[0],
                endDate: new Date(editingVoucher.endDate).toISOString().split('T')[0],
                status: editingVoucher.status,
              }
            : undefined
        }
        onClose={() => {
          setIsEditModalOpen(false)
          setEditingVoucherId(null)
        }}
        onSubmit={handleUpdateVoucher}
      />

    </div>
  )
}
