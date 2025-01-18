import React, { createContext, useContext, useState } from 'react'

const NotificationContext = createContext()

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([])

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      image: notification.image || '/default-notification-image.png',
      name: notification.name || 'Your video is ready!',
      description: notification.description || 'Your video has been generated!',
      time: '1m ago'
    }

    setNotifications((prev) => [newNotification, ...prev])
  }

  const clearNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id))
  }

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, clearNotification }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  return useContext(NotificationContext)
}
