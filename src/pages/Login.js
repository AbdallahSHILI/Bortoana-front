import React, { useEffect, useRef, useState } from 'react'
import videoSource from '../assests/videos/animation.mp4'
import axios from 'axios'
import { Spinner } from '../components/Spinner'
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import Cookies from 'js-cookie'
import { Link } from 'react-router-dom'
import { useStats } from '../context/statsContext'

function Login() {
  const { setUser, setToken } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const { refreshStats } = useStats()

  const handleLogin = async (e) => {
    e.preventDefault() // Prevent the default form submission
    setLoading(true)
    try {
      const response = await axios.post('http://localhost:5001/api/user/login', {
        email,
        password
      })
      console.log('Login successful:', response)
      Cookies.set('userId', response.data.user.id)
      Cookies.set('google_token', response.data.token)
      setUser(response.data.user)
      setToken(response.data.token)
      console.log('response.data.user:', response.data.user)
      console.log('response.data.token:', response.data.token)
      window.localStorage.setItem('token', response.data.token)
      window.localStorage.setItem('isLoggedIn', true)

      // Refresh stats after successful login
      await refreshStats()

      navigate('/home')
    } catch (error) {
      if (error.response) {
        console.error('Login failed:', error.response.data)
        setErrorMessage(error.response.data.message || 'Login failed')
      } else {
        setErrorMessage('An unexpected error occurred')
        console.error('Login failed:', error.message)
      }
    } finally {
      setLoading(false) // Set loading to false after request
    }
  }

  // Function to get token from URL and save as cookie
  const popupRef = useRef(null)
  useEffect(() => {
    // Check for cookies every second
    const checkCookies = setInterval(() => {
      const googleToken = Cookies.get('google_token')
      const userId = Cookies.get('userId')

      if (googleToken && userId) {
        clearInterval(checkCookies)
        navigate('/home')
      }
    }, 1000)

    // Cleanup
    return () => clearInterval(checkCookies)
  }, [navigate])

  const handleGoogleLogin = () => {
    const baseUrl =
      process.env.NODE_ENV === 'production'
        ? 'https://bortoaana.onrender.com'
        : 'http://localhost:5001'

    const width = 500
    const height = 600
    const left = window.screenX + (window.outerWidth - width) / 2
    const top = window.screenY + (window.outerHeight - height) / 2

    // Close existing popup if it exists
    if (popupRef.current) {
      popupRef.current.close()
    }

    // Open new popup
    popupRef.current = window.open(
      `${baseUrl}/api/googleauth/auth/google`,
      'Google Login',
      `width=${width},height=${height},left=${left},top=${top}`
    )
  }

  return (
    <div className="h-screen w-screen bg-gray-900 flex items-center justify-center">
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        src={videoSource}
        type="video/mp4"
      />
      <div className="bg-[#111111]/50 relative overflow-hidden w-[487px] h-[590px] flex flex-col items-center justify-center p-6 rounded-lg shadow-lg z-10 m-4 sm:my-2 sm:mx-2">
        <div className="absolute z-[1] w-full h-full backdrop-blur-xl top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2" />
        <div className="z-[2]">
          <h1 className="text-white text-xl mb-3">It's great to see you again!</h1>
          <h5 className="text-white mb-9 text-xs sm:text-base">
            Welcome back! We're delighted to have you with us again!
          </h5>
          {errorMessage && (
            <div className="bg-red-500 text-white p-2 rounded mb-4">{errorMessage}</div>
          )}
          <div className="w-full mb-4">
            <label className="text-white block mb-1">Email Address</label>
            <input
              type="email"
              placeholder="Email Address"
              className="mb-4 p-2 w-full rounded bg-gray-800 text-white placeholder-gray-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="w-full mb-4">
            <label className="text-white block mb-1">Password</label>
            <input
              type="password"
              placeholder="Password"
              className="mb-4 p-2 w-full rounded bg-gray-800 text-white placeholder-gray-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="w-full mb-4 flex justify-end">
            <Link
              to="/forgot-password"
              state={{ source: 'login' }}
              className="text-blue-400 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>

          <button
            onClick={handleLogin}
            className="bg-white text-black py-2 px-4 rounded w-full hover:bg-gray-200 transition"
          >
            {loading ? <Spinner /> : 'Login'}
          </button>
          <button
            onClick={handleGoogleLogin}
            className="bg-white mt-5 text-black py-2 px-4 rounded w-full hover:bg-gray-200 transition"
          >
            Continue with Google
          </button>
          <Link
            to="/Signup"
            className="bg-white mt-5 text-black py-2 px-4 rounded w-full hover:bg-gray-200 transition block text-center"
          >
            Signup with Email
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login
