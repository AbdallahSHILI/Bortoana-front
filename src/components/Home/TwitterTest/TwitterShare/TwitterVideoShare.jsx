import React, { useState } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import styles from './TwitterVideoShare.module.css'

const TwitterVideoShare = () => {
  const [videoFile, setVideoFile] = useState(null)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')

  const handleFileChange = (e) => {
    setVideoFile(e.target.files[0])
  }

  const handleShareVideo = async () => {
    if (!videoFile) {
      setError('Please select a video file.')
      return
    }

    setStatus('Uploading...')
    setError('')

    const formData = new FormData()
    formData.append('video', videoFile)
    formData.append('oauth_token', Cookies.get('twitter_oauth_token'))
    formData.append('oauth_token_secret', Cookies.get('twitter_oauth_token_secret'))
    console.log(
      'Cookies:',
      Cookies.get('twitter_oauth_token'),
      Cookies.get('twitter_oauth_token_secret')
    )

    try {
      const response = await axios.post(
        'http://localhost:5001/api/auth/twitter/share-video',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      )
      console.log('Response:', response)
      setStatus('Video shared successfully!')
      console.log('Response:', response.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to share video')
      console.error('Error:', err)
    }
  }

  return (
    <div className={styles.container}>
      <h2>Share a Video on Twitter</h2>
      <input type="file" accept="video/*" onChange={handleFileChange} />
      <button className={styles.shareButton} onClick={handleShareVideo}>
        Share Video
      </button>
      {status && <p className={styles.success}>{status}</p>}
      {error && <p className={styles.error}>{error}</p>}
    </div>
  )
}

export default TwitterVideoShare
