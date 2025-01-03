import { Outlet, Navigate, useLocation } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import Cookies from 'js-cookie'

const ProtectedRoutes = ({ children }) => {
  console.log('ProtectedRoutes mounting') // Basic mount check
  const location = useLocation()
  const { user } = useAuth()

  const googleToken = Cookies.get('google_token')
  console.log('Initial render, token:', googleToken)

  return googleToken ? (
    children || <Outlet />
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  )
}

export default ProtectedRoutes
