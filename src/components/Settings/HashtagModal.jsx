import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import CongratsIcon from '../../assests/images/SettingsIcons/CongratsIcon.svg'
import { ArrowPathIcon, XMarkIcon } from '@heroicons/react/24/solid'
import axios from 'axios'
import LoadingHashtag from './LoadingHashtags'
import sorryIcon from '../../assests/images/settings/SorryIcon.svg'
import Cookies from 'js-cookie'

const HashtagModal = ({
  handleCloseGenerate,
  HashtagOpen,
  loading,
  open,
  setLoading,
  existingNich
}) => {
  const [hashtags, setHashtags] = useState([])
  const id = Cookies.get('userId')
  const baseUrl =
    process.env.NODE_ENV == 'production'
      ? 'https://bortoaana.onrender.com'
      : 'http://localhost:5001'

  const GenerateHashtags = async () => {
    if (existingNich) {
      setLoading(true)
      try {
        const response = await axios.post(`${baseUrl}/api/user/generate_hashtags`, {
          nich: existingNich
        })
        console.log('Hashtags generated successfully:', response.data)
        setHashtags(response.data.hashtags || [])
      } catch (error) {
        console.error('Error fetching hashtags:', error)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleSave = async () => {
    try {
      const response = await axios.post(`${baseUrl}/api/user/setHashtags/${id}`, {
        hashtags
      })
      console.log('Hashtags saved successfully:', response.data)
      handleCloseGenerate()
    } catch (error) {
      console.error('Error saving hashtags:', error)
    }
  }

  useEffect(() => {
    if (existingNich) {
      setHashtags([])
      GenerateHashtags()
    }
  }, [])

  if (loading) {
    return <LoadingHashtag />
  }

  // If no niche is selected, show the warning modal
  if (!existingNich) {
    return (
      <div className="fixed inset-0 flex justify-center items-center z-50">
        {/* Background overlay */}
        <motion.div
          className="fixed inset-0 bg-black"
          onClick={handleCloseGenerate}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Modal container */}
        <div
          className="bg-[#1F1F1F] border-4 border-[#4B4B4B] rounded-xl p-10 max-w-2xl w-full mx-4 relative z-50" // Changed border to border-2
          style={{ boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)' }}
        >
          {/* Close button with white circle */}
          <div className="absolute top-4 right-4">
            <div className="bg-white rounded-full p-1 cursor-pointer hover:bg-gray-200 transition-colors">
              <XMarkIcon
                onClick={handleCloseGenerate}
                className="h-8 w-8 text-[#1F1F1F]" // Adjusted icon size and color
              />
            </div>
          </div>

          {/* Icon */}
          <div className="flex justify-center mb-8">
            <img src={sorryIcon} alt="Sorry Icon" className="w-20 h-20" />
          </div>

          {/* Heading */}
          <h2 className="text-white text-3xl font-bold text-center mb-6">Hold on a moment!</h2>

          {/* Description */}
          <p className="text-gray-400 text-center mb-10 text-lg">
            To generate hashtags with AI, you first need to set up your niche. Let's get that done
            to ensure the best results!
          </p>

          {/* Button */}
          <div className="flex justify-center">
            <button
              onClick={handleCloseGenerate}
              className="bg-[#0004FF] hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors text-lg"
            >
              Set up my Niche
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Original hashtag generation modal
  return (
    <div className="overflow-y-scroll w-screen h-screen fixed inset-0 flex justify-center items-center z-50">
      {/* Rest of your existing modal code */}
      <motion.div
        className="fixed inset-0 w-full h-full bg-black"
        onClick={handleCloseGenerate}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      ></motion.div>

      {/* Content container */}
      <div className="absolute px-24 z-60 flex flex-col gap-4 p-8 items-center text-center border-4 border-gray-200 border-blur bg-[#303030] rounded-xl">
        <XMarkIcon
          onClick={handleCloseGenerate}
          className="absolute cursor-pointer top-4 right-8 rounded-full h-7 w-7 text-white hover:bg-gray-500 "
        />
        <img src={CongratsIcon} alt="congratsIcon" className="h-12 w-18" />
        <div className="text-white flex flex-col w-full gap-4">
          <h2 className="text-xl font-bold">Here are the results</h2>
          <p className="text-sm w-[600px]">
            sum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
            labore et dolore magna aliqua. Ut enim ad minim veni
          </p>
          <div className="pt-5 w-full items-center text-center">
            <p className="font-bold">
              According to my nich:{' '}
              <span className="bg-[#0004FF63] ml-2 border-white font-normal border px-3 py-2 rounded-full">
                {existingNich}
              </span>
            </p>
          </div>
        </div>
        {/* Display hashtags */}
        <div className="w-full pt-4 grid grid-cols-5 text-white gap-2">
          {hashtags.length > 0 ? (
            hashtags.map((hashtag, index) => (
              <div
                key={index}
                className="p-2 text-sm bg-gray-400 bg-opacity-15 border-t-2 rounded-lg border border-gray-200 flex items-center justify-between"
              >
                <p className="truncate">{hashtag}</p>
                <XMarkIcon
                  className="text-white h-4 w-4 border-2 border-white rounded-md cursor-pointer"
                  onClick={
                    () => setHashtags((prev) => prev.filter((_, i) => i !== index)) // Remove hashtag
                  }
                />
              </div>
            ))
          ) : (
            <p className="col-span-5 text-sm text-gray-400">No hashtags available</p>
          )}
        </div>
        <div className="flex gap-8 pt-8 flex-row">
          <button
            onClick={GenerateHashtags}
            className="flex bg-[#1A1A1C] hover:bg-gray-900 py-3 px-6 rounded-lg flex-row text-center items-center gap-2"
          >
            <ArrowPathIcon className="h-4 w-4 text-gray-400" />
            <p className="text-gray-400">Regenerate</p>
          </button>
          <button
            onClick={handleSave}
            className="bg-[#0004FF] hover:bg-blue-700 w-[140px] rounded-lg text-white py-3 px-6"
          >
            Save it
          </button>
        </div>
      </div>
    </div>
  )
}

export default HashtagModal
