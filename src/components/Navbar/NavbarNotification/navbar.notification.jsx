import React from 'react'
import noNotificationsImage from '../../../assests/images/notifications/noNotif.png'
import { notifications } from './navbar.notif.data'
import styles from '../navbar.module.css'

export default function NavbarNotification() {
  return (
    <div className={styles.notificationPopup}>
      <h4 className={styles.notificationTitle}>Notifications</h4>

      {notifications.length === 0 ? (
        <div className={styles.emptyContainer}>
          <img src={noNotificationsImage} alt="No Notifications" className={styles.emptyImage} />
          <p className={styles.emptyTitle}>Horray</p>
          <p className={styles.emptyText}>No notifications available</p>
        </div>
      ) : (
        <ul className={styles.notificationList}>
          {notifications.map((notification, index) => (
            <React.Fragment key={notification.id}>
              <li className={styles.notificationItem}>
                <img
                  src={notification.image}
                  alt={notification.name}
                  className={styles.notificationImage}
                />
                <div className={styles.notificationContent}>
                  <p className={styles.notificationName}>{notification.name}</p>
                  <p className={styles.notificationDescription}>{notification.description}</p>
                </div>
                <span className={styles.notificationTime}>{notification.time}</span>
              </li>
              {index < notifications.length - 1 && <hr className={styles.divider} />}
            </React.Fragment>
          ))}
        </ul>
      )}
    </div>
  )
}
