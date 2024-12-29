import React, { useState } from 'react'
import personne from '../assests/images/personne.jpg'
import { FiBell, FiSettings } from 'react-icons/fi'
import NotificationsPopup from './HomeNotifs/NotificationPopup'

export default function Header() {
  const [showNotifications, setShowNotifications] = useState(false)

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications)
  }
  return (
    <div className=" bg-[#1F1F1F] mx-4 h-20 rounded-3xl   sm:mx-4 lg:mx-10 flex items-center justify-between ">
      <div className="flex gap-5 flex-row px-4 py-2">
        <div>
          <img
            src={personne}
            alt="Personne"
            className=" h-14 w-14 justify-center my-2 rounded-full  "
          />
        </div>
        <div className="  flex-col gap-0 text-start py-2">
          <div className=" text-[#B7B7B7]  lg:text-base"> Welcome Back!</div>
          <div className="text-white font-bold  lg:text-lg ">Mr Islem </div>
        </div>
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
