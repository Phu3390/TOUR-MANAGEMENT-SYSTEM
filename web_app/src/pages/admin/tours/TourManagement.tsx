import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import type { RootState } from '../../../store'
import { fetchTours, setKeyword, setPageNumber, setStatusFilter } from '../../../store/tour/slice'
import TourHeader from '../../../compoments/admin/tour/TourHeader'
import TourFilters, { type TourFilterState } from '../../../compoments/admin/tour/TourFilters'
import TourList from '../../../compoments/admin/tour/TourList'
import TourPagination from '../../../compoments/admin/tour/TourPagination'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import type { TourResponse } from '../../../types/tour/tour.type'

export default function Tour() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { tours, loading, pageNumber, size, totalElements, keyword, statusFilter, error } = useAppSelector(
    (state: RootState) => state.tour,
  )

  const [searchInput, setSearchInput] = useState('')

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

  const handleDelete = (tour: TourResponse) => {
    console.log('Delete tour:', tour)
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

      <TourList tours={tours} loading={loading} onDetail={handleDetail} onEdit={handleEdit} onDelete={handleDelete} />

      <TourPagination
        current={pageNumber + 1}
        pageSize={size}
        total={totalElements}
        onPageChange={handlePageChange}
      />
    </div>
  )
}
