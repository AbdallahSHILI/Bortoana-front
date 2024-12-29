import React from 'react'
import axios from 'axios'
import styles from './twitterTest.module.css'
import { Link } from 'react-router-dom'

const TwitterTest = () => {
  const handleTwitterLogin = async () => {
    try {
      // Changed to GET request for OAuth 1.0 request token
      const response = await axios.post('https://bortoaana.onrender.com/api/auth/twitter/Login')
      const data = response.data

      if (data.url) {
        const width = 600
        const height = 600
        const left = window.screen.width / 2 - width / 2
        const top = window.screen.height / 2 - height / 2

        const popup = window.open(
          data.url,
          'Twitter Login',
          `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,location=no,status=no`
        )

        const checkPopup = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkPopup)
            // Handle popup close event here if needed
          }
        }, 1000)
      } else {
        console.error('Twitter authentication URL not received')
      }
    } catch (error) {
      console.error('Error initiating Twitter login:', error.response?.data || error.message)
    }
  }

  return (
    <div className={styles.container}>
      <button className={styles.twitterButton} onClick={handleTwitterLogin}>
        <i className={styles.twitterIcon}>🐦</i>
        Login with Twitter
      </button>
      <Link to="/twitter-share">
        <button className={styles.twitterButton}>
          <i className={styles.twitterIcon}>Share</i>
        </button>
      </Link>
    </div>
  )
}

export default TwitterTest
