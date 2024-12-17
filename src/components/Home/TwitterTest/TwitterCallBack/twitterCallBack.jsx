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

    if (oauth_token && oauth_verifier) {
      axios
        .get(
          `http://localhost:5001/api/auth/twitter/Callback?oauth_token=${oauth_token}&oauth_verifier=${oauth_verifier}`
        )
        .then((response) => {
          // Store OAuth 1.0 tokens
          Cookies.set('twitter_oauth_token', response.data.data.oauth_token, { expires: 7 })
          Cookies.set('twitter_oauth_token_secret', response.data.data.oauth_token_secret, {
            expires: 7
          })

          // Use user info directly from the callback response
          const userData = response.data.data.user.data
          setUserInfo(userData)
          Cookies.set('twitter_user_info', JSON.stringify(userData), { expires: 7 })
          console.log('Cookies', Cookies.get('twitter_user_info'))
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

  return (
    <div className={styles.container}>
      <h2 className={styles.successTitle}>Authentication Successful! 👋</h2>
      <p className={styles.welcomeMessage}>Welcome, {userInfo.name || 'User'}!</p>
      <p className={styles.closeMessage}>You can now close this window.</p>
    </div>
  )
}

export default TwitterCallback
