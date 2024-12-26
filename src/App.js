import React, { useState } from 'react'
import LoginPage from '../src/pages/Login'
import HomePage from './pages/Home'
import ProtectedRoutes from './utils/protectedRoutes'
import { AuthContext } from './context/authContext'
import { createBrowserRouter, RouterProvider, Route, Link } from 'react-router-dom'
import TwitterTest from './components/Home/TwitterTest/twitterTest'
import TwitterCallback from './components/Home/TwitterTest/TwitterCallBack/twitterCallBack'
import TwitterShare from './components/Home/TwitterTest/TwitterShare/TwitterVideoShare'
import LinkedInTest from './components/Home/LinkedInTest/linkedInTest'
import LinkedInCallback from './components/Home/LinkedInTest/LinkedInCalllback/linkedInCallBack'
import LinkedInVideoShare from './components/Home/LinkedInTest/LinkedInShare/linkedInVideoShare'
import PinterestLogin from './components/Pinterest/pinterestlogin'
import PinterestCallBack from './components/Pinterest/PinterestCallBack/pinterestCallBack'
import SnapchatLogin from './components/Snapchat/snapchatLogin'
import SnapchatCallBack from './components/Snapchat/SnapchatCallBack/SnapchatCallback'
import SnapchatShare from './components/Snapchat/SnapchatShareVideo/shareVideo'
import ScheduleTwitter from './components/Schedule/scheduleTwitter'

const router = createBrowserRouter(
  [
    { path: '/', element: <LoginPage /> },
    { path: '/callback/twitter', element: <TwitterCallback /> },
    { path: '/twitter-test', element: <TwitterTest /> },
    { path: '/twitter-share', element: <TwitterShare /> },
    { path: '/twitter-schedule', element: <ScheduleTwitter /> },
    { path: '/linkedIn-test', element: <LinkedInTest /> },
    { path: '/linkedin/callback', element: <LinkedInCallback /> },
    { path: '/pinterest-login', element: <PinterestLogin /> },
    { path: '/pinterest/callback', element: <PinterestCallBack /> },
    { path: '/snapchat-login', element: <SnapchatLogin /> },
    { path: '/Callback/Snapchat', element: <SnapchatCallBack /> },
    { path: '/snapchat-share', element: <SnapchatShare /> },
    { path: '/linkedin-share', element: <LinkedInVideoShare /> },
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
