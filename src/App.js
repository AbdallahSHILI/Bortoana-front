import React, { useState } from 'react'
import LoginPage from '../src/pages/Login'
import HomePage from './pages/Home'
import ProtectedRoutes from './utils/protectedRoutes'
import { AuthContext } from './context/authContext'
import { createBrowserRouter, RouterProvider, Route, Link } from 'react-router-dom'

const router = createBrowserRouter(
  [
    { path: '/', element: <LoginPage /> },
    {
      element: <ProtectedRoutes />, // Protect the routes inside
      children: [
        { path: '/home', element: <HomePage /> } // Home page route
      ]
    }
  ],
  {
    basename: '/newbortoaana' // Add the basename for your GitHub Pages URL
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
