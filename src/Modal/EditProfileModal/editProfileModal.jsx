import React, { useState, useRef } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import ReturnButton from '../../assests/images/settings/Return-Button.svg'
import personne from '../../assests/images//settings/Persone.svg'
import styles from './editProfileModal.module.css'
import Cookies from 'js-cookie'
import Galery from '../../assests/images/gallery.svg'
import SuccessErrorModal from './SuccessModal/SuccessErrorModal'
import { Link } from 'react-router-dom'

const EditProfileModal = ({ closeModal, isEditing, userData }) => {
  const [formData, setFormData] = useState({
    userName: userData?.name || '',
    email: userData?.email || '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
    avatar: userData?.avatar || personne
  })

  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [isError, setIsError] = useState(false)

  const fileInputRef = useRef(null)
  const [selectedFile, setSelectedFile] = useState(null)

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords don't match!")
      setIsError(true)
      setShowModal(true)
      return
    }

    try {
      setIsSubmitting(true)
      const userId = Cookies.get('userId')
      const googleToken = Cookies.get('google_token')

      const formDataToSend = new FormData()

      formDataToSend.append('name', formData.userName)
      formDataToSend.append('email', formData.email)
      if (formData.oldPassword) formDataToSend.append('oldPassword', formData.oldPassword)
      if (formData.newPassword) formDataToSend.append('newPassword', formData.newPassword)
      if (selectedFile) {
        formDataToSend.append('avatar', selectedFile)
      }

      const response = await fetch(`http://localhost:5001/api/user/updateProfile/${userId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${googleToken}`
        },
        credentials: 'include',
        body: formDataToSend
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile')
      }

      setIsError(false)
      setShowModal(true)
    } catch (err) {
      setError(err.message)
      setIsError(true)
      setShowModal(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false)
    closeModal(true) // This will trigger the profile refresh
  }

  if (!isEditing) return null

  return (
    <div className={styles.modalContainer}>
      <div className={styles.leftSection}>
        <div className={styles.header}>
          <img
            src={ReturnButton}
            alt="Return"
            className={styles.icon}
            onClick={() => closeModal(false)}
          />
          <span>Edit Profile</span>
        </div>

        <div className={styles.profileContent}>
          <div className={styles.profilePicture}>
            <div className={styles.profileImageContainer}>
              <img crossOrigin="anonymous" src={formData.avatar} alt="Profile" />
            </div>
            <div className={styles.cameraIcon} onClick={() => fileInputRef.current.click()}>
              <img src={Galery} alt="Galery" />
            </div>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleImageChange}
              accept="image/*"
            />
            {formData.userName && <div className={styles.userName}>{formData.userName}</div>}
          </div>

          <form className={styles.formContainer} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label>User name</label>
              <input
                type="text"
                value={formData.userName}
                onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                placeholder="Enter your username"
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Email address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter your email"
                readOnly
                style={{ backgroundColor: '#2C2C2C', cursor: 'not-allowed' }}
                className={styles.inputGroup}
              />
            </div>

            {userData.hasPassword && (
              <div className={styles.inputGroup}>
                <label>Old Password</label>
                <div className={styles.passwordInput}>
                  <input
                    type={showOldPassword ? 'text' : 'password'}
                    value={formData.oldPassword}
                    onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })}
                    placeholder="Enter your current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className={styles.passwordToggle}
                  >
                    {showOldPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                <Link
                  to="/forgot-password"
                  state={{ source: 'profile' }}
                  className={`text-blue-400 hover:underline ${styles.forgotPassword}`}
                >
                  Forget Password?
                </Link>
              </div>
            )}

            <div className={styles.inputGroup}>
              <label>{userData.hasPassword ? 'New Password' : 'Password'}</label>
              <div className={styles.passwordInput}>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className={styles.passwordToggle}
                >
                  {showNewPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>Confirm Password</label>
              <div className={styles.passwordInput}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={styles.passwordToggle}
                >
                  {showConfirmPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            <button type="submit" className={styles.editButton} disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </div>
      </div>
      <SuccessErrorModal
        isVisible={showModal}
        onClose={() => {
          setShowModal(false)
          if (!isError) {
            closeModal(true) // Only close and refresh if it was successful
          }
        }}
        isError={isError}
        errorMessage={error}
      />
    </div>
  )
}

export default EditProfileModal
