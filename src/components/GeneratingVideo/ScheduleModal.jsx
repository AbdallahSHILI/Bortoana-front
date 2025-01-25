import Modal from '../../utils/Modal'
import Thumbnail from '../../assests/images/inputs/Thumbnail.svg'

import SchedulingSuccessfully from '../../assests/images/settings/SchedulingSuccessfully.svg'

import ReactPlayer from 'react-player'
import React, { useEffect, useState } from 'react'
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaTelegramPlane,
  FaTiktok,
  FaWhatsapp,
  FaPinterestP
} from 'react-icons/fa'
import Cookies from 'js-cookie'

import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { FaRegCalendar, FaRegClock } from 'react-icons/fa'
import { FaXTwitter, FaSnapchat } from 'react-icons/fa6'
import { PencilLine, RotateCcw } from 'lucide-react'
import { publishToSelectedPlatforms } from '../../utils/SocialMediaFunctions'

const ScheduleModal = ({ onClose, videoUrl, videoTitle }) => {
  const [selected, setSelected] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedTime, setSelectedTime] = useState(new Date())
  const [isPublishing, setIsPublishing] = useState(false)
  const [publishResults, setPublishResults] = useState(null)
  const [userHashtags, setUserHashtags] = useState([])
  const [availablePlatforms, setAvailablePlatforms] = useState([])
  const [showTimeErrorModal, setShowTimeErrorModal] = useState(false)

  useEffect(() => {
    // Check cookies for platform tokens
    const checkAvailablePlatforms = () => {
      const platforms = []

      // Add platform if its token exists in cookies
      if (Cookies.get('facebook_page_token')) platforms.push('facebook')
      if (Cookies.get('instagram_token')) platforms.push('instagram')
      if (Cookies.get('whatsapp_token')) platforms.push('whatsapp')
      if (Cookies.get('pinterest_token')) platforms.push('pinterest')
      if (Cookies.get('snapchat_token')) platforms.push('snapchat')
      if (Cookies.get('twitter_oauth_token')) platforms.push('X')
      if (Cookies.get('linkedin_oauth_access_token')) platforms.push('linkedin')
      if (Cookies.get('tiktok_token')) platforms.push('tiktok')
      if (Cookies.get('youtube_token')) platforms.push('youtube')
      if (Cookies.get('telegram_token')) platforms.push('telegram')

      setAvailablePlatforms(platforms)

      // Clear any selected platforms that are no longer available
      setSelected((prev) => prev.filter((p) => platforms.includes(p)))
    }

    checkAvailablePlatforms()

    // Load hashtags
    try {
      const userData = JSON.parse(localStorage.getItem('userData'))
      if (userData?.hashtags) {
        setUserHashtags(userData.hashtags)
      }
    } catch (error) {
      console.error('Error loading hashtags:', error)
    }
  }, [])

  const handleNextStep = async () => {
    // Validate selected date and time
    const scheduledDateTime = new Date(selectedDate)
    scheduledDateTime.setHours(selectedTime.getHours())
    scheduledDateTime.setMinutes(selectedTime.getMinutes())

    if (scheduledDateTime < new Date()) {
      // Show error modal if scheduled time is in the past
      setShowTimeErrorModal(true)
      return
    }

    if (selected.length === 0) {
      alert('Please select at least one social media platform')
      return
    }

    setIsPublishing(true)

    try {
      const content = {
        videoUrl: videoUrl,
        title: videoTitle,
        description: userHashtags.join(' '),
        scheduledTime: scheduledDateTime.toISOString()
      }

      const results = await publishToSelectedPlatforms(selected, content)
      setPublishResults(results)

      // Close the modal if all platforms were successfully scheduled
      if (results.failures.length === 0) {
        onClose()
      }
    } catch (error) {
      console.error('Error:', error)
      // Optionally show an error notification or modal
    } finally {
      setIsPublishing(false)
    }
  }

  const socialIcons = [
    {
      id: 'all',
      label: 'ALL',
      icon: () => (
        <div className="flex items-center justify-center w-full h-full">
          <span className="text-white font-bold text-sm">ALL</span>
        </div>
      ),
      selectedBg: 'bg-gradient-to-r from-blue-600 to-purple-600'
    },
    {
      id: 'facebook',
      label: 'Facebook',
      icon: FaFacebookF,
      selectedBg: 'bg-[#1877F2]'
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      icon: FaWhatsapp,
      selectedBg: 'bg-[#25D366]'
    },
    {
      id: 'instagram',
      label: 'Instagram',
      icon: FaInstagram,
      selectedBg: 'bg-gradient-to-tr from-yellow-500 via-pink-600 to-purple-600'
    },
    {
      id: 'pinterest',
      label: 'Pinterest',
      icon: FaPinterestP,
      selectedBg: 'bg-[#E60023]'
    },
    {
      id: 'snapchat',
      label: 'Snapchat',
      icon: FaSnapchat,
      selectedBg: 'bg-[#FFFC00]',
      selectedText: 'text-black'
    },
    {
      id: 'X',
      label: 'X',
      icon: FaXTwitter,
      selectedBg: 'bg-black'
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      icon: FaLinkedinIn,
      selectedBg: 'bg-[#0A66C2]'
    },
    {
      id: 'tiktok',
      label: 'TikTok',
      icon: FaTiktok,
      selectedBg: 'bg-black'
    },
    {
      id: 'youtube',
      label: 'YouTube',
      icon: FaYoutube,
      selectedBg: 'bg-[#FF0000]'
    },
    {
      id: 'telegram',
      label: 'Telegram',
      icon: FaTelegramPlane,
      selectedBg: 'bg-[#26A5E4]'
    }
  ]

  const toggleSelect = (id) => {
    if (id === 'all') {
      if (selected.length === availablePlatforms.length) {
        setSelected([])
      } else {
        setSelected([...availablePlatforms])
      }
    } else {
      setSelected((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      )
    }
  }
  const filteredSocialIcons = socialIcons.filter(
    (icon) => icon.id === 'all' || availablePlatforms.includes(icon.id)
  )

  return (
    <>
      <Modal
        isOpen={onClose}
        onClose={onClose}
        // optional custom width
      >
        <div className="flex flex-col gap-8 p-4">
          <div className="flex flex-row gap-6">
            <div className="flex gap-2 flex-col">
              <div className="rounded-lg w-[450px] overflow-hidden border-2 border-gray-500">
                <ReactPlayer
                  url={videoUrl}
                  controls={true}
                  width="100%"
                  height="100%"
                  // Add crossOrigin for remote videos
                  config={{
                    file: {
                      attributes: {
                        crossOrigin: 'anonymous'
                      }
                    }
                  }}
                />
              </div>
              <p className="text-white">{videoTitle}</p>
            </div>
            <div className="flex gap-2 flex-col">
              <div className="rounded-lg  w-[450px] h-[253px] overflow-hidden border-2 border-gray-500 ">
                <img alt="Thumbnail" className="w-full h-full object-cover" src={Thumbnail} />
              </div>{' '}
              <div className="flex justify-between">
                <p className="text-white ">Thumbnail</p>
                <div className="flex gap-2 flex-row">
                  <RotateCcw className="text-gray-400 bg-[#1A1A1C] rounded-lg p-1" />
                  <PencilLine className="text-gray-400 bg-[#1A1A1C] rounded-lg p-1" />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-row justify-center text-center">
            <div className="relative rounded-full w-[30%] h-1 px-7">
              <div className="absolute inset-0 border-b-2 border-transparent bg-gradient-to-r from-white via-white/50 to-transparent bg-clip-border"></div>
            </div>{' '}
            <div className=" text-white  text-center justify-center border-white px-7 ">
              {' '}
              <p className="text-white font-bold text-lg  px-2 ">Schedule it on social media </p>
            </div>
            <div className="relative rounded-full w-[30%] h-1 px-7">
              <div className="absolute inset-0 border-b-2 border-transparent bg-gradient-to-r from-transparent via-white/50 to-white bg-clip-border"></div>
            </div>
          </div>
          <div className="flex justify-between">
            {/* Social Media Picker */}
            <div className="flex flex-col">
              <p className="text-white text-sm">1.Select the social media</p>
              <div className="max-w-2xl p-4 pl-0  rounded-lg">
                <div className="grid grid-cols-4 sm:grid-cols-4 gap-3">
                  <div className="flex flex-col">
                    <div className="max-w-2xl p-4 pl-0 rounded-lg">
                      {availablePlatforms.length === 0 ? (
                        <p className="text-gray-400 text-lg  text-center">
                          You must connect to at least one social media account
                        </p>
                      ) : (
                        <div className="grid grid-cols-4 sm:grid-cols-4 gap-12">
                          {filteredSocialIcons.map(
                            ({
                              id,
                              label,
                              icon: Icon,
                              selectedBg,
                              selectedText = 'text-white'
                            }) => (
                              <button
                                key={id}
                                onClick={() => toggleSelect(id)}
                                className={`
                relative flex items-center justify-center
                w-10 h-10 rounded-full transition-all duration-200
                ${
                  selected.includes(id)
                    ? `${selectedBg} ${selectedText} ring-2 ring-offset-2 ring-offset-gray-900 ring-white/20`
                    : 'bg-[#1A1A1C] text-gray-400 hover:bg-[#2a2a2d] hover:text-gray-200'
                }
              `}
                              >
                                {Icon && <Icon size={20} />}
                                {selected.includes(id) && (
                                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full" />
                                )}
                              </button>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Schedule section */}
            <div>
              {' '}
              <div className="flex flex-col gap-4 w-full max-w-md">
                <p className="text-white text-sm">2. Set up the date and time</p>

                {/* Date Picker */}
                <div className="relative">
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    dateFormat="dd/MM/yyyy"
                    className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <FaRegCalendar className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>

                {/* Time Picker */}
                <div className="relative">
                  <DatePicker
                    selected={selectedTime}
                    onChange={(time) => setSelectedTime(time)}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={1}
                    timeCaption="Time"
                    dateFormat="h:mm aa"
                    className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <FaRegClock className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>

                {/* Next Step Button */}
                <button
                  disabled={isPublishing}
                  onClick={handleNextStep}
                  className="w-full bg-white hover:bg-gray-200 text-black font-medium py-3 rounded-lg  transition-colors"
                >
                  {isPublishing ? 'Publishing...' : 'Next step'}
                </button>
              </div>
            </div>
          </div>
        </div>
        {publishResults && (
          <div className="mt-4">
            {publishResults.success.length > 0 && (
              <div className="text-green-500">
                <p>Successfully scheduled for:</p>
                <ul className="list-disc pl-5">
                  {publishResults.success.map((result, index) => (
                    <li key={index}>
                      {result.platform} at {new Date(result.scheduledTime).toLocaleString()}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {publishResults.failures.length > 0 && (
              <div className="text-red-500">
                <p>Failed to schedule for:</p>
                <ul className="list-disc pl-5">
                  {publishResults.failures.map((result, index) => (
                    <li key={index}>
                      {result.platform}: {result.error}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}{' '}
      </Modal>
      {showTimeErrorModal && (
        <Modal isOpen={showTimeErrorModal} onClose={() => setShowTimeErrorModal(false)}>
          <div className="flex flex-col items-center justify-center p-8">
            <h2 className="text-2xl font-bold text-red-500 mb-4">Invalid Scheduling Time</h2>
            <p className="text-white mb-6 text-center">
              You cannot schedule a video for a time in the past. Please select a future date and
              time.
            </p>
            <button
              onClick={() => setShowTimeErrorModal(false)}
              className="bg-white hover:bg-gray-200 text-black font-medium py-2 px-4 rounded-lg"
            >
              OK
            </button>
          </div>
        </Modal>
      )}
    </>
  )
}

export default ScheduleModal
