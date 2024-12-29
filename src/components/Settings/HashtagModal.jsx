import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import CongratsIcon from '../../assests/images/SettingsIcons/CongratsIcon.svg'
import { ArrowPathIcon, XMarkIcon } from '@heroicons/react/24/solid'
import axios from 'axios'
import LoadingHashtag from './LoadingHashtags'
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

  const GenerateHashtags = async () => {
    if (existingNich) {
      setLoading(true)

      try {
        const response = await axios.post('http://localhost:5000/generate_hashtags', {
          nich: existingNich
        })
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
      // Send the hashtags to the server or wherever you need them
      const response = await axios.post(
        `https://bortoaana.onrender.com/api/user/setHashtags/${id}`,
        {
          hashtags
        }
      )
      console.log('Hashtags saved successfully:', response.data)
      handleCloseGenerate() // Close the modal after saving
    } catch (error) {
      console.error('Error saving hashtags:', error)
    }
  }

  useEffect(() => {
    if (existingNich) {
      setHashtags([]) // Clear previous hashtags
      GenerateHashtags()
    }
  }, [])

  if (loading) {
    return <LoadingHashtag />
  }
  return (
    <div className="overflow-y-scroll w-screen h-screen fixed inset-0 flex justify-center items-center z-50">
      {/* Full-screen background overlay */}
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
