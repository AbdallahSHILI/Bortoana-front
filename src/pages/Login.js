import React, { useEffect, useState } from 'react'
import videoSource from '../assests/videos/animation.mp4'
import axios from 'axios'
import { Spinner } from '../components/Spinner'
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import Cookies from 'js-cookie'

function Login() {
  const { setUser, setToken } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault() // Prevent the default form submission
    setLoading(true)
    try {
      const response = await axios.post('https://bortoaana.onrender.com/api/user/login', {
        email,
        password
      })
      console.log('Login successful:', response)
      Cookies.set('userId', response.data.user.id)
      setUser(response.data.user)
      setToken(response.data.token)
      console.log('response.data.user:', response.data.user)
      console.log('response.data.token:', response.data.token)
      window.localStorage.setItem('token', response.data.token)
      window.localStorage.setItem('isLoggedIn', true)
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

  // const handleFacebookLogin = async (e) => {
  //   e.preventDefault()
  //   console.log('hello')
  //   window.location.href = 'https://bortoaana.onrender.com/api/facebook/'
  // }

  // Function to get token from URL and save as cookie

  const handleGoogleLogin = (e) => {
    e.preventDefault()
    const baseUrl =
      process.env.NODE_ENV === 'production'
        ? 'https://bortoaana.onrender.com'
        : 'http://localhost:5001'

    // Calculate center position for popup
    const width = 500
    const height = 600
    const left = window.screenX + (window.outerWidth - width) / 2
    const top = window.screenY + (window.outerHeight - height) / 2

    // Open popup
    const popup = window.open(
      `${baseUrl}/api/googleauth/auth/google`,
      'Google Login',
      `width=${width},height=${height},left=${left},top=${top}`
    )

    // Check periodically if the popup has been closed
    const pollTimer = setInterval(() => {
      const token = Cookies.get('google_token')
      if (popup.closed && token) {
        clearInterval(pollTimer)
        window.location.replace('/newbortoaana/home')
      }
    }, 500)
  }
  return (
    <div className="h-screen w-screen bg-gray-900     flex items-center justify-center">
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        src={videoSource}
        type="video/mp4"
      />
      <div className="bg-[#111111]/50 relative overflow-hidden  w-[487px] h-[590px] flex flex-col items-center justify-center p-6 rounded-lg shadow-lg z-10 m-4 sm:my-2 sm:mx-2">
        <div className="absolute z-[1] w-full h-full backdrop-blur-xl top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2" />
        <div className="z-[2]">
          <h1 className="text-white text-xl mb-3">It's great to see you again!</h1>
          <h5 className="text-white mb-9 text-xs  sm:text-base">
            {' '}
            Welcome back !we're delighted to have you with us again !
          </h5>
          {errorMessage && (
            <div className="bg-red-500 text-white p-2 rounded mb-4">{errorMessage}</div>
          )}
          <div className="w-full mb-4">
            <label className="text-white  block mb-1">Email Address</label>

            <input
              type="email"
              placeholder="Email Address"
              className="mb-4 p-2 w-full rounded bg-gray-800 text-white placeholder-gray-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="w-full mb-4">
            <label className="text-white  block mb-1">Password</label>
            <input
              type="password"
              placeholder="Password"
              className="mb-4 p-2 w-full rounded bg-gray-800 text-white placeholder-gray-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="w-full mb-4 flex justify-end">
            <a href="/#" className="text-blue-400 hover:underline">
              Forgot your password?
            </a>
          </div>

          <button
            onClick={handleLogin}
            className="bg-white text-black py-2 px-4 rounded w-full hover:bg-gray-200 transition"
          >
            {loading ? <Spinner /> : 'Login'}
          </button>
          {/* <button    onClick={handleFacebookLogin} className="bg-white mt-5 text-black py-2 px-4 rounded w-full hover:bg-gray-200 transition">
          login with facebook
        </button> */}
          <button
            onClick={handleGoogleLogin}
            className="bg-white mt-5 text-black py-2 px-4 rounded w-full hover:bg-gray-200 transition"
          >
            login with Google
          </button>
          <button
            // onClick={handleTikTokLogin}
            className="bg-white mt-5 text-black py-2 px-4 rounded w-full hover:bg-gray-200 transition"
          >
            Login with TikTok
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login
