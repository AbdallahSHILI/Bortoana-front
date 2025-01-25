import { useEffect, useState } from 'react'
import InstagramIcon from '../../assests/images/icons/instagram.png'
import PostButton from '../PostPublishButton'
import PostStoryButton from '../PostPublishStory'
import { Tooltip } from '@mui/material'
import Cookies from 'js-cookie'

const InstagramAuth = ({ style }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [token, setToken] = useState(null)

  const baseUrl =
    process.env.NODE_ENV === 'production'
      ? 'https://bortoaana.onrender.com'
      : 'http://localhost:5001'

  const checkAuthStatus = () => {
    const savedToken = Cookies.get('instagram_token')
    if (savedToken) {
      setToken(savedToken)
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

    // Add popup-active class when opening popup
    document.body.classList.add('popup-active')

    const width = 600
    const height = 800
    const left = (window.innerWidth - width) / 2
    const top = (window.innerHeight - height) / 2

    const popup = window.open(
      'https://www.instagram.com/oauth/authorize?enable_fb_login=0&force_authentication=1&client_id=921275860068455&redirect_uri=https://bortoaana.onrender.com/api/instagram/callback&response_type=code&scope=instagram_business_basic%2Cinstagram_business_manage_messages%2Cinstagram_business_manage_comments%2Cinstagram_business_content_publish',
      'Instagram Login',
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
  }

  const handleLogout = () => {
    try {
      setToken(null)
      Cookies.remove('instagram_token', { path: '/' })
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
        <Tooltip placement="top" title="Instagram Login">
          <img
            src={InstagramIcon}
            alt="Instagram"
            onClick={handleLogin}
            className={`cursor-pointer h-10 w-10 hover:opacity-50 ${isLoading ? 'opacity-50' : ''}`}
            style={{ pointerEvents: isLoading ? 'none' : 'auto' }}
          />
        </Tooltip>
      ) : (
        <>
          <Tooltip title="Instagram" placement="top">
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
              <img src={InstagramIcon} alt="Instagram" className="h-10 w-10" />
            </div>
          </Tooltip>
          <div className="flex flex-col gap-5 mt-4">
            <PostButton />
            <PostStoryButton />
          </div>
        </>
      )}
    </div>
  )
}

export default InstagramAuth
