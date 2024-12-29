import React, { useState, useEffect } from 'react'
import LoginPage from '../src/pages/Login'
import HomePage from './pages/Home'
import ProtectedRoutes from './utils/protectedRoutes'
import { AuthContext } from './context/authContext'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import TwitterTest from './components/Home/TwitterTest/twitterTest'
import TwitterCallback from './components/Home/TwitterTest/TwitterCallBack/twitterCallBack'
// import TwitterShare from './components/Home/TwitterTest/TwitterVideoShare'
import LinkedInTest from './components/Home/LinkedInTest/linkedInTest'
import LinkedInCallback from './components/Home/LinkedInTest/LinkedInCalllback/linkedInCallBack'
import backgroundImage from './assests/images/background.png'
import VideoEditor from './pages/VideoEdit'

const router = createBrowserRouter(
  [
    { path: '/', element: <LoginPage /> },
    { path: '/callback/twitter', element: <TwitterCallback /> },
    { path: '/twitter-test', element: <TwitterTest /> },
    // { path: '/twitter-share', element: <TwitterShare /> },
    { path: '/linkedIn-test', element: <LinkedInTest /> },
    { path: '/linkedIn/callback', element: <LinkedInCallback /> },
    { path: '/edit', element: <VideoEditor /> },
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
