import type { ReactNode } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppSelector } from '../store/hooks'
import { getRoleFromToken, isTokenExpired } from '../utils/jwt'

type ProtectedRouteProps = {
	children?: ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
	const location = useLocation()
	const token = useAppSelector((state) => state.auth.token) || localStorage.getItem('token')
	const role = token ? getRoleFromToken(token) : null

	// Allow payment callbacks to show success page even when token is missing
	const isPaymentCallback =
		location.pathname === '/client/bookings' &&
		(location.search.includes('vnpay') || location.search.includes('momo'))

	// Check if token exists and not expired
	if (!token || isTokenExpired(token)) {
		if (!isPaymentCallback) {
			return <Navigate to="/login" replace state={{ from: location }} />
		}
	}

	// If accessing login/signup, redirect to default page based on role
	if (location.pathname === '/login' || location.pathname === '/signup') {
		if (token && !isTokenExpired(token)) {
			return <Navigate to={role === 'ADMIN' ? '/admin' : '/client'} replace />
		}
		return children ? <>{children}</> : <Outlet />
	}

	// Check admin route access
	if (location.pathname.startsWith('/admin')) {
		if (!token || isTokenExpired(token)) {
			return <Navigate to="/login" replace state={{ from: location }} />
		}
		if (role !== 'ADMIN') {
			return <Navigate to="/client" replace />
		}
	}

	// Check client route access
	if (location.pathname.startsWith('/client')) {
		if (!token || isTokenExpired(token)) {
			return <Navigate to="/login" replace state={{ from: location }} />
		}
		// Both ADMIN and USER can access client routes
		if (role !== 'ADMIN' && role !== 'USER') {
			return <Navigate to="/login" replace />
		}
	}

	return children ? <>{children}</> : <Outlet />
}
