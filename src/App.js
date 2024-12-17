import React, { useState } from 'react'
import LoginPage from '../src/pages/Login'
import HomePage from './pages/Home'
import ProtectedRoutes from './utils/protectedRoutes'
import { AuthContext } from './context/authContext'
import { createBrowserRouter, RouterProvider, Route, Link } from 'react-router-dom'
import InstagramCallback from './components/Instagram/InstagramCallback'
import XCallback from './components/X/XCallback'
import TwitterTest from './components/Home/TwitterTest/twitterTest'
import TwitterCallback from './components/Home/TwitterTest/TwitterCallBack/twitterCallBack'
import TwitterShare from './components/Home/TwitterTest/TwitterShare/TwitterVideoShare'
import LinkedInTest from './components/Home/LinkedInTest/linkedInTest'
import LinkedInCallback from './components/Home/LinkedInTest/LinkedInCalllback/linkedInCallBack'

const router = createBrowserRouter(
  [
    { path: '/', element: <LoginPage /> },
    { path: '/callback/twitter', element: <TwitterCallback /> },
    { path: '/twitter-test', element: <TwitterTest /> },
    { path: '/twitter-share', element: <TwitterShare /> },
    { path: '/linkedIn-test', element: <LinkedInTest /> },
    { path: '/callback/linkedIn', element: <LinkedInCallback /> },
    {
      element: <ProtectedRoutes />,
      children: [{ path: '/home', element: <HomePage /> }]
    }
  ],
  {
    basename: '/newbortoaana'
  }
)

const App = () => {
  const [user, setUser] = useState('')
  const [token, setToken] = useState('')
  return (
    <AuthContext.Provider value={{ user, setUser, token, setToken }}>
      <RouterProvider router={router} />
    </AuthContext.Provider>
  )
}

export default App
