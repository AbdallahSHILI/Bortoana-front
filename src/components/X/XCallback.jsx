import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const XCallback = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // get code and state from the URL query parameters
    const urlParams = new URLSearchParams(window.location.search)
    console.log('urlParams', urlParams)
    //code
    const code = urlParams.get('code')
    console.log('code', code)
    //state
    const state = urlParams.get('state')
    console.log('state', state)

    if (code && state) {
      // if code and state are good then send them to backend
      fetch('/api/auth/x/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code })
      })
        .then((response) => response.json())
        .then((data) => {
          // Handle successful authentication
          if (window.opener) {
            // If opened in a popup, send message back to opener
            window.opener.postMessage(
              {
                type: 'X_AUTH_SUCCESS',
                accessToken: data.access_token
              },
              window.location.origin
            )
            window.close()
          } else {
            navigate('/')
          }
        })
        .catch((error) => {
          console.error('Error:  ', error)
          navigate('/')
        })
    }
  }, [navigate])

  return <div>Processing X authentication...</div>
}

export default XCallback
