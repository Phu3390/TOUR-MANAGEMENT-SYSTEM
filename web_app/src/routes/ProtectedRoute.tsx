import type { ReactNode } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppSelector } from '../store/hooks'

type ProtectedRouteProps = {
	children?: ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
	const location = useLocation()
	const token = useAppSelector((state) => state.auth.token) || localStorage.getItem('token')

	if (!token) {
		return <Navigate to="/login" replace state={{ from: location }} />
	}

	if (location.pathname === '/login' || location.pathname === '/signup') {
		return <Navigate to="/admin" replace />
	}

	return children ? <>{children}</> : <Outlet />
}
