import React, { useEffect } from 'react'
import axios from 'axios'
import styles from './pinterestlogin.module.css'
import { Link } from 'react-router-dom'

const PinterestLogin = () => {
  // Handle popup window communication
  useEffect(() => {
    const handleMessage = (event) => {
      // Verify origin for security
      if (event.origin !== window.location.origin) return

      if (event.data.type === 'PINTEREST_AUTH_SUCCESS') {
        // Handle successful authentication
        console.log('Pinterest auth success:', event.data.accessToken)
        // Store the token in your preferred way (localStorage, context, etc.)
        localStorage.setItem('pinterestAccessToken', event.data.accessToken)
        // Close popup if it exists
        if (window.pinterestPopup) {
          window.pinterestPopup.close()
        }
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  const handlePinterestLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5001/api/auth/pinterest/Login')
      const { pinterestAuthUrl } = response.data

      if (pinterestAuthUrl) {
        const width = 600
        const height = 600
        const left = window.screen.width / 2 - width / 2
        const top = window.screen.height / 2 - height / 2

        // Store popup reference globally
        window.pinterestPopup = window.open(
          pinterestAuthUrl,
          'Pinterest Login',
          `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,location=no,status=no`
        )

        // Monitor popup closure
        const checkPopup = setInterval(() => {
          if (window.pinterestPopup?.closed) {
            clearInterval(checkPopup)
            // Handle popup closure if needed
          }
        }, 500)
      }
    } catch (error) {
      console.error('Pinterest login error:', error)
      // Handle error appropriately
    }
  }

  return (
    <div className={styles.container}>
      <button className={styles.pinterestButton} onClick={handlePinterestLogin}>
        <i className={styles.pinterestIcon}>🐦</i>
        Login with Pinterest
      </button>
      <Link to="/pinterest-share">
        <button className={styles.pinterestButton}>
          <i className={styles.pinterestIcon}>Share</i>
        </button>
      </Link>
    </div>
  )
}

export default PinterestLogin
