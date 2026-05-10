import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import BookingFilters from '../../../compoments/admin/booking/BookingFilters'
import BookingDetailModal from '../../../compoments/admin/booking/BookingDetailModal'
import BookingHeader from '../../../compoments/admin/booking/BookingHeader'
import BookingList from '../../../compoments/admin/booking/BookingList'
import { confirmBooking, cancelBooking } from '../../../api/booking/booking.api'
import BookingPagination from '../../../compoments/admin/booking/BookingPagination'
import { bookingFilterSchema } from '../../../schema/bookingSchema'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import {
  fetchBookings,
  resetFilters,
  setBookingStatusFilter,
  setExpiredOnly,
  setKeyword,
  setMaxTotalPrice,
  setMinTotalPrice,
  setPageNumber,
  setPaymentMethodFilter,
  setPaymentStatusFilter,
} from '../../../store/booking/slice'

export default function BookingManagement() {
  const dispatch = useAppDispatch()
  const {
    bookings,
    loading,
    pageNumber,
    totalPages,
    size,
    totalElements,
    keyword,
    bookingStatusFilter,
    paymentStatusFilter,
    paymentMethodFilter,
    minTotalPrice,
    maxTotalPrice,
    expiredOnly,
    error,
  } = useAppSelector((state) => state.booking)

  const [searchInput, setSearchInput] = useState(keyword)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null)

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
      bookingFilterSchema.safeParse({
        keyword,
        bookingStatus: bookingStatusFilter,
        paymentStatus: paymentStatusFilter,
        paymentMethod: paymentMethodFilter,
        minTotalPrice,
        maxTotalPrice,
        expiredOnly,
      }),
    [keyword, bookingStatusFilter, paymentStatusFilter, paymentMethodFilter, minTotalPrice, maxTotalPrice, expiredOnly],
  )

  useEffect(() => {
    if (!parsedFilter.success) {
      const firstError = parsedFilter.error.issues[0]?.message || 'Bo loc booking khong hop le'
      toast.error(firstError)
      return
    }

    const filterValues = parsedFilter.data

    dispatch(
      fetchBookings({
        keyword: filterValues.keyword || undefined,
        bookingStatus: filterValues.bookingStatus !== 'ALL' ? filterValues.bookingStatus : undefined,
        paymentStatus: filterValues.paymentStatus !== 'ALL' ? filterValues.paymentStatus : undefined,
        paymentMethod: filterValues.paymentMethod !== 'ALL' ? filterValues.paymentMethod : undefined,
        minTotalPrice: filterValues.minTotalPrice ? Number(filterValues.minTotalPrice) : undefined,
        maxTotalPrice: filterValues.maxTotalPrice ? Number(filterValues.maxTotalPrice) : undefined,
        expiredOnly: filterValues.expiredOnly || undefined,
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

  const handleViewBooking = (id: string) => {
    setSelectedBookingId(id)
    setIsDetailOpen(true)
  }

  async function reloadBookings() {
    dispatch(
      fetchBookings({
        keyword: keyword || undefined,
        bookingStatus: bookingStatusFilter !== 'ALL' ? bookingStatusFilter : undefined,
        paymentStatus: paymentStatusFilter !== 'ALL' ? paymentStatusFilter : undefined,
        paymentMethod: paymentMethodFilter !== 'ALL' ? paymentMethodFilter : undefined,
        minTotalPrice: minTotalPrice ? Number(minTotalPrice) : undefined,
        maxTotalPrice: maxTotalPrice ? Number(maxTotalPrice) : undefined,
        expiredOnly: expiredOnly || undefined,
        pageNumber,
        size,
      }),
    )
  }

  async function handleConfirm(id: string) {
    try {
      await confirmBooking(id)
      toast.success('Xác nhận booking thành công')
      await reloadBookings()
    } catch (err) {
      toast.error('Xác nhận thất bại')
    }
  }

  async function handleCancel(id: string) {
    try {
      await cancelBooking(id)
      toast.success('Hủy booking thành công')
      await reloadBookings()
    } catch (err) {
      toast.error('Hủy thất bại')
    }
  }

  return (
    <div className="space-y-5 text-left">
      <BookingHeader total={totalElements} />

      <BookingFilters
        keyword={searchInput}
        bookingStatus={bookingStatusFilter}
        paymentStatus={paymentStatusFilter}
        paymentMethod={paymentMethodFilter}
        minTotalPrice={minTotalPrice}
        maxTotalPrice={maxTotalPrice}
        onKeywordChange={setSearchInput}
        onBookingStatusChange={(value) => dispatch(setBookingStatusFilter(value))}
        onPaymentStatusChange={(value) => dispatch(setPaymentStatusFilter(value))}
        onPaymentMethodChange={(value) => dispatch(setPaymentMethodFilter(value))}
        onMinTotalPriceChange={(value) => dispatch(setMinTotalPrice(value))}
        onMaxTotalPriceChange={(value) => dispatch(setMaxTotalPrice(value))}
        onReset={handleResetFilters}
      />

      <BookingList bookings={bookings} loading={loading} onView={handleViewBooking} onConfirm={handleConfirm} onCancel={handleCancel} />

      <BookingPagination currentPage={pageNumber} totalPages={totalPages} onPageChange={(page) => dispatch(setPageNumber(page))} />

      <BookingDetailModal
        open={isDetailOpen}
        bookingId={selectedBookingId}
        onClose={() => {
          setIsDetailOpen(false)
          setSelectedBookingId(null)
        }}
      />
    </div>
  )
}
