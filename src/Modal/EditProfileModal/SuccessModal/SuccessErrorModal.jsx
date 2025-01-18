import React from 'react'
import styles from './SuccessErrorModal.module.css'
import Celebrate from '../../../assests/images/settings/Celebrating.svg'
import Oops from '../../../assests/images/settings/oupsIcon.svg'

const SuccessErrorModal = ({ isVisible, onClose, isError = false, errorMessage }) => {
  if (!isVisible) return null

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <img
          src={isError ? Oops : Celebrate}
          alt={isError ? 'Error' : 'Celebration'}
          className={`${styles.modalIcon} ${isError ? styles.errorIcon : styles.successIcon}`}
        />
        <h2 className={styles.title}>{isError ? 'Oops!' : 'Perfect!'}</h2>
        <p className={styles.message}>
          {isError
            ? errorMessage || 'An error occurred'
            : 'Your profile has been successfully updated!'}
        </p>
        <button className={styles.profileButton} onClick={onClose}>
          {isError ? 'Try Again' : 'Take me to my profile'}
        </button>
      </div>
    </div>
  )
}

export default SuccessErrorModal
