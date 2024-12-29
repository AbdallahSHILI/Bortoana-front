import React from 'react'
import Notif1 from '../../assests/images/notifications/image (1).png'
import Notif2 from '../../assests/images/notifications/image (2).png'
import Notif3 from '../../assests/images/notifications/image (3).png'
import NoNotifications from './NoNotifications'
export default function NotificationsPopup() {
  const notifications = [
    {
      id: 1,
      image: Notif1,
      name: 'Your video is ready!',
      description: 'your video has been generated!',
      time: '2m ago'
    },
    {
      id: 2,
      image: Notif2,
      name: 'Your video is ready!',
      description: 'your video has been generated!',
      time: '10m ago'
    },
    {
      id: 3,
      image: Notif3,
      name: 'Your video is ready!',
      description: 'your video has been generated!',
      time: '1h ago'
    }
  ]

  return (
    <div className="absolute top-28 right-32 bg-[#303030] rounded-xl shadow-lg p-4 w-[375px] h-[390px] z-10 border-slay-800 border-4 flex flex-col">
      <h4 className="font-bold text-white text-center mb-4 text-md">Notifications</h4>
      {notifications.length === 0 ? (
        <div className="flex-grow flex items-center justify-center ">
          <NoNotifications />
        </div>
      ) : (
        <ul className="space-y-3 ">
          {notifications.map((notification, index) => (
            <React.Fragment key={notification.id}>
              <li className="flex items-center text-gray-200 text-sm">
                <img
                  src={notification.image}
                  alt={notification.name}
                  className="w-6 h-6 rounded-full mr-2"
                />
                <div className="flex-1">
                  <p className="font-semibold">{notification.name}</p>
                  <p className="text-xs text-gray-400">{notification.description}</p>
                </div>
                <span className="text-xs text-gray-500">{notification.time}</span>
              </li>
              {/* Add a horizontal line except for the last notification */}
              {index < notifications.length - 1 && <hr className="border-gray-600" />}
            </React.Fragment>
          ))}
        </ul>
      )}
    </div>
  )
}
