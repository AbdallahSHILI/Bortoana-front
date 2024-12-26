import React from 'react'
import axios from 'axios'
import styles from './snapchatLogin.module.css'
import { Link } from 'react-router-dom'

const SnapchatLogin = () => {
  const handleSnapchatLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5001/api/auth/snapchat/login')

      console.log('response', response.data)
      const data = response.data

      if (data.authUrl) {
        const width = 600
        const height = 600
        const left = window.screen.width / 2 - width / 2
        const top = window.screen.height / 2 - height / 2

        const popup = window.open(
          data.authUrl,
          'Snapchat Login',
          `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,location=no,status=no`
        )

        const checkPopup = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkPopup)
            // Handle popup close event here if needed
          }
        }, 1000)
      } else {
        console.error('Snapchat authentication URL not received')
      }
    } catch (error) {
      console.error('Error initiating Snapchat login:', error.response?.data || error.message)
    }
  }

  return (
    <div className={styles.container}>
      <button className={styles.SnapchatButton} onClick={handleSnapchatLogin}>
        <i className={styles.SnapchatIcon}>🐦</i>
        Login with Snapchat
      </button>
      <Link to="/snapchat-share">
        <button className={styles.SnapchatButton}>
          <i className={styles.SnapchatIcon}>Share</i>
        </button>
      </Link>
    </div>
  )
}

export default SnapchatLogin
