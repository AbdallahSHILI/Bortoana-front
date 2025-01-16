import React from 'react';
import styles from './logoutModal.module.css';

const LogoutModal = ({ onLogout, onCancel }) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Are you sure you want to logout?</h2>
        <div className={styles.buttonContainer}>
          <button className={styles.logoutButton} onClick={onLogout}>Logout</button>
          <button className={styles.cancelButton} onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;