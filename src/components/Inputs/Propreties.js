import React, { useState, useEffect } from 'react'
import PropertiesImage from '../../assests/images/inputs/proptext.png'
import GeneratingModal from '../GeneratingVideo/GeneratingModel'
import axios from 'axios'
import Cookies from 'js-cookie'
import { ArrowLeftIcon } from 'lucide-react'
import ErrorModal from '../../Modal/ErrorModal/GeneratingVideoError'

export default function Properties({ description = '', onClose }) {
  const [showModal, setShowModal] = useState(false)
  const [userData, setUserData] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [videoPath, setVideoPath] = useState(null)
  const [selectedOption, setSelectedOption] = useState(null) // State to track selected option
  const [lastGeneratedVideo, setLastGeneratedVideo] = useState(null)

  // Fetch user data on component mount
  useEffect(() => {
    const userId = Cookies.get('userId')
    if (userId) {
      axios
        .get(`http://localhost:5001/api/user/getuser/${userId}`)
        .then((response) => {
          setUserData(response.data.data)
        })
        .catch((error) => {
          console.error('Error fetching user data:', error)
        })
    }

    // Retrieve last generated video from localStorage
    const storedLastVideo = localStorage.getItem('lastGeneratedVideo')
    if (storedLastVideo) {
      setLastGeneratedVideo(storedLastVideo) // Directly set the string, no parsing needed
    }
  }, [])

  const generateVideo = async () => {
    // Validate niche selection
    if (!userData?.nich) {
      setErrorMessage('Please select a niche in your profile before generating a video.')
      setShowErrorModal(true)
      return
    }
    setShowModal(true)
    setVideoPath(null) // Reset video path

    try {
      const response = await axios.post(
        'http://localhost:5001/api/video/generate-video',
        {
          folder_name: userData?.nich,
          user_description: description
        },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
          credentials: 'include'
        }
      )

      if (response.data.success) {
        const videoUrl = response.data.data.url
        setVideoPath(videoUrl)
        localStorage.setItem('lastGeneratedVideo', videoUrl)
        setLastGeneratedVideo(videoUrl)
      }
    } catch (error) {
      console.error('Error generating video:', error)
      setShowModal(false)
    }
  }

  const handleGenerateClick = (e) => {
    e.preventDefault()
    generateVideo()
  }

  const handleShowLastVideo = (e) => {
    e.preventDefault()
    if (lastGeneratedVideo) {
      setVideoPath(lastGeneratedVideo)
      setShowModal(true)
    }
  }

  // Function to handle option selection
  const handleOptionClick = (option) => {
    setSelectedOption(option)
  }

  const handleBack = () => {
    if (typeof onClose === 'function') {
      onClose()
    }
  }

  const handleModalClose = () => {
    setShowModal(false)
    setVideoPath(null) // Reset video path when modal is closed
  }

  return (
    <div className="">
      <img src={PropertiesImage} alt="PropertiesImage" className="w-[200px] ml-16" />
      <div className="flex flex-row">
        <div className="mt-4 bg-white ml-[80px] w-[28px] h-[28px] rounded-full flex items-center justify-center">
          <ArrowLeftIcon onClick={handleBack} className="w-3 h-4 cursor-pointer text-gray-700" />
        </div>
        {/* Form */}
        <div className="w-[400px] p-3">
          {/* Picture/Video Selection */}
          <div className="mb-4">
            <div className="text-[10px] text-white mb-2">Choose content type</div>
            <div className="flex flex-col gap-3">
              {/* Picture Option */}
              <div
                onClick={() => handleOptionClick('picture')}
                className={`flex-1 p-2 rounded border-2 cursor-pointer transition-all ${
                  selectedOption === 'picture'
                    ? 'border-blue-400'
                    : 'border-white/30 hover:border-blue-400'
                }`}
              >
                <div className="text-center text-white">
                  <i className="fas fa-image mb-1"></i>
                  <div className="text-[10px]">Picture</div>
                </div>
              </div>

              {/* Video Option */}
              <div
                onClick={() => handleOptionClick('video')}
                className={`flex-1 p-2 rounded border-2 cursor-pointer transition-all ${
                  selectedOption === 'video'
                    ? 'border-blue-400'
                    : 'border-white/30 hover:border-blue-400'
                }`}
              >
                <div className="text-center text-white">
                  <i className="fas fa-video mb-1"></i>
                  <div className="text-[10px]">Video</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Generate button */}
      <div className="flex gap-3 ml-24">
        <div
          onClick={handleGenerateClick}
          className="rounded-sm text-white w-[60px] h-[20px] text-[8px] font-bold bg-blue-500 flex items-center justify-center cursor-pointer"
        >
          Generate
        </div>

        {lastGeneratedVideo && (
          <div
            onClick={handleShowLastVideo}
            className="rounded-sm text-white w-[75px] h-[20px] text-[8px] font-bold bg-gray-500 hover:bg-gray-600 flex items-center justify-center cursor-pointer"
          >
            Last Generated
          </div>
        )}
      </div>
      {showErrorModal && (
        <ErrorModal message={errorMessage} onClose={() => setShowErrorModal(false)} />
      )}

      <GeneratingModal
        show={showModal}
        onClose={handleModalClose}
        videoPath={videoPath}
        onRegenerate={generateVideo}
      />
    </div>
  )
}
