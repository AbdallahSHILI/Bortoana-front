import React, { useState } from 'react'
import NavbarNotification from './NavbarNotification/navbar.notification'
import NavbarProfile from './NavbarProfile/navbar.profile'
import NavbarIcons from './NavbarIcons/navbar.icons'
import styles from './navbar.module.css'

export default function Navbar() {
  const [showNotifications, setShowNotifications] = useState(false)

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications)
  }

  return (
    <div className={styles.header}>
      <NavbarProfile />
      <NavbarIcons
        onNotificationClick={toggleNotifications}
        showNotifications={showNotifications}
      />
      {showNotifications && <NavbarNotification />}
    </div>
  )
}
