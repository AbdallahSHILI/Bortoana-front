import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import axios from 'axios'
import Cookies from 'js-cookie'
import styles from './scheduleTwitter.module.css'

const ScheduleVideo = () => {
  const [scheduleTime, setScheduleTime] = useState(new Date())
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState(null)

  const handleSchedule = async () => {
    try {
      setIsLoading(true)
      setMessage(null)

      const oauth_token = Cookies.get('twitter_oauth_token')
      const oauth_token_secret = Cookies.get('twitter_oauth_token_secret')

      const response = await axios.post(
        'https://bortoaana.onrender.com/api/auth/twitter/Schedule-Video',
        {
          scheduleTime,
          oauth_token,
          oauth_token_secret,
          videoUrl:
            'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4'
        }
      )

      setMessage({ type: 'success', text: 'Video scheduled successfully!' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to schedule video. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Schedule Video Sharing</h3>
      <DatePicker
        selected={scheduleTime}
        onChange={(date) => setScheduleTime(date)}
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={15}
        dateFormat="MMMM d, yyyy h:mm aa"
        className={styles.datePicker}
      />
      <button onClick={handleSchedule} className={styles.scheduleButton} disabled={isLoading}>
        {isLoading ? 'Scheduling...' : 'Schedule Video'}
      </button>
      {message && (
        <div
          className={`${styles.message} ${
            message.type === 'success' ? styles.success : styles.error
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  )
}

export default ScheduleVideo
