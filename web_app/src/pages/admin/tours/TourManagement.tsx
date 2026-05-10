import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import type { RootState } from '../../../store'
import { fetchTours, setKeyword, setPageNumber, setStatusFilter } from '../../../store/tour/slice'
import { editStatus } from '../../../api/tour/tour.api'
import TourHeader from '../../../compoments/admin/tour/TourHeader'
import TourFilters, { type TourFilterState } from '../../../compoments/admin/tour/TourFilters'
import TourList from '../../../compoments/admin/tour/TourList'
import TourPagination from '../../../compoments/admin/tour/TourPagination'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import type { TourResponse } from '../../../types/tour/tour.type'
import { TourStatus } from '../../../types/enums/TourStatus.enum'

export default function Tour() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { tours, loading, pageNumber, size, totalElements, keyword, statusFilter, error } = useAppSelector(
    (state: RootState) => state.tour,
  )

  const [searchInput, setSearchInput] = useState('')
  const [updatingTourId, setUpdatingTourId] = useState<string | null>(null)

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      dispatch(setKeyword(searchInput.trim()))
      dispatch(setPageNumber(0))
    }, 350)

    return () => window.clearTimeout(timeout)
  }, [dispatch, searchInput])

  useEffect(() => {
    dispatch(
      fetchTours({
        keyword: keyword || undefined,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        pageNumber: pageNumber,
        size,
      }),
    )
  }, [dispatch, keyword, pageNumber, size, statusFilter])

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  const handleFilterChange = (term: string) => {
    setSearchInput(term)
  }

  const handleStatusChange = (status: TourFilterState) => {
    dispatch(setStatusFilter(status))
    dispatch(setPageNumber(0))
  }

  const handlePageChange = (page: number) => {
    // page is 1-based from component; store expects 0-based
    dispatch(setPageNumber(page - 1))
  }

  const handleAddNew = () => {
    navigate('/admin/tours/create')
  }

  const handleDetail = (tour: TourResponse) => {
    navigate(`/admin/tours/${tour.id}`)
  }

  const handleEdit = (tour: TourResponse) => {
    navigate(`/admin/tours/${tour.id}/edit`)
  }

  const handleStatusToggle = async (tour: TourResponse, nextStatus: TourStatus) => {
    try {
      setUpdatingTourId(tour.id)
      await editStatus(tour.id, nextStatus)
      await dispatch(
        fetchTours({
          keyword: keyword || undefined,
          status: statusFilter !== 'ALL' ? statusFilter : undefined,
          pageNumber,
          size,
        }),
      ).unwrap()
      toast.success(`Đã cập nhật trạng thái tour`)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Cập nhật trạng thái thất bại'
      toast.error(message)
    } finally {
      setUpdatingTourId(null)
    }
  }

  const handleResetFilters = () => {
    setSearchInput('')
    dispatch(setKeyword(''))
    dispatch(setStatusFilter('ALL'))
    dispatch(setPageNumber(0))
  }

  return (
    <div className="space-y-5 text-left">
      <TourHeader onCreate={handleAddNew} />

      <TourFilters
        keyword={searchInput}
        status={statusFilter}
        onKeywordChange={handleFilterChange}
        onStatusChange={handleStatusChange}
        onReset={handleResetFilters}
      />

      <TourList
        tours={tours}
        loading={loading}
        onDetail={handleDetail}
        onEdit={handleEdit}
        onStatusToggle={handleStatusToggle}
        updatingTourId={updatingTourId}
      />

      <TourPagination
        current={pageNumber + 1}
        pageSize={size}
        total={totalElements}
        onPageChange={handlePageChange}
      />
    </div>
  )
}
