import React from 'react'
import axios from 'axios'
import styles from './linkedInTest.module.css'
import Cookies from 'js-cookie'
import { Link } from 'react-router-dom'

const LinkedInTest = () => {
  const handleLogin = async () => {
    try {
      // Request LinkedIn authorization URL from backend
      const response = await axios.post('http://localhost:5001/api/auth/linkedIn/Login')
      console.log('response', response.data)
      const { authorizationUrl, state } = response.data
      // Optionally, save the state to session storage for CSRF protection
      sessionStorage.setItem('linkedinState', state)
      Cookies.set('linkedinState', state, { expires: 7 })
      console.log('sessionStorage', sessionStorage)

      // Redirect to LinkedIn's login page
      window.location.href = authorizationUrl
    } catch (error) {
      console.error('Error initiating LinkedIn login:', error)
      alert('Failed to initiate LinkedIn login.')
    }
  }

  return (
    <div className={styles.container}>
      <button className={styles.linkedInButton} onClick={handleLogin}>
        <i className={styles.linkedInIcon}>💼</i>
        Login with LinkedIn
      </button>
      <Link to="/linkedin-share">
        <button className={styles.linkedInButton}>
          <i className={styles.linkedInIcon}>Share</i>
        </button>
      </Link>
    </div>
  )
}

export default LinkedInTest
