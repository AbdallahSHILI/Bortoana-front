import { useEffect, useState } from 'react'
import LinkedinIcon from '../../assests/images/icons/linkedin.png'
import { XMarkIcon } from '@heroicons/react/24/solid'
import { Tooltip } from '@mui/material'
import Cookies from 'js-cookie'
import axios from 'axios'

const LinkedinAuth = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [token, setToken] = useState(null)

  const checkAuthStatus = () => {
    const pageToken = Cookies.get('linkedin_oauth_access_token')
    if (pageToken) {
      setToken(pageToken)
      return true
    }
    setToken(null)
    return false
  }

  useEffect(() => {
    checkAuthStatus()
    const intervalId = setInterval(checkAuthStatus, 1000)
    return () => clearInterval(intervalId)
  }, [])

  const handleLogin = async () => {
    try {
      const response = await axios.post('https://bortoaana.onrender.com/api/auth/linkedIn/Login')
      const { authorizationUrl, state } = response.data
      sessionStorage.setItem('linkedinState', state)
      const width = 600
      const height = 800
      const left = (window.innerWidth - width) / 2
      const top = (window.innerHeight - height) / 2

      const popup = window.open(
        authorizationUrl,
        'LinkedIn Login',
        `width=${width},height=${height},left=${left},top=${top}`
      )

      const popupInterval = setInterval(() => {
        // Check if popup is closed
        if (popup.closed) {
          clearInterval(popupInterval)
          return
        }

        // Check if the token is available in cookies
        const hasToken = Cookies.get('linkedin_oauth_access_token')
        if (hasToken) {
          popup.close() // Close the popup immediately once the token is available
          clearInterval(popupInterval) // Stop the interval to prevent further checks
          checkAuthStatus() // Call your auth check function
          window.history.replaceState({}, '', '/newbortoaana/home') // Redirect to desired page
        }
      }, 1000)

      // Optional: Add a message event listener to handle specific success scenarios
      window.addEventListener(
        'message',
        (event) => {
          if (event.data === 'LINKEDIN_LOGIN_SUCCESS') {
            popup.close()
            checkAuthStatus()
            window.history.replaceState({}, '', '/newbortoaana/home')
          }
        },
        { once: true } // Ensures the listener is removed after first use
      )
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleLogout = () => {
    try {
      setToken(null)
      Cookies.remove('linkedin_oauth_access_token', { path: '/' })
      Cookies.remove('linkedin_user_info', { path: '/' })
      sessionStorage.removeItem('linkedinState')
      window.location.replace('/newbortoaana/home')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <div className="absolute right-[48%] bottom-[38%] z-[500]">
      {!token ? (
        <Tooltip placement="top" title="LinkedIn">
          <img
            src={LinkedinIcon}
            alt="LinkedIn"
            onClick={handleLogin}
            className={`cursor-pointer h-10 w-10 hover:opacity-50 ${isLoading ? 'opacity-50' : ''}`}
            style={{ pointerEvents: isLoading ? 'none' : 'auto' }}
          />
        </Tooltip>
      ) : (
        <Tooltip title="LinkedIn" placement="top">
          <XMarkIcon
            onClick={handleLogout}
            className="text-white border-[6px] p-1 cursor-pointer bg-slate-400 bg-opacity-40 hover:opacity-50 border-sky-300 rounded-full h-10 w-10"
          />
        </Tooltip>
      )}
    </div>
  )
}

export default LinkedinAuth
