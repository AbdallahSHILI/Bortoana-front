import { Outlet, Navigate, useLocation } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const ProtectedRoutes = () => {
  const location = useLocation()
  const { user } = useAuth()
  const isLoggedIn = window.localStorage.getItem('isLoggedIn') === 'true'
  console.log('user:', user)
  return isLoggedIn ? <Outlet /> : <Navigate to="/" state={{ from: location }} replace />
}

export default ProtectedRoutes
