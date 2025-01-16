import React from 'react'
import styles from './bortoanaVideo.module.css'

const BortanaVideo = ({ isOpen, onClose, videoUrl }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          ✕
        </button>
        <div className={styles.videoContainer}>
          <video 
          crossOrigin="anonymous"
          controls 
          autoPlay
            className={styles.video}
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  )
}

export default BortanaVideo