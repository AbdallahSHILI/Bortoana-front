import { useEffect, useState } from 'react'
import FacebookIcon from '../../assests/images/icons/facebook.png'
import { Tooltip } from '@mui/material'
import Cookies from 'js-cookie'

const FacebookAuth = ({ style }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [token, setToken] = useState(null)

  const baseUrl =
    process.env.NODE_ENV === 'production'
      ? 'https://bortoaana.onrender.com'
      : 'http://localhost:5001'

  const checkAuthStatus = () => {
    const pageToken = Cookies.get('facebook_page_token')
    const pageId = Cookies.get('facebook_page_id')

    if (pageToken && pageId) {
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

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const width = 600
      const height = 800
      const left = (window.innerWidth - width) / 2
      const top = (window.innerHeight - height) / 2

      // Add popup-active class when opening popup
      document.body.classList.add('popup-active')

      const state = Math.random().toString(36).substring(7)
      sessionStorage.setItem('facebook_auth_state', state)

      const popup = window.open(
        `${baseUrl}/api/facebook/login?state=${state}&redirect_uri=${encodeURIComponent(
          window.location.origin
        )}`,
        'Facebook Login',
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

        if (checkAuthStatus()) {
          popup.close()
          clearInterval(popupInterval)
          setIsLoading(false)
          // Remove popup-active class when done
          document.body.classList.remove('popup-active')
          window.history.replaceState({}, '', '/newbortoaana/home')
        }
      }, 1000)
    } catch (error) {
      console.error('Login error:', error)
      setIsLoading(false)
      // Remove popup-active class if there's an error
      document.body.classList.remove('popup-active')
    }
  }

  const handleLogout = () => {
    try {
      setToken(null)
      Cookies.remove('facebook_page_token', { path: '/' })
      Cookies.remove('facebook_page_id', { path: '/' })
      sessionStorage.removeItem('facebook_auth_state')
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
        <Tooltip placement="top" title="Facebook Login">
          <img
            src={FacebookIcon}
            alt="Facebook"
            onClick={handleLogin}
            className={`cursor-pointer h-10 w-10 hover:opacity-50 ${isLoading ? 'opacity-50' : ''}`}
            style={{ pointerEvents: isLoading ? 'none' : 'auto' }}
          />
        </Tooltip>
      ) : (
        <Tooltip title="Facebook" placement="top">
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
            <img src={FacebookIcon} alt="Facebook" className="h-10 w-10" />
          </div>
        </Tooltip>
      )}
    </div>
  )
}

export default FacebookAuth
