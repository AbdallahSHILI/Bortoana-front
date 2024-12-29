import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const SnapchatCallback = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // Get the authorization code from URL parameters
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')

    if (code) {
      // Handle the authorization code here
      // You would typically send this to your backend to exchange for access token
      console.log('Snapchat authorization code:', code)

      // Close the popup window and navigate back
      if (window.opener) {
        window.opener.postMessage({ type: 'SNAPCHAT_AUTH_SUCCESS', code }, window.location.origin)
        window.close()
      } else {
        navigate('/')
      }
    }
  }, [navigate])

  return <div>Processing Snapchat authentication...</div>
}

export default SnapchatCallback
