import React from 'react'
import { useNotifications } from '../../context/NotificationContext'
import Notif1 from '../../assests/images/notifications/image (1).png'
import NoNotifications from './NoNotifications'

export default function NotificationsPopup() {
  const { notifications } = useNotifications()

  return (
    <div className="absolute top-28 right-32 bg-[#303030] rounded-xl shadow-lg p-4 w-[375px] h-[390px] z-10 border-slay-800 border-4 flex flex-col">
      <h4 className="font-bold text-white text-center mb-4 text-md">Notifications</h4>
      {notifications.length === 0 ? (
        <div className="flex-grow flex items-center justify-center">
          <NoNotifications />
        </div>
      ) : (
        <ul className="space-y-3">
          {notifications.map((notification, index) => (
            <React.Fragment key={notification.id}>
              <li className="flex items-center text-gray-200 text-sm">
                <img
                  src={notification.image || Notif1}
                  alt={notification.name}
                  className="w-6 h-6 rounded-full mr-2"
                />
                <div className="flex-1">
                  <p className="font-semibold">{notification.name}</p>
                  <p className="text-xs text-gray-400">{notification.description}</p>
                </div>
                <span className="text-xs text-gray-500">{notification.time}</span>
              </li>
              {index < notifications.length - 1 && <hr className="border-gray-600" />}
            </React.Fragment>
          ))}
        </ul>
      )}
    </div>
  )
}
