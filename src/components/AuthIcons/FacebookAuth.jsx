import { useEffect, useState } from 'react'
import FacebookIcon from '../../assests/images/icons/facebook.png'
import { XMarkIcon } from '@heroicons/react/24/solid'
import { Tooltip } from '@mui/material'
import Cookies from 'js-cookie'

const FacebookAuth = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [token, setToken] = useState(null)
  const baseUrl = process.env.NODE_ENV == 'production' ? 'ttps://bortoaana.onrender.com' : 'http://localhost:5001'

  // Ensure this matches your backend origin exactly
  const ALLOWED_ORIGIN = 'https://bortoaana.onrender.com'
  const FRONTEND_ORIGIN = window.location.origin

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

  const handleFacebookLogin = (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Calculate center position for the popup
      const width = 600
      const height = 800
      const left = (window.innerWidth - width) / 2 + window.screenX
      const top = (window.innerHeight - height) / 2 + window.screenY

      // Configure window features
      const windowFeatures = {
        width,
        height,
        left,
        top,
        menubar: 'no',
        toolbar: 'no',
        location: 'no',
        status: 'no',
        scrollbars: 'yes',
        resizable: 'yes'
      }

      const featuresString = Object.entries(windowFeatures)
        .map(([key, value]) => `${key}=${value}`)
        .join(',')

      // Add state parameter to prevent CSRF
      const state = Math.random().toString(36).substring(7)
      sessionStorage.setItem('facebook_auth_state', state)

      // Open the popup with the state parameter
      const loginUrl = `${baseUrl}/api/facebook/login?state=${state}&redirect_uri=${encodeURIComponent(FRONTEND_ORIGIN)}`
      window.open(loginUrl, 'FacebookLogin', featuresString)
    } catch (error) {
      console.error('Login error:', error)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    function handleMessage(event) {
      // Strict origin checking
      if (event.origin !== ALLOWED_ORIGIN) {
        console.warn('Received message from unauthorized origin:', event.origin)
        return
      }

      // Validate message structure
      if (!event.data || typeof event.data !== 'object') {
        return
      }

      // Validate state to prevent CSRF
      const savedState = sessionStorage.getItem('facebook_auth_state')
      if (event.data.state !== savedState) {
        console.warn('Invalid state parameter')
        return
      }

      if (event.data.type === 'FACEBOOK_LOGIN_SUCCESS' && event.data.token) {
        try {
          // Clear state after successful validation
          sessionStorage.removeItem('facebook_auth_state')

          setToken(event.data.token)

          // Set cookies
          // Cookies.set('facebook_page_token', event.data.token, {
          //   expires: 1,
          //   secure: true,
          //   sameSite: 'None', // Match backend setting
          //   path: '/'
          // })

          // Cookies.set('facebook_page_id', event.data.pageId || event.data.token, {
          //   expires: 1,
          //   secure: true,
          //   sameSite: 'None', // Match backend setting
          //   path: '/'
          // })

          checkAuthStatus()

          // Use replace instead of pushState for cleaner history
          window.history.replaceState({}, '', '/newbortoaana/home')
        } catch (error) {
          console.error('Error handling login success:', error)
        }
      }
    }

    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [])

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
    <div className="absolute left-[38%] top-[43%] z-[500]">
      {!token ? (
        <Tooltip placement="top" title="Facebook">
          <img
            src={FacebookIcon}
            alt="Facebook"
            onClick={handleFacebookLogin}
            className={`cursor-pointer h-10 w-10 hover:opacity-50 ${isLoading ? 'opacity-50' : ''}`}
            style={{ pointerEvents: isLoading ? 'none' : 'auto' }}
          />
        </Tooltip>
      ) : (
        <Tooltip title="Facebook" placement="top">
          <XMarkIcon
            onClick={handleLogout}
            className="text-white border-[6px] p-1 cursor-pointer bg-slate-400 bg-opacity-40 hover:opacity-50 border-sky-300 rounded-full h-10 w-10"
          />
        </Tooltip>
      )}
    </div>
  )
}

export default FacebookAuth
