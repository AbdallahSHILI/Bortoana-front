import React from 'react'
import { FiBell, FiSettings } from 'react-icons/fi'
import styles from './navbar.icons.module.css'

export default function NavbarIcons({ onNotificationClick, showNotifications }) {
  return (
    <div className={styles.iconContainer}>
      <div
        onClick={onNotificationClick}
        className={`${styles.iconButton} ${styles.notificationButton}`}
      >
        <FiBell className={styles.icon} />
      </div>
      <div className={styles.iconButton}>
        <FiSettings className={styles.icon} />
      </div>
    </div>
  )
}
