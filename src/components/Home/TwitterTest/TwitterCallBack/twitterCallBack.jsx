import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import Cookies from 'js-cookie'
import styles from './twitterCallBack.module.css'

const TwitterCallback = () => {
  const [searchParams] = useSearchParams()
  const [userInfo, setUserInfo] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const oauth_token = searchParams.get('oauth_token')
    const oauth_verifier = searchParams.get('oauth_verifier')
    console.log('2auth', oauth_token, oauth_verifier)

    if (oauth_token && oauth_verifier) {
      axios
        .get(
          `http://localhost:5001/api/auth/twitter/Callback?oauth_token=${oauth_token}&oauth_verifier=${oauth_verifier}`
        )
        .then((response) => {
          console.log('token', response.data.data.oauth_token)
          console.log('token_secret', response.data.data.oauth_token_secret)
          // Store OAuth 1.0 tokens
          Cookies.set('twitter_oauth_token', response.data.data.oauth_token, { expires: 7 })
          Cookies.set('twitter_oauth_token_secret', response.data.data.oauth_token_secret, {
            expires: 7
          })
          
          // Extract user data from the nested structure
          const userData = response.data.data.user.data
          console.log("User Data:", userData)
          setUserInfo(userData)
        })
        .catch((error) => {
          console.error('Error:', error)
          const errorMessage =
            error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            'An unknown error occurred'
          setError(errorMessage)
        })
    } else {
      setError('OAuth parameters missing in callback')
    }
  }, [searchParams])

  // Add new useEffect for auto-closing
  useEffect(() => {
    if (userInfo) {
      const timer = setTimeout(() => {
        window.close()
      }, 3000)

      // Cleanup timeout if component unmounts
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
          <p>Processing Twitter login...</p>
        </div>
      </div>
    )
  }

  // Access specific properties from userInfo object
  const userName = userInfo.name || userInfo.username || 'User'

  return (
    <div className={styles.container}>
      <h2 className={styles.successTitle}>Authentication Successful! 👋</h2>
      <p className={styles.welcomeMessage}>Welcome, {userName}!</p>
      <p className={styles.closeMessage}>You will be redirected shortly...</p>
    </div>
  )
}

export default TwitterCallback