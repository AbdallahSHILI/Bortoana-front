import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import styles from './linkedInCallBack.module.css'

const LinkedInCallback = () => {
  const [userInfo, setUserInfo] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Add popup-active class when component mounts
    document.body.classList.add('popup-active')

    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search)

      const error = params.get('error')
      if (error) {
        console.error('LinkedIn Auth Error:', error)
        setError('LinkedIn Authentication Failed: ' + error)
        return
      }

      const code = params.get('code')
      const state = params.get('state')
      const storedState = sessionStorage.getItem('linkedinState')

      if (!code || !state) {
        setError('Authentication failed. Missing code or state.')
        return
      }

      try {
        const baseUrl =
          process.env.NODE_ENV === 'production'
            ? 'https://bortoaana.onrender.com'
            : 'http://localhost:5001'

        const response = await axios.get(
          `${baseUrl}/api/auth/linkedin/Callback?code=${code}&state=${state}`,
          { withCredentials: true }
        )

        Cookies.set('linkedin_oauth_access_token', response.data.accessToken, {
          expires: 7,
          secure: true,
          sameSite: 'None',
          path: '/'
        })

        const userData = response.data.user
        setUserInfo(userData)

        Cookies.set('linkedin_user_info', JSON.stringify(userData), { expires: 7 })

        // Notify opener window of success
        if (window.opener) {
          window.opener.postMessage('LINKEDIN_LOGIN_SUCCESS', '*')
        }
      } catch (error) {
        console.error('Error during LinkedIn callback:', error)
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          'Authentication failed. Please try again.'
        setError(errorMessage)
      }
    }

    handleCallback()

    // Cleanup function to remove popup-active class
    return () => {
      document.body.classList.remove('popup-active')
    }
  }, [])

  useEffect(() => {
    if (userInfo) {
      const timer = setTimeout(() => {
        window.close()
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [userInfo])

  if (error) {
    return <div className={styles.errorContainer}>Error: {error}</div>
  }

  if (!userInfo) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner} />
          <p>Authenticating with LinkedIn...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.successTitle}>Authentication Successful! 🎉</h2>
      <p className={styles.welcomeMessage}>Welcome, {userInfo.firstName || 'User'}!</p>
      <p className={styles.closeMessage}>You will be redirected shortly...</p>
    </div>
  )
}

export default LinkedInCallback
