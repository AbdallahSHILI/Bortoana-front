import React, { useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import axios from 'axios'
import Cookies from 'js-cookie'
import styles from './scheduleTwitter.module.css'

const ScheduleVideo = ({ videoId }) => {
  const [scheduleTime, setScheduleTime] = useState(new Date())

  const handleSchedule = async () => {
    try {
      // Get tokens from cookies
      const oauth_token = Cookies.get('twitter_oauth_token')
      const oauth_token_secret = Cookies.get('twitter_oauth_token_secret')

      const response = await axios.post('/api/videos/schedule', {
        videoId,
        scheduleTime,
        oauth_token,
        oauth_token_secret,
        videoUrl:
          'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4'
      })
      alert('Video scheduled successfully!')
    } catch (error) {
      console.error('Error scheduling video', error)
      alert('Failed to schedule video.')
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
      <button onClick={handleSchedule} className={styles.scheduleButton}>
        Schedule Video
      </button>
    </div>
  )
}

export default ScheduleVideo
