import { useEffect, useState } from 'react'
import InstagramIcon from '../../assests/images/icons/instagram.png'
import PostButton from '../PostPublishButton'
import PostStoryButton from '../PostPublishStory'
import { XMarkIcon } from '@heroicons/react/24/solid'
import { Tooltip } from '@mui/material'
const InstagramAuth = () => {
  const [token, setToken] = useState(null)
  const [instagramLoginWindow, setInstagramLoginWindow] = useState(null)

  const handleInstagramLogin = (e) => {
    e.preventDefault()

    const windowFeatures = 'width=600,height=800,left=200,top=200'
    const newWindow = window.open(
      'https://www.instagram.com/oauth/authorize?enable_fb_login=0&force_authentication=1&client_id=921275860068455&redirect_uri=https://bortoaana.onrender.com/api/instagram/callback&response_type=code&scope=instagram_business_basic%2Cinstagram_business_manage_messages%2Cinstagram_business_manage_comments%2Cinstagram_business_content_publish',
      'InstagramLogin',
      windowFeatures
    )

    setInstagramLoginWindow(newWindow)
  }
  useEffect(() => {
    // Check if the token is present in the query parameters after Instagram redirects
    const urlParams = new URLSearchParams(window.location.search)
    const instagramToken = urlParams.get('access_token') // Get the token from the URL query

    if (instagramToken) {
      // Save the token in the cookies and state
      document.cookie = `instagram_token=${instagramToken}; path=/; max-age=${7 * 24 * 60 * 60}` // expires in 7 days
      setToken(instagramToken)

      // Close the Instagram login window after token is found
      if (instagramLoginWindow) {
        instagramLoginWindow.close()
      }
    } else {
      // Check the cookies for token if the user already logged in
      const getCookie = (name) => {
        const value = `; ${document.cookie}`
        const parts = value.split(`; ${name}=`)
        if (parts.length === 2) return parts.pop().split(';').shift()
      }

      const savedToken = getCookie('instagram_token')
      if (savedToken) {
        setToken(savedToken)
      }
    }
  }, [instagramLoginWindow])

  const handleLogout = () => {
    setToken(null)

    // Clear the token from cookies
    document.cookie = 'instagram_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC'

    // Optionally redirect to a specific page after logout
    window.location.href = 'https://bortoaana.vercel.app/newbortoaana/home'
  }

  return (
    <div className="absolute  top-[42%] 2xl:top-[46%] left-[44%] z-[500]">
      {!token ? (
        <Tooltip placement="top" title="Instagram">
          <img
            src={InstagramIcon}
            alt="Instagram Login"
            onClick={handleInstagramLogin}
            className="cursor-pointer h-10 w-10 hover:opacity-50"
          />
        </Tooltip>
      ) : (
        <Tooltip title="Logout" placement="top">
          <XMarkIcon
            onClick={handleLogout}
            className="text-white border-[6px] p-1 cursor-pointer bg-slate-400 bg-opacity-40 hover:opacity-50 border-sky-300 rounded-full h-10 w-10"
          />
        </Tooltip>
      )}
      {token && (
        <div className="flex flex-col gap-5">
          <PostButton />
          <PostStoryButton />
        </div>
      )}
    </div>
  )
}

export default InstagramAuth
