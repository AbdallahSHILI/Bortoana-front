import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import styles from './pinterestCallBack.module.css'

const PinterestCallback = () => {
  const [searchParams] = useSearchParams()
  const [userInfo, setUserInfo] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code')
      console.log('code', code)

      if (!code) {
        setError('No authorization code received')
        return
      }

      try {
        // Call your backend callback endpoint
        const response = await axios.get(
          `http://localhost:5001/api/auth/pinterest/Callback?code=${code}`
        )

        console.log('response', response.data)

        // Send message to opener window
        if (window.opener) {
          window.opener.postMessage(
            {
              type: 'PINTEREST_AUTH_SUCCESS',
              accessToken: response.data.accessToken
            },
            window.location.origin
          )
        }

        // Get user info if needed
        try {
          const userResponse = await axios.get('https://api.pinterest.com/v5/user_account', {
            headers: {
              Authorization: `Bearer ${response.data.accessToken}`
            }
          })
          setUserInfo(userResponse.data)
        } catch (userError) {
          console.error('Error fetching user info:', userError)
          setUserInfo({ name: 'User' }) // Fallback
        }

        // Close window after short delay
        setTimeout(() => {
          window.close()
        }, 2000)
      } catch (error) {
        console.error('Callback error:', error)
        setError('Authentication failed. Please try again.')
      }
    }

    handleCallback()
  }, [searchParams])

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <h2 className={styles.errorTitle}>Authentication Error</h2>
          <p className={styles.errorMessage}>{error}</p>
        </div>
      </div>
    )
  }

  if (!userInfo) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner} />
          <p>Processing Pinterest login...</p>
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

export default PinterestCallback
