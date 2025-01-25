import React, { useState, useEffect } from 'react'
import LoginPage from '../src/pages/Login'
import HomePage from './pages/Home'
import ProtectedRoutes from './utils/protectedRoutes'
import { AuthContext } from './context/authContext'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import TwitterTest from './components/Home/TwitterTest/twitterTest'
import TwitterCallback from './components/Home/TwitterTest/TwitterCallBack/twitterCallBack'
import LinkedInTest from './components/Home/LinkedInTest/linkedInTest'
import LinkedInCallback from './components/Home/LinkedInTest/LinkedInCalllback/linkedInCallBack'
import backgroundImage from './assests/images/background.png'
import VideoEditor from './pages/VideoEdit'
import Cookies from 'js-cookie'
import ProfileModal from './Modal/ProfileModal/profileModal'
import SignupGoogle from './pages/SignupGoogle'
import { ForgotPassword, ResetPassword } from './pages/ForgetPassword'
import { StatsProvider } from './context/statsContext'

// Mobile Warning Component
const MobileWarning = () => {
  const [showWarning, setShowWarning] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      // More precise mobile detection
      const isMobile = window.innerWidth < 1160
      const isPopupOrModalOpen = document.querySelector('.popup-active, .modal-active')

      // Only show warning if it's mobile AND no popup/modal is currently open
      setShowWarning(isMobile && !isPopupOrModalOpen)
    }

    // Check initially and on resize
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)

    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  if (!showWarning) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 max-w-md shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <h2 className="text-lg font-semibold">Desktop Version Recommended</h2>
        </div>
        <div className="mt-2">
          <div className="flex items-center gap-2 mb-2">
            <svg
              className="w-4 h-4 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
            <span>This application is optimized for desktop use.</span>
          </div>
          <p className="text-gray-600">
            For the best experience, please access this site on a computer or tablet with a larger
            screen.
          </p>
        </div>
      </div>
    </div>
  )
}

const App = () => {
  const [user, setUser] = useState('')
  const [token, setToken] = useState('')
  const [isMobile, setIsMobile] = useState(false)
  const isAuthenticated = !!Cookies.get('google_token')

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1160)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)

    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const router = createBrowserRouter(
    [
      {
        path: '/',
        element: isAuthenticated ? <Navigate to="/home" /> : <LoginPage />
      },
      {
        path: '/callback/twitter',
        element: <TwitterCallback />
      },
      {
        path: '/linkedin/callback',
        element: <LinkedInCallback />
      },
      {
        path: '/forgot-password',
        element: <ForgotPassword />
      },
      {
        path: '/reset-password/:token',
        element: <ResetPassword />
      },
      {
        path: '/Signup',
        element: <SignupGoogle />
      },
      {
        path: '/home',
        element: (
          <ProtectedRoutes>
            <HomePage />
          </ProtectedRoutes>
        )
      },
      {
        path: '/twitter-test',
        element: (
          <ProtectedRoutes>
            <TwitterTest />
          </ProtectedRoutes>
        )
      },
      {
        path: '/linkedIn-test',
        element: (
          <ProtectedRoutes>
            <LinkedInTest />
          </ProtectedRoutes>
        )
      },
      {
        path: '/edit',
        element: (
          <ProtectedRoutes>
            <VideoEditor />
          </ProtectedRoutes>
        )
      }
    ],
    {
      basename: '/newbortoaana'
    }
  )

  // Check if current path is a callback route (only LinkedIn and Twitter)
  const isCallbackRoute =
    window.location.pathname.includes('/linkedin/callback') ||
    window.location.pathname.includes('/callback/twitter')

  return (
    <div
      className="bg-cover bg-no-repeat bg-center min-h-screen"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <AuthContext.Provider value={{ user, setUser, token, setToken }}>
        <StatsProvider>
          {/* Don't show mobile warning for callback routes */}
          {isMobile && !isCallbackRoute ? <MobileWarning /> : <RouterProvider router={router} />}
        </StatsProvider>
      </AuthContext.Provider>
    </div>
  )
}

export default App
