import Modal from '../../utils/Modal'
import Thumbnail from '../../assests/images/inputs/Thumbnail.svg'
import ReactPlayer from 'react-player'
import React, { useEffect, useState } from 'react'
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaTelegramPlane,
  FaTiktok,
  FaPlus,
  FaWhatsapp,
  FaPinterestP
} from 'react-icons/fa'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { FaRegCalendar, FaRegClock } from 'react-icons/fa'
import { FaXTwitter, FaSnapchat } from 'react-icons/fa6'
import { PencilLine, RotateCcw } from 'lucide-react'
import { publishToSelectedPlatforms } from '../../utils/SocialMediaFunctions'

const ScheduleModal = ({ onClose, videoUrl, videoTitle }) => {
  console.log('Video URL in ScheduleModal:', videoUrl)
  const [selected, setSelected] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedTime, setSelectedTime] = useState(new Date())
  const [isPublishing, setIsPublishing] = useState(false)
  const [publishResults, setPublishResults] = useState(null)
  const [userHashtags, setUserHashtags] = useState([])

  useEffect(() => {
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
    if (selected.length === 0) {
      alert('Please select at least one social media platform')
      return
    }

    setIsPublishing(true)

    try {
      // Combine date and time
      const scheduledDateTime = new Date(selectedDate)
      scheduledDateTime.setHours(selectedTime.getHours())
      scheduledDateTime.setMinutes(selectedTime.getMinutes())

      // Prepare content object with passed video URL
      const content = {
        videoUrl: videoUrl,
        title: userHashtags,
        scheduledTime: scheduledDateTime.toISOString()
      }

      // Publish to selected platforms
      const results = await publishToSelectedPlatforms(selected, content)
      setPublishResults(results)

      if (results.failures.length === 0) {
        alert('Successfully scheduled for all platforms!')
        onClose()
      } else {
        alert(
          `Published to ${results.success.length} platforms. ${results.failures.length} failed.`
        )
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error scheduling posts: ' + error.message)
    } finally {
      setIsPublishing(false)
    }
  }

  const socialIcons = [
    {
      id: 'all',
      label: 'ALL',
      icon: null,
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
      // If ALL is clicked, either select all or clear all
      if (selected.length === socialIcons.length - 1) {
        // -1 to exclude the "more" option
        setSelected([])
      } else {
        setSelected(socialIcons.slice(0, -1).map((icon) => icon.id)) // Select all except "more"
      }
    } else {
      setSelected((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      )
    }
  }

  return (
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
                {socialIcons.map(
                  ({ id, label, icon: Icon, selectedBg, selectedText = 'text-white' }) => (
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
                      {id === 'all' ? (
                        <span className="text-xs font-bold">ALL</span>
                      ) : Icon ? (
                        <Icon size={20} />
                      ) : (
                        <span className="text-xs font-bold">{label[0]}</span>
                      )}
                      {selected.includes(id) && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full" />
                      )}
                    </button>
                  )
                )}
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
            <p className="text-green-500">
              Successfully scheduled for: {publishResults.success.map((r) => r.platform).join(', ')}
            </p>
          )}
          {publishResults.failures.length > 0 && (
            <p className="text-red-500">
              Failed to schedule for: {publishResults.failures.map((r) => r.platform).join(', ')}
            </p>
          )}
        </div>
      )}
    </Modal>
  )
}

export default ScheduleModal
