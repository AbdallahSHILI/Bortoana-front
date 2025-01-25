import React, { useState } from 'react'
import { FiBell, FiLogOut, FiSettings } from 'react-icons/fi'
import NotificationsPopup from './HomeNotifs/NotificationPopup'
import ProfileModal from '../Modal/ProfileModal/profileModal'
import personne from '../assests/images/settings/Persone.svg'
import LogoutModal from '../Modal/LogoutModal/logoutModal'
import { useStats } from '../context/statsContext'

export default function Header({ userData, isLoading, error, refreshUserData }) {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const { refreshStats, updateUserId } = useStats()

  const toggleNotifications = () => {
    console.log('Before toggle:', showNotifications)
    setShowNotifications((prevState) => !prevState)
    console.log('After toggle:', !showNotifications)
  }

  const toggleModal = () => {
    setShowModal(!showModal)
  }

  // Utility function to remove a cookie
  const removeCookie = (name) => {
    document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`
  }

  const handleLogout = () => {
    // Remove cookies
    removeCookie('google_token')
    removeCookie('linkedin_oauth_access_token')
    removeCookie('linkedin_user_info')
    removeCookie('twitter_oauth_token')
    removeCookie('twitter_oauth_token_secret')
    removeCookie('userId')

    // Clear local storage
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('token')
    localStorage.removeItem('userData')
    localStorage.removeItem('userId')
    localStorage.removeItem('lastInputText')
    localStorage.removeItem('lastGeneratedVideo')

    // Update userId in StatsContext to null
    updateUserId(null) // Call updateUserId

    // Redirect to login page or home page
    window.location.href = '/newbortoaana' // Adjust the URL as needed
  }

  const handleCancelLogout = () => {
    setShowLogoutModal(false)
  }

  console.log('Avatar URL:', userData?.avatar)
  console.log('Fallback URL:', personne)

  const handleImageError = (e) => {
    e.target.src = personne
  }

  const handleCloseModal = () => {
    setShowModal(false)
    // Optionally refresh user data when modal closes
    refreshUserData?.()
  }

  return (
    <div className="bg-[#1F1F1F] mx-4 h-20 rounded-3xl sm:mx-4 lg:mx-10 flex items-center justify-between">
      <div className="flex gap-5 flex-row px-4 py-2">
        <div>
          <img
            src={userData?.avatar || personne}
            alt="Profile"
            className="h-14 w-14 justify-center my-2 rounded-full"
            onError={handleImageError}
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
            loading="eager"
          />
        </div>
        <div className="flex-col gap-0 text-start py-2">
          <div className="text-[#B7B7B7] lg:text-base">Welcome Back!</div>
          <div className="text-white font-bold lg:text-lg">
            {userData ? `${userData.name || ''} ${userData.lastName || ''}` : 'Guest'}
          </div>
        </div>
      </div>

      <div className="flex flex-row space-x-4 mr-3">
        <div
          onClick={toggleNotifications}
          className="rounded-full border w-8 h-8 sm:w-8 sm:h-8 lg:w-12 lg:h-12 flex justify-center items-center cursor-pointer"
        >
          <FiBell className="text-white lg:text-2xl sm:text-lg" />
        </div>
        <div
          onClick={toggleModal}
          className="rounded-full border border-1 w-8 h-8 sm:w-8 sm:h-8 lg:w-12 lg:h-12 flex justify-center items-center cursor-pointer"
        >
          <FiSettings className="text-white lg:text-2xl sm:text-lg" />
        </div>
        <div
          onClick={() => setShowLogoutModal(true)}
          className="rounded-full border border-1 w-8 h-8 sm:w-8 sm:h-8 lg:w-12 lg:h-12 flex justify-center items-center cursor-pointer"
        >
          <FiLogOut className="text-white lg:text-2xl sm:text-lg" />
        </div>
      </div>

      {showNotifications && (
        <NotificationsPopup
          onClose={() => setShowNotifications(false)}
          key={showNotifications.toString()}
        />
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative bg-[#1F1F1F] rounded-lg p-8 w-11/12 md:w-4/5 lg:w-2/3 max-w-6xl max-h-[90vh] overflow-y-auto">
            <ProfileModal
              closeModal={handleCloseModal}
              userData={userData}
              refreshUserData={refreshUserData}
            />
          </div>
        </div>
      )}

      {showLogoutModal && <LogoutModal onLogout={handleLogout} onCancel={handleCancelLogout} />}
    </div>
  )
}
