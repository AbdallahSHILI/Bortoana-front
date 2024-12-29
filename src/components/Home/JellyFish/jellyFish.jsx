import React, { useState, useRef, useEffect } from 'react'
import Form from '../../Inputs/Form'
import JellyFishImage from '../../../assests/images/c.png'
import SettingsIcon from '../../../assests/images/settings/setting.png'
import SettingsBoldIcon from '../../../assests/images/settings/settingbold.png'
import XIcon from '../../../assests/images/settings/X_Icon.svg'
import LinkedInIcon from '../../../assests/images/settings/LinkedIn_Icon.svg'
import ShareIcon from '../../../assests/images/settings/X_Icon.svg'
import styles from './jellyFish.module.css'
import TwitterShareModal from './TwitterShareExample/twitterShareModal'
import { Link } from 'react-router-dom'

const X_CLIENT_ID = process.env.REACT_APP_X_CLIENT_ID || 'YOUR_X_CLIENT_ID'
const X_REDIRECT_URI = `${window.location.origin}/x/callback`
const X_AUTH_URL = `https://twitter.com/i/oauth2/authorize?client_id=${X_CLIENT_ID}&redirect_uri=${X_REDIRECT_URI}&response_type=code&scope=tweet.read%20users.read%20offline.access&state=state&code_challenge_method=s256&code_challenge=challenge`

const JellyFish = ({ isZoomed, setIsZoomed, isSettingsZoomed, setIsSettingsZoomed }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [showVideoModal, setShowVideoModal] = useState(false)
  const fileInputRef = useRef(null)
  const [xAccessToken, setXAccessToken] = useState(null)

  useEffect(() => {
    // Listen for X authentication success message
    const handleAuthMessage = (event) => {
      if (event.origin === window.location.origin && event.data.type === 'X_AUTH_SUCCESS') {
        setXAccessToken(event.data.accessToken)
      }
    }

    window.addEventListener('message', handleAuthMessage)
    return () => window.removeEventListener('message', handleAuthMessage)
  }, [])

  const handleSettingsClick = (e) => {
    e.stopPropagation()
    setIsSettingsZoomed(!isSettingsZoomed)
  }

  const handleShareClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setShowShareModal(true)
  }

  const handleVideoButtonClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setShowVideoModal(true)
  }

  return (
    <div
      className={`${styles.container} ${isZoomed || isSettingsZoomed ? styles.zoomedContainer : ''}`}
      style={{ transformOrigin: 'center center' }}
    >
      {/* Rectangle for zoom effect, only show if isSettingsZoomed is false */}
      {!isSettingsZoomed && (
        <div
          onClick={() => setIsZoomed(!isZoomed)}
          className={`${styles.rectangle} ${isZoomed ? styles.rectangleZoomed : styles.rectangleNormal}`}
        >
          {isZoomed && <Form onClose={() => setIsZoomed(false)} />}
        </div>
      )}

      {/* Settings Icon, only show if isZoomed is false */}
      {!isZoomed && (
        <div
          style={{ zIndex: isSettingsZoomed ? 20 : 50 }}
          className={`${styles.settingsIcon} ${isSettingsZoomed ? styles.settingsIconZoomed : ''}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <img
            src={isHovered ? SettingsBoldIcon : SettingsIcon}
            alt="Settings"
            className={styles.settingsImage}
            onClick={handleSettingsClick}
          />
        </div>
      )}

      {/* Jellyfish image with zoom and translate effect */}
      <div
        className={`${styles.jellyFishContainer} ${
          isZoomed || isSettingsZoomed
            ? isSettingsZoomed
              ? styles.jellyFishSettingsZoomed
              : styles.jellyFishZoomed
            : styles.jellyFishNormal
        }`}
      >
        <img src={JellyFishImage} alt="Jellyfish" className={styles.JellyFish} />
        <button
          className={styles.jellyFishButton}
          onClick={() => setIsZoomed(true)}
          aria-label="Jellyfish head"
        />
        <div className={styles.xContainer}>
          <Link to="/twitter-test">
            <img src={XIcon} alt="X" className={styles.xIcon} />
          </Link>
          <Link to="/linkedIn-test">
            <img src={LinkedInIcon} alt="LinkedIn" className={styles.xIcon} />
          </Link>
        </div>

        <div className={styles.shareContainer}>
          <img
            src={ShareIcon}
            alt="Share"
            className={styles.shareIcon}
            onClick={handleShareClick}
          />
        </div>

        <button
          className={styles.videoUploadButton}
          onClick={handleVideoButtonClick}
          aria-label="Upload video"
        >
          Upload Video
        </button>

        <TwitterShareModal
          isOpen={showVideoModal}
          onClose={() => setShowVideoModal(false)}
          xAccessToken={xAccessToken}
        />
      </div>
    </div>
  )
}

export default JellyFish
