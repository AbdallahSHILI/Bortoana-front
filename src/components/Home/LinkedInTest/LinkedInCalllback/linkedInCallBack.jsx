import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Cookies from 'js-cookie'
import styles from './linkedInCallBack.module.css'

const LinkedInCallback = () => {
  const navigate = useNavigate()
  const [userInfo, setUserInfo] = useState(null) // To store user info
  const [error, setError] = useState(null) // To store errors

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search)

      // Log the full URL for debugging
      console.log('Full URL:', window.location.href)

      const error = params.get('error')
      if (error) {
        console.error('LinkedIn Auth Error:', error)
        console.error('Error Description:', params.get('error_description'))
        alert('LinkedIn Authentication Failed: ' + error)
        navigate('/login')
        return
      }

      const code = params.get('code')
      const state = params.get('state')
      console.log('state', state)

      const storedState = sessionStorage.getItem('linkedinState')

      // Validation
      if (!code || !state) {
        setError('Authentication failed. Missing code or state.')
        return
      }

      if (state !== storedState) {
        setError('Invalid state parameter. Authentication failed.')
        return
      }

      try {
        // Make request to your backend LinkedIn callback endpoint
        const response = await axios.get(
          `http://localhost:5001/api/auth/linkedin/Callback?code=${code}&state=${state}`,
          { withCredentials: true }
        )
        console.log('response', response)
        console.log('LinkedIn Authentication successful:', response.data)

        Cookies.set('linkedin_oauth_access_token', response.data.accessToken, {
          expires: 7
        })

        // Save user info (assuming backend returns user data)
        const userData = response.data.user
        console.log('userData', userData)

        setUserInfo(userData) // Update state

        // Watch for state updates
        console.log('Setting user info...')

        // Store user info in cookies for persistence
        Cookies.set('linkedin_user_info', JSON.stringify(userData), { expires: 7 })
        // Optionally navigate after a few seconds
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
  }, [navigate])

  // Log updated userInfo after state update
  useEffect(() => {
    if (userInfo) {
      console.log('Updated userInfo:', userInfo)
    }
  }, [userInfo])

  if (error) {
    return <div className={styles.errorContainer}>Error: {error}</div>
  }

  if (!userInfo) {
    // Display loading state
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner} />
          <p>Authenticating with LinkedIn...</p>
        </div>
      </div>
    )
  }

  // Display success message
  return (
    <div className={styles.container}>
      <h2 className={styles.successTitle}>Authentication Successful! 🎉</h2>
      <p className={styles.welcomeMessage}>Welcome, {userInfo.firstName || 'User'}!</p>
      <p className={styles.closeMessage}>You will be redirected shortly...</p>
    </div>
  )
}

export default LinkedInCallback
