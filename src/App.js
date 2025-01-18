import React, { useState, useEffect } from 'react'
import LoginPage from '../src/pages/Login'
import HomePage from './pages/Home'
import ProtectedRoutes from './utils/protectedRoutes'
import { AuthContext } from './context/authContext'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import TwitterTest from './components/Home/TwitterTest/twitterTest'
import TwitterCallback from './components/Home/TwitterTest/TwitterCallBack/twitterCallBack'
// import TwitterShare from './components/Home/TwitterTest/TwitterVideoShare'
import LinkedInTest from './components/Home/LinkedInTest/linkedInTest'
import LinkedInCallback from './components/Home/LinkedInTest/LinkedInCalllback/linkedInCallBack'
import backgroundImage from './assests/images/background.png'
import VideoEditor from './pages/VideoEdit'
import Cookies from 'js-cookie'
import ProfileModal from './Modal/ProfileModal/profileModal'
import SignupGoogle from './pages/SignupGoogle'
import { ForgotPassword, ResetPassword } from './pages/ForgetPassword'
import { StatsProvider } from './context/statsContext'
import { NotificationProvider } from './context/NotificationContext'

const App = () => {
  const [user, setUser] = useState('')
  const [token, setToken] = useState('')
  const isAuthenticated = !!Cookies.get('google_token')

  console.log(isAuthenticated)
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
        path: '/linkedin/callback',
        element: <LinkedInCallback />
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

  return (
    <div
      className="bg-cover bg-no-repeat bg-center min-h-screen"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <AuthContext.Provider value={{ user, setUser, token, setToken }}>
        <StatsProvider>
          <NotificationProvider>
            <RouterProvider router={router} />
          </NotificationProvider>
        </StatsProvider>
      </AuthContext.Provider>
    </div>
  )
}

export default App
