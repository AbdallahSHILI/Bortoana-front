import React, { useEffect, useState } from 'react'
import EditImage from '../../assests/images/settings/edit.png'
import ToolsImage from '../../assests/images/settings/brush.png'
import AddImage from '../../assests/images/settings/add.png'
import MicrophoneImage from '../../assests/images/settings/microphone.png'
import { FaPlus } from 'react-icons/fa'
import Cross from '../../assests/images/cross.png'
import VoiceGenerator from './VoiceGenerator'
import { PaintBrushIcon, XMarkIcon } from '@heroicons/react/24/solid'
import AddIcon from '../../assests/images/SettingsIcons/AddIcon.svg'
import ThemeIcon from '../../assests/images/SettingsIcons/ThemeIcon.svg'
import PostingFreqIcon from '../../assests/images/SettingsIcons/PostingFrequency.svg'
import Language from '../../assests/images/SettingsIcons/LanguageIcon.svg'
import MicIcon from '../../assests/images/SettingsIcons/MicIcon.svg'
import '../../App.css'
import NichGenerator from './Nich'
import Cookies from 'js-cookie'
import axios from 'axios'
import HashtagModal from './HashtagModal'
import LoadingHashtag from './LoadingHashtags'
import PageTheme from './PageTheme'
const SettingsForm = ({ onClose }) => {
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false)
  const [isNichModalOpen, setNichIsModalOpen] = useState(false)
  const [isThemeOpen, setisThemeOpen] = useState(false)
  const [HashtagOpen, setHashtagOpen] = useState(false)
  const [loading, setLoading] = useState(false) // New loading state
  const [hashtags, setHashtags] = useState([]) // State to hold hashtags

  const [existingNich, setExistingNich] = useState('')
  const id = Cookies.get('userId')
  console.log(id)

  useEffect(() => {
    const fetchHashtags = async () => {
      try {
        const response = await axios.get(
          `https://bortoaana.onrender.com/api/user/getHashtags/${id}`
        )
        setHashtags(response.data.hashtags) // Assuming response contains an array of hashtags
        console.log('Fetched hashtags:', response.data.hashtags)
      } catch (error) {
        console.error('Error fetching hashtags:', error)
      }
    }

    if (id) {
      fetchHashtags()
    }
  }, [id, HashtagOpen])

  useEffect(() => {
    const handleGetNich = async () => {
      try {
        const response = await axios.get(`https://bortoaana.onrender.com/api/user/getnich/${id}`)
        setExistingNich(response.data.nich)
        console.log('resopons', response)
      } catch (error) {
        console.error('Error fetching niche:', error)
      }
    }

    if (id) {
      // Only fetch if we have an ID
      handleGetNich()
    }
    console.log('nich', existingNich)
  }, [id, HashtagOpen]) // Problem is here

  const handleOpenGenerate = () => {
    setHashtagOpen(true)
  }
  const openAudioModal = () => {
    setIsVoiceModalOpen(true)
  }

  const handleCloseGenerate = () => setHashtagOpen(false)

  const closeAudioModal = () => {
    setIsVoiceModalOpen(false)
  }
  const openNichModal = () => {
    setNichIsModalOpen(true)
  }

  const closeNichModal = () => {
    setNichIsModalOpen(false)
  }
  const openThemeModal = () => {
    setisThemeOpen(true)
  }

  const closeThemeModal = () => {
    setisThemeOpen(false)
  }

  return (
    <div className=" p-4  rounded-xl shadow-lg w-4/5 z-50 h-full">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-9 right-20 z-[80] bg-white p-2 rounded-full border border-black"
        aria-label="Close settings"
      >
        <img src={Cross} alt="Close button" className="w-6 h-6" />
      </button>
      <h2 className="text-5xl font-bold  text-gray-300 ">SETTINGS</h2>
      {/* middel part here */}
      <div className="text-white w-full h-full ">
        {' '}
        {/* horizantal  */}
        <div className="pt-4 flex flex-row">
          {/* circle */}
          <div className=" w-1/3 h-full items-center justify-center flex">
            <div
              style={{ backgroundColor: '#484848' }}
              className=" h-40 w-40 rounded-full border-2 border-gray-200 flex items-center justify-center flex-col space-y-2 "
            >
              <FaPlus className="" />
              <p className="text-xs">Add your logo</p>
            </div>
          </div>
          {/* bio */}
          <div className="px-3 py-5  w-full">
            <div className="flex flex-row justify-between">
              <h2 className="font-bold text-sm">Your Bio :</h2>
              <img alt="Logo_image" src={EditImage} className="h-7 w-7"></img>
            </div>
            <p className="text-sm">
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
              laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
              architecto beatae vitae dicta sunt explicabo.{' '}
            </p>
          </div>
        </div>
        {/* second part */}
        <div className="  h-full w-full">
          {/* tool bar  */}
          <div className=" w-full h-1/4 p-5">
            {/* top */}
            <div className=" flex flex-row gap-2 items-center">
              <PaintBrushIcon className="h-4 w-4 text-white" />
              <p className="text-xs text-bold">Tools</p>
            </div>
            {/* buttom */}
            <div className="h-full w-full mt-2  ">
              <div className=" h-2/3  bg-white rounded-lg  flex items-center justify-center   flex-row  ">
                {/*  */}
                <div className="flex items-center border-r w-[100px] border-gray-300 pr-2 justify-center  flex-col">
                  <div
                    onClick={openNichModal}
                    className=" cursor-pointer  bg-black w-10 h-10 rounded-full flex items-center justify-center "
                  >
                    <img alt="Nich" src={AddIcon} className=" " />
                  </div>
                  <p className="text-sm text-black font-bold">Nich</p>
                </div>
                <div className="flex items-center border-x w-[120px] border-gray-300 px-2 justify-center  flex-col">
                  <div
                    onClick={openThemeModal}
                    className=" cursor-pointer  bg-black w-10 h-10 rounded-full flex items-center justify-center "
                  >
                    <img alt="ThemeIcon" src={ThemeIcon} className=" " />
                  </div>
                  <p className="text-sm text-black font-bold">Page Theme</p>
                </div>
                <div className="flex items-center  border-x w-[140px] border-gray-300 px-2 justify-center  flex-col">
                  <div className=" cursor-pointer  bg-black w-10 h-10 rounded-full flex items-center justify-center ">
                    <img alt="PostingFreq" src={PostingFreqIcon} className=" " />
                  </div>
                  <p className="text-sm text-black font-bold">Posting Frequency</p>
                </div>
                <div className="flex items-center  border-x w-[140px] border-gray-300 px-2 justify-center  flex-col">
                  <div className=" cursor-pointer  bg-black w-10 h-10 rounded-full flex items-center justify-center ">
                    <img alt="Language" src={Language} className=" " />
                  </div>
                  <p className="text-sm text-black font-bold">Language Accent</p>
                </div>
                <div className="flex items-center  border-l w-[100px] border-gray-300 px-2 justify-center  flex-col">
                  <div
                    onClick={openAudioModal}
                    className=" cursor-pointer  bg-black w-10 h-10 rounded-full flex items-center justify-center "
                  >
                    <img alt="Mic" src={MicIcon} className=" " />
                  </div>
                  <p className="text-sm text-black font-bold">Audio</p>
                </div>
                {/*  */}
              </div>
              {/*  */}
              <div className="flex pt-1 flex-col">
                <div>
                  {' '}
                  <p className="text-white py-2 text-lg underline underline-offset-8 font-bold">
                    {' '}
                    # Hashtags
                  </p>
                </div>
                <div className=" justify-between gap-5 w-full flex ">
                  <div className="w-[70%] text-sm py-2">
                    <p>
                      sum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                      incididunt ut labore et dolore magna aliqua. Ut enim ad minim veni
                    </p>
                  </div>
                  <div className="">
                    <button
                      onClick={handleOpenGenerate}
                      className="text-sm rounded-lg hover:bg-blue-700 bg-[#0004FF] p-3"
                    >
                      Generate It with Ai
                    </button>
                  </div>
                </div>
                <div className=" custom-scrollbar px-1 pt-2 h-[170px] overflow-y-auto">
                  <div className="grid h-max auto-rows-max gap-2 grid-cols-5 ">
                    {/* Input always spans full width */}
                    <div className="w-full">
                      <input
                        type="text"
                        placeholder="# Example"
                        className="w-full p-2 text-sm bg-gray-400 bg-opacity-15 border-t-2 rounded-lg border border-gray-200"
                      />
                    </div>
                    {/* Hashtags */}
                    {hashtags.map((hashtag, index) => (
                      <div
                        key={index}
                        className="p-2  text-sm bg-gray-400 bg-opacity-15 border-t-2 rounded-lg border border-gray-200 flex items-center justify-between"
                      >
                        <p className="truncate">{hashtag}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Modal */}
      {isVoiceModalOpen && <VoiceGenerator onClose={closeAudioModal} />}
      {isNichModalOpen && <NichGenerator onClose={closeNichModal} />}
      {HashtagOpen && (
        <HashtagModal
          HashtagOpen={HashtagOpen}
          loading={loading}
          handleCloseGenerate={handleCloseGenerate}
          setLoading={setLoading}
          existingNich={existingNich}
        />
      )}
      {isThemeOpen && <PageTheme onClose={closeThemeModal} />}
    </div>
  )
}

export default SettingsForm
