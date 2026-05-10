import { Routes, Route, Navigate } from 'react-router-dom'
import Login from '../pages/auth/Login'
import Signup from '../pages/auth/Signup'
import App from '../App'
import AdminLayout from '../layouts/AdminLayout'
import ClientLayout from '../layouts/ClientLayout'
import Dashboard from '../pages/admin/Dashboard'
import CreateTourPage from '../pages/admin/tours/CreateTour'
import TourDetailPage from '../pages/admin/tours/TourDetail'
import UpdateTourPage from '../pages/admin/tours/UpdateTour_refactored'
import TourManagement from '../pages/admin/tours/TourManagement'
import UserManagement from '../pages/admin/UserManagement'
import BookingManagement from '../pages/admin/bookings/BookingManagement'
import VoucherManagement from '../pages/admin/bookings/VoucherManagement'
import ToursPage from '../pages/client/Tours'
import ClientTourDetailPage from '../pages/client/TourDetail'
import ClientHome from '../pages/client/Home'
import BookingPage from '../pages/client/Booking'
import ProtectedRoute from './ProtectedRoute'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />


      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="tours" element={<TourManagement />} />
          <Route path="bookings" element={<BookingManagement />} />
          <Route path="vouchers" element={<VoucherManagement />} />
          <Route path="tours/create" element={<CreateTourPage />} />
          <Route path="tours/:id/edit" element={<UpdateTourPage />} />
          <Route path="tours/:id" element={<TourDetailPage />} />
        </Route>
      </Route>
      
      <Route path="/app" element={<App />} />

      <Route path="/client" element={<ClientLayout />}>
        <Route index element={<ClientHome />} />
        <Route path="tours" element={<ToursPage />} />
        <Route path="tours/:id" element={<ClientTourDetailPage />} />
        <Route path="tours/:id/booking" element={<BookingPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
