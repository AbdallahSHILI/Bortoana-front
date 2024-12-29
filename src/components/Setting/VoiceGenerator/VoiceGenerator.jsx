import React from 'react'
import { motion } from 'framer-motion'
import microphone from '../../../assests/images/settings/microphone2.png'
import Cross from '../../../assests/images/cross.png'
import { FaPlay } from 'react-icons/fa'
import styles from './VoiceGenerator.module.css'
import { voiceData } from './voiceData'

const VoiceGenerator = ({ onClose }) => {
  return (
    <div className={styles.container}>
      <motion.div
        className={styles.overlay}
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      ></motion.div>

      <motion.div
        className={styles.modal}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3, type: 'spring', stiffness: 300 }}
      >
        <button onClick={onClose} className={styles.closeButton} aria-label="Close modal">
          <img src={Cross} alt="Close button" className={styles.closeIcon} />
        </button>

        <h2 className={styles.title}>Voices Generator</h2>

        <div className={styles.audioSidebar}>
          <div className={styles.audioIconContainer}>
            <div className={styles.audioIconWrapper}>
              <img src={microphone} className={styles.audioIcon} alt="Microphone" />
            </div>
            <div className={styles.audioText}>Audio</div>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.cardsGrid}>
            {voiceData.map((card) => (
              <div key={card.id} className={styles.card}>
                <img src={card.photo} alt={card.name} className={styles.cardImage} />
                <h3 className={styles.cardTitle}>{card.name}</h3>
                <button className={styles.playButton}>
                  <div className={styles.playButtonInner}>
                    <FaPlay className={styles.playIcon} />
                  </div>
                </button>
                <button className={styles.selectButton}>Select</button>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default VoiceGenerator
