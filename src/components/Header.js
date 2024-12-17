import React, { useState } from 'react'
import personne from '../assests/images/personne.png'
import { FiBell, FiSettings } from 'react-icons/fi'
import NotificationsPopup from './HomeNotifs/NotificationPopup'

export default function Header() {
  const [showNotifications, setShowNotifications] = useState(false)

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications)
  }
  return (
    <div
      style={{ background: '#1F1F1F' }}
      className="bg-pink-500 mx-4 h-20 rounded-3xl sm:mx-4  lg:mx-10 flex items-center justify-between "
    >
      <img
        src={personne}
        alt="Personne"
        className=" lg:h-16 lg:w-16 sm:w-11 sm:h-11 h-11 w-11 rounded-full absolute left-5 top-14 md:left-8 md:top-14  lg:left-12 lg:top-12 sm:left-9 sm:top-10 "
      />
      {/* container texts  */}
      <div className="  flex-col ml-16 sm:ml-16 lg:ml-24 md:ml-22">
        <div style={{ color: '#B7B7B7' }} className="text-white  text-xs sm:text-xs lg:text-base">
          {' '}
          Welcome Back!
        </div>
        <div className="text-white font-bold  text-xs sm:text-xs lg:text-lg ">John Doe </div>
      </div>

      <div className=" flex flex-row space-x-4 mr-3 ">
        <div
          onClick={() => toggleNotifications()}
          className="rounded-full border w-8 h-8 sm:w-8 sm:h-8 lg:w-12 lg:h-12 flex justify-center items-center cursor-pointer"
        >
          <FiBell style={{ color: 'white' }} className="text-white lg:text-2xl sm:text-lg" />{' '}
          {/* Notification Icon */}
        </div>
        <div className=" rounded-full  border border-1 w-8 h-8  sm:w-8 sm:h-8 lg:w-12 lg:h-12 flex justify-center items-center">
          <FiSettings className="text-white lg:text-2xl sm:text-lg" />
        </div>
      </div>

      {/* Notification Popup */}
      {showNotifications && <NotificationsPopup />}
    </div>
  )
}
