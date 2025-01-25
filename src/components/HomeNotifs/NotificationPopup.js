import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import NoNotifications from './NoNotifications'
import Cookies from 'js-cookie'
import SchedulingIcon from '../../assests/images/settings/SchedulingSuccessfully.svg'
import SharedSuccessfullyIcon from '../../assests/images/settings/SharedSuccessfully.svg'
import ErrorNotificationIcon from '../../assests/images/settings/ErrorNotificationIcon.svg'

function getTimeDifference(createdAt) {
  const now = new Date()
  const createdDate = new Date(createdAt)
  const diffInSeconds = Math.floor((now - createdDate) / 1000)

  const minute = 60
  const hour = minute * 60
  const day = hour * 24
  const week = day * 7
  const month = day * 30
  const year = day * 365

  if (diffInSeconds < minute) return `${diffInSeconds}s`
  if (diffInSeconds < hour) return `${Math.floor(diffInSeconds / minute)}m`
  if (diffInSeconds < day) return `${Math.floor(diffInSeconds / hour)}h`
  if (diffInSeconds < week) return `${Math.floor(diffInSeconds / day)}d`
  if (diffInSeconds < month) return `${Math.floor(diffInSeconds / week)}w`
  if (diffInSeconds < year) return `${Math.floor(diffInSeconds / month)}mo`
  return `${Math.floor(diffInSeconds / year)}y`
}

export default function NotificationsPopup({ onClose }) {
  const [notifications, setNotifications] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const popupRef = useRef(null)

  useEffect(() => {
    const userId = Cookies.get('userId')
    console.log('userId', userId)

    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/notification/AllNotifications/${userId}`
        )

        if (!response.data.Noftifcations || response.data.Noftifcations.length === 0) {
          setNotifications([])
        } else {
          setNotifications(response.data.Noftifcations)
        }
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching notifications:', error)
        setError(error)
        setIsLoading(false)
      }
    }

    if (userId) {
      fetchNotifications()
    }

    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [onClose])

  // If loading, show loading state
  if (isLoading) {
    return (
      <div className="absolute top-28 right-32 bg-[#303030] rounded-xl shadow-lg p-4 w-[375px] h-[390px] z-10 border-slay-800 border-4 flex items-center justify-center">
        <p className="text-white">Loading notifications...</p>
      </div>
    )
  }

  // If error or no notifications, show NoNotifications
  if (error || notifications.length === 0) {
    return (
      <div
        ref={popupRef}
        className="absolute top-28 right-32 bg-[#303030] rounded-xl shadow-lg p-4 w-[375px] h-[390px] z-10 border-slay-800 border-4 flex items-center justify-center"
      >
        <NoNotifications />
      </div>
    )
  }

  const sortedNotifications = [...notifications].sort(
    (a, b) => new Date(b.creationDate) - new Date(a.creationDate)
  )

  return (
    <div
      ref={popupRef}
      className="absolute top-28 right-32 bg-[#303030] rounded-xl shadow-lg p-4 w-[375px] h-[390px] z-10 border-slay-800 border-4 flex flex-col"
    >
      <h4 className="font-bold text-white text-center mb-4 text-md">Notifications</h4>
      <div className="overflow-y-auto hide-scrollbar">
        <ul className="space-y-3 pr-2">
          {sortedNotifications.map((notification, index) => {
            // Determine the appropriate icon based on status
            let icon
            switch (notification.Status) {
              case 'Pending':
                icon = SchedulingIcon
                break
              case 'Shared':
                icon = SharedSuccessfullyIcon
                break
              case 'Failed':
                icon = ErrorNotificationIcon
                break
              default:
                icon = null
            }

            return (
              <React.Fragment key={notification._id}>
                <li className="flex items-center text-gray-200 text-sm">
                  {icon && (
                    <img src={icon} alt={`${notification.Status} icon`} className="w-6 h-6 mr-3" />
                  )}
                  <div className="flex-1">
                    <p className="font-semibold">{notification.title}</p>
                    {/* use the __html for reading the br to return en ligne*/}
                    <p
                      className="text-xs text-gray-400"
                      dangerouslySetInnerHTML={{
                        __html: notification.description.replace(/\n/g, '<br>')
                      }}
                    />
                    <p className="text-xs text-gray-500">{notification.Status}</p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {getTimeDifference(notification.creationDate)}
                  </span>
                </li>
                {index < notifications.length - 1 && <hr className="border-gray-600" />}
              </React.Fragment>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
