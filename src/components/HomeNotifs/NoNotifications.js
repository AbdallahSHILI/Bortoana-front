import React from 'react'
import noNotificationsImage from '../../assests/images/notifications/noNotif.png' // Update the path to your image

export default function NoNotifications() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-gray-400">
      <img src={noNotificationsImage} alt="No Notifications" className="w-20 h-20 mb-2" />
      <p className="text-white">Horray</p>
      <p className="text-center">No notifications available</p>
    </div>
  )
}
