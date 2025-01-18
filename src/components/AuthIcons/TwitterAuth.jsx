import { useEffect, useState } from 'react'
import XIcon from '../../assests/images/icons/x.png'
import { XMarkIcon } from '@heroicons/react/24/solid'
import { Tooltip } from '@mui/material'
import Cookies from 'js-cookie'
import axios from 'axios'

const XAuth = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [token, setToken] = useState(null)
  const [Secrettoken, setSecretToken] = useState(null)
  const [screenWidth, setScreenWidth] = useState(window.innerWidth)

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const checkAuthStatus = () => {
    const OauthToken = Cookies.get('twitter_oauth_token')
    const SecretToken = Cookies.get('twitter_oauth_token_secret')

    if (OauthToken && SecretToken) {
      setToken(OauthToken)
      setSecretToken(SecretToken)
      return true
    }
    setToken(null)
    setSecretToken(null)
    return false
  }

  useEffect(() => {
    checkAuthStatus()
    const intervalId = setInterval(checkAuthStatus, 1000)
    return () => clearInterval(intervalId)
  }, [])

  const handleTwitterLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5001/api/auth/twitter/Login')
      const data = response.data

      if (data.url) {
        const width = 600
        const height = 600
        const left = window.screen.width / 2 - width / 2
        const top = window.screen.height / 2 - height / 2

        const popup = window.open(
          data.url,
          'Twitter Login',
          `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,location=no,status=no`
        )

        const checkPopup = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkPopup)
            // Handle popup close event here if needed
          }
          if (checkAuthStatus()) {
            popup.close() // Close the popup after cookies are set
          }
        }, 1000)
      } else {
        console.error('Twitter authentication URL not received')
      }
    } catch (error) {
      console.error('Error initiating Twitter login:', error.response?.data || error.message)
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

  const getRightPosition = (width) => {
    if (width >= 1600) {
      return '44%' // Adjust this value for 1600px screens
    } else if (width >= 1540) {
      return '48%' // Adjust this value for 1540px screens
    } else {
      return '44%' // Default for smaller screens
    }
  }

  const rightPositionMyScreen = getRightPosition(screenWidth)

  return (
    <div
      className="top-[30%]  2xl:top-[33%]"
      style={{ position: 'absolute', right: rightPositionMyScreen, zIndex: 500 }}
    >
      {!token ? (
        <Tooltip placement="top" title="x Login">
          <img
            src={XIcon}
            alt="X"
            onClick={handleTwitterLogin}
            className={`cursor-pointer h-10 w-10 hover:opacity-50 ${isLoading ? 'opacity-50' : ''}`}
            style={{ pointerEvents: isLoading ? 'none' : 'auto' }}
          />
        </Tooltip>
      ) : (
        <Tooltip title="X" placement="top">
          <XMarkIcon
            onClick={handleLogout}
            className="text-white border-[6px] p-1 cursor-pointer bg-slate-400 bg-opacity-40 hover:opacity-50 border-sky-300 rounded-full h-10 w-10"
          />
        </Tooltip>
      )}
    </div>
  )
}

export default XAuth
