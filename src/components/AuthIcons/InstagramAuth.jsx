import { useEffect, useState } from 'react'
import InstagramIcon from '../../assests/images/icons/instagram.png'
import PostButton from '../PostPublishButton'
import PostStoryButton from '../PostPublishStory'

const InstagramAuth = () => {
  const [token, setToken] = useState(null)

  useEffect(() => {
    // Check if the token is present in the query parameters after Instagram redirects
    const urlParams = new URLSearchParams(window.location.search)
    const instagramToken = urlParams.get('access_token') // Get the token from the URL query

    if (instagramToken) {
      // Save the token in the cookies and state
      document.cookie = `instagram_token=${instagramToken}; path=/; max-age=${7 * 24 * 60 * 60}` // expires in 7 days
      setToken(instagramToken)
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
  }, [])

  const handleInstagramLogin = async (e) => {
    e.preventDefault()
    // Open Instagram authentication
    window.location.href =
      'https://www.instagram.com/oauth/authorize?enable_fb_login=0&force_authentication=1&client_id=921275860068455&redirect_uri=https://98a5-102-30-101-130.ngrok-free.app/api/instagram/callback&response_type=code&scope=instagram_business_basic%2Cinstagram_business_manage_messages%2Cinstagram_business_manage_comments%2Cinstagram_business_content_publish'
  }

  const handleLogout = () => {
    setToken(null)

    // Clear the token from cookies
    document.cookie = 'instagram_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC'

    // Optionally redirect to a specific page after logout
    window.location.href = 'http://localhost:3000/newbortoaana/home'
  }

  return (
    <div className="absolute">
      <img
        src={InstagramIcon}
        alt="Instagram Login"
        onClick={handleInstagramLogin}
        className="cursor-pointer hover:opacity-50"
      />
      <PostButton />
      <PostStoryButton />

      {token && (
        <div>
          <button className="text-white" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </div>
  )
}

export default InstagramAuth
