import { useEffect, useState } from 'react'
import XIcon from '../../assests/images/icons/x.png'
import { Tooltip } from '@mui/material'
import Cookies from 'js-cookie'
import axios from 'axios'

const XAuth = ({ style }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [token, setToken] = useState(null)

  const baseUrl =
    process.env.NODE_ENV === 'production'
      ? 'https://bortoaana.onrender.com'
      : 'http://localhost:5001'

  const checkAuthStatus = () => {
    const OauthToken = Cookies.get('twitter_oauth_token')
    const SecretToken = Cookies.get('twitter_oauth_token_secret')

    if (OauthToken && SecretToken) {
      setToken(OauthToken)
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
    setIsLoading(true)
    try {
      const response = await axios.post(`${baseUrl}/api/auth/twitter/Login`)
      const { url } = response.data

      if (url) {
        const width = 600
        const height = 800
        const left = (window.innerWidth - width) / 2
        const top = (window.innerHeight - height) / 2

        document.body.classList.add('popup-active')

        const popup = window.open(
          url,
          'X Login',
          `width=${width},height=${height},left=${left},top=${top}`
        )

        const popupInterval = setInterval(() => {
          if (popup.closed) {
            clearInterval(popupInterval)
            setIsLoading(false)
            document.body.classList.remove('popup-active')
            return
          }

          if (checkAuthStatus()) {
            popup.close()
            clearInterval(popupInterval)
            setIsLoading(false)
            document.body.classList.remove('popup-active')
            window.history.replaceState({}, '', '/newbortoaana/home')
          }
        }, 1000)
      }
    } catch (error) {
      console.error('Login error:', error)
      setIsLoading(false)
      document.body.classList.remove('popup-active')
    }
  }

  const handleLogout = () => {
    try {
      setToken(null)
      Cookies.remove('twitter_oauth_token', { path: '/' })
      Cookies.remove('twitter_oauth_token_secret', { path: '/' })
      sessionStorage.removeItem('X_auth_state')
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
        <Tooltip placement="top" title="X Login">
          <img
            src={XIcon}
            alt="X"
            onClick={handleLogin}
            className={`cursor-pointer h-10 w-10 hover:opacity-50 ${isLoading ? 'opacity-50' : ''}`}
            style={{ pointerEvents: isLoading ? 'none' : 'auto' }}
          />
        </Tooltip>
      ) : (
        <Tooltip title="X" placement="top">
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
            <img src={XIcon} alt="X" className="h-10 w-10" />
          </div>
        </Tooltip>
      )}
    </div>
  )
}

export default XAuth
