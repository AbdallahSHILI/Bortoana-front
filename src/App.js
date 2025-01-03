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

const App = () => {
  const [user, setUser] = useState('')
  const [token, setToken] = useState('')
  const isAuthenticated = !!Cookies.get('google_token')
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
        path: '/linkedIn/callback',
        element: <LinkedInCallback />
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
  // // const [isMobile, setIsMobile] = useState(false)

  // useEffect(() => {
  //   const checkScreenSize = () => {
  //     setIsMobile(window.innerWidth < 1300)
  //   }

  //   checkScreenSize()

  //   window.addEventListener('resize', checkScreenSize)

  //   return () => {
  //     window.removeEventListener('resize', checkScreenSize)
  //   }
  // }, [])

  return (
    <div
      className="bg-cover bg-no-repeat bg-center min-h-screen"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <AuthContext.Provider value={{ user, setUser, token, setToken }}>
        {/* {isMobile ? ( */}
        {/* <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-center text-xl font-semibold">This app is only available on PC</h2>
            <p className="text-center mt-2">
              Please use a laptop or desktop to access the full app.
            </p>
          </div>
        </div> */}
        {/* ) : ( */}
        <RouterProvider router={router} />
        {/* )} */}
      </AuthContext.Provider>
    </div>
  )
}

export default App
