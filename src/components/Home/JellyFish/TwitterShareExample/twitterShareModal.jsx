import React, { useRef, useState } from 'react'
import styles from './twitterShareModal.module.css'

const TwitterShareModal = ({ isOpen, onClose, xAccessToken }) => {
  const fileInputRef = useRef(null)
  const [selectedVideo, setSelectedVideo] = useState(null)

  if (!isOpen) return null

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file) {
      // Create a local URL for the selected video
      const videoUrl = URL.createObjectURL(file)
      setSelectedVideo(videoUrl)
    }
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>

        <div className={styles.modalHeader}>
          <h2>Share Video</h2>
        </div>

        <div className={styles.uploadControls}>
          <input
            type="file"
            ref={fileInputRef}
            accept="video/*"
            style={{ display: 'none' }}
            onChange={handleFileSelect}
          />
          <button className={styles.navigateButton} onClick={() => fileInputRef.current.click()}>
            Choose Video
          </button>

          {/* {selectedVideo && (
            <XShare
              videoUrl={selectedVideo}
              customButton={styles.postButton}
              onShareComplete={onClose}
              initialAccessToken={xAccessToken}
            />
          )} */}
        </div>
      </div>
    </div>
  )
}

export default TwitterShareModal
