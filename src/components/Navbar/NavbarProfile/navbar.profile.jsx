import React from 'react'
import personne from '../../../assests/images/settings/Persone.svg'
import styles from './navbar.profile.module.css'

export default function NavbarProfile() {
  return (
    <div className={styles.profileContainer}>
      <img src={personne} alt="Personne" className={styles.profileImage} />
      <div className={styles.textContainer}>
        <div className={styles.welcomeText}>Welcome Back!</div>
        <div className={styles.userName}>John Doe</div>
      </div>
    </div>
  )
}
