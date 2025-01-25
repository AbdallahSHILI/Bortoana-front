import { useEffect, useState } from 'react'
import LinkedinIcon from '../../assests/images/icons/linkedin.png'
import { Tooltip } from '@mui/material'
import Cookies from 'js-cookie'
import axios from 'axios'

const LinkedinAuth = ({ style }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [token, setToken] = useState(null)

  const baseUrl =
    process.env.NODE_ENV === 'production'
      ? 'https://bortoaana.onrender.com'
      : 'http://localhost:5001'

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
      setIsLoading(true)
      const response = await axios.post(`${baseUrl}/api/auth/linkedIn/Login`)
      const { authorizationUrl, state } = response.data
      sessionStorage.setItem('linkedinState', state)

      const width = 600
      const height = 800
      const left = (window.innerWidth - width) / 2
      const top = (window.innerHeight - height) / 2

      // Add popup-active class when opening popup
      document.body.classList.add('popup-active')

      const popup = window.open(
        authorizationUrl,
        'LinkedIn Login',
        `width=${width},height=${height},left=${left},top=${top}`
      )

      const popupInterval = setInterval(() => {
        if (popup.closed) {
          clearInterval(popupInterval)
          setIsLoading(false)
          // Remove popup-active class when popup closes
          document.body.classList.remove('popup-active')
          return
        }

        const hasToken = Cookies.get('linkedin_oauth_access_token')
        if (hasToken) {
          popup.close()
          clearInterval(popupInterval)
          setIsLoading(false)
          // Remove popup-active class when done
          document.body.classList.remove('popup-active')
          checkAuthStatus()
          window.history.replaceState({}, '', '/newbortoaana/home')
        }
      }, 1000)

      window.addEventListener(
        'message',
        (event) => {
          if (event.data === 'LINKEDIN_LOGIN_SUCCESS') {
            popup.close()
            setIsLoading(false)
            // Remove popup-active class when done
            document.body.classList.remove('popup-active')
            checkAuthStatus()
            window.history.replaceState({}, '', '/newbortoaana/home')
          }
        },
        { once: true }
      )
    } catch (error) {
      setIsLoading(false)
      // Ensure popup-active class is removed even if there's an error
      document.body.classList.remove('popup-active')
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
    <div
      className="absolute"
      style={{
        ...style, // Use the style prop passed from the parent
        zIndex: 500
      }}
    >
      {!token ? (
        <Tooltip placement="top" title="LinkedIn Login">
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
          <div
            className="cursor-pointer hover:opacity-50"
            style={{
              border: '2px solid red',
              borderRadius: '50%',
              padding: '2px',
              pointerEvents: isLoading ? 'none' : 'auto'
            }}
            onClick={handleLogout}
          >
            <img src={LinkedinIcon} alt="LinkedIn" className="h-10 w-10" />
          </div>
        </Tooltip>
      )}
    </div>
  )
}

export default LinkedinAuth
