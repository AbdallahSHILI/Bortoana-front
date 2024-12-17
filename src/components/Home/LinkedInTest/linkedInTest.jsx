import React from 'react'
import axios from 'axios'
import styles from './linkedInTest.module.css'

const LinkedInTest = () => {
  const handleLogin = () => {
    // Redirect to the backend LinkedIn login endpoint
    window.location.href = 'http://localhost:3000/newbortoaana/api/linkedin/Login'
  }

  return (
    <div className={styles.container}>
      <button className={styles.linkedInButton} onClick={handleLogin}>
        <i className={styles.linkedInIcon}>💼</i>
        Login with LinkedIn
      </button>
    </div>
  )
}

export default LinkedInTest
