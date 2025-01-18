import React, { useState, useEffect } from 'react'
import PropertiesImage from '../../assests/images/inputs/proptext.png'
import GeneratingModal from '../GeneratingVideo/GeneratingModel'
import axios from 'axios'
import Cookies from 'js-cookie'
import { ArrowLeftIcon } from 'lucide-react'

export default function Properties({ description = '', onClose }) {
  const [showModal, setShowModal] = useState(false)
  const [userData, setUserData] = useState(null)
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
    // Fetch last generated video from localStorage
    const lastVideo = localStorage.getItem('lastGeneratedVideo')
    if (lastVideo) {
      setLastGeneratedVideo(lastVideo)
    }
  }, [])

  const generateVideo = async (previousVideoPath = null) => {
    setShowModal(true)
    setVideoPath(null)

    // Extract the video filename from the previous path if it exists
    const previousVideo = previousVideoPath ? previousVideoPath.split('/').pop() : null

    const videoData = {
      folder_name: userData?.nich,
      user_description: description,
      download_directory: 'final',
      previously_served: previousVideo
    }

    try {
      const response = await axios.post(
        'http://localhost:5001/api/video/generate-video',
        videoData,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      )

      if (response.data.success) {
        const videoFileName = response.data.data.local_video_path
        const newVideoPath = `http://localhost:5001/stream/${videoFileName}`
        setVideoPath(newVideoPath)
        // Store the video path in localStorage
        localStorage.setItem('lastGeneratedVideo', newVideoPath)
        setLastGeneratedVideo(newVideoPath)
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

  return (
    <div className="">
      <img src={PropertiesImage} alt="PropertiesImage" className="w-[300px] ml-20" />
      <div className="flex flex-row ">
        <div className="mt-4 bg-white ml-[100px] w-[35px] h-[35px] rounded-full flex items-center justify-center">
          <ArrowLeftIcon onClick={handleBack} className="w-4 cursor-pointer h-5 text-gray-700" />
        </div>
        {/* Form */}
        <div className="w-[480px]  p-4">
          {/* Picture/Video Selection */}
          <div className="mb-6">
            <div className="text-xs text-white mb-2">Choose content type</div>
            <div className="flex flex-col gap-4">
              {/* Picture Option */}
              <div
                className={`flex-1 p-3 rounded border-2 cursor-pointer transition-all ${
                  selectedOption === 'picture'
                    ? 'border-blue-400' // Blue border if selected
                    : 'border-white/30 hover:border-blue-400' // Default or hover state
                }`}
                onClick={() => handleOptionClick('picture')} // Set selected option to 'picture'
              >
                <div className="text-center text-white">
                  <i className="fas fa-image mb-2"></i>
                  <div className="text-xs">Picture</div>
                </div>
              </div>

              {/* Video Option */}
              <div
                className={`flex-1 p-3 rounded border-2 cursor-pointer transition-all ${
                  selectedOption === 'video'
                    ? 'border-blue-400' // Blue border if selected
                    : 'border-white/30 hover:border-blue-400' // Default or hover state
                }`}
                onClick={() => handleOptionClick('video')} // Set selected option to 'video'
              >
                <div className="text-center text-white">
                  <i className="fas fa-video mb-2"></i>
                  <div className="text-xs">Video</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Generate button */}
      <div className="flex gap-4 ml-32">
        <div
          onClick={handleGenerateClick}
          className="rounded-sm text-white w-[70px] h-[25px] text-[9px] font-bold bg-blue-500 flex items-center justify-center cursor-pointer"
        >
          Generate
        </div>

        {lastGeneratedVideo && (
          <div
            onClick={handleShowLastVideo}
            className="rounded-sm text-white w-[90px] h-[25px] text-[9px] font-bold bg-gray-500 hover:bg-gray-600 flex items-center justify-center cursor-pointer"
          >
            Last Generated
          </div>
        )}
      </div>

      <GeneratingModal
        show={showModal}
        onClose={() => setShowModal(false)}
        videoPath={videoPath}
        onRegenerate={generateVideo}
      />
    </div>
  )
}
