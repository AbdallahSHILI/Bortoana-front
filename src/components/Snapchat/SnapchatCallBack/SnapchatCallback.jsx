import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import Cookies from 'js-cookie'
import styles from './snapchatCallBack.module.css'

const SnapchatCallback = () => {
  const [searchParams] = useSearchParams()
  const [error, setError] = useState(null)

  useEffect(() => {
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    console.log('code', code)
    console.log('state', state)

    if (code && state) {
      console.log('good untill now')
      axios
        .get(`http://localhost:5001/api/auth/snpachat/callback?code=${code}&state=${state}`, {
          withCredentials: true
        })
        .then((response) => {
          console.log('response', response)
          // Store access tokens securely in cookies
          Cookies.set('snapchatAccessToken', response.data.tokens.accessToken, { expires: 7 })
          Cookies.set('snapchatRefreshToken', response.data.tokens.refreshToken, { expires: 7 })
          console.log('Cookies', Cookies.get('snapchatAccessToken'))
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

  return (
    <div className={styles.container}>
      <h2 className={styles.successTitle}>Authentication Successful! 👋</h2>
      <p className={styles.welcomeMessage}>Welcome, User!</p>
      <p className={styles.closeMessage}>You can now close this window.</p>
    </div>
  )
}

export default SnapchatCallback
