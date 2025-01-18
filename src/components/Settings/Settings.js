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
  const [loading, setLoading] = useState(false)
  const [hashtags, setHashtags] = useState([])
  const [isEditingBio, setIsEditingBio] = useState(false)
  const [bio, setBio] = useState('write any bio here')
  const [tempBio, setTempBio] = useState(bio)
  const [existingNich, setExistingNich] = useState('')
  const id = Cookies.get('userId')
  useEffect(() => {
    const fetchHashtags = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/user/getHashtags/${id}`)
        setHashtags(response.data.hashtags)
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
      console.log('Fetching niche...')
      try {
        const response = await axios.get(`http://localhost:5001/api/user/getnich/${id}`)
        setExistingNich(response.data.nich)
      } catch (error) {
        console.error('Error fetching niche:', error)
      }
    }

    if (id) {
      handleGetNich()
    }
  }, [id, HashtagOpen])

  const handleEditClick = () => {
    setIsEditingBio(true)
    setTempBio(bio)
  }

  const handleSaveBio = () => {
    setBio(tempBio)
    setIsEditingBio(false)
  }

  const handleCancelEdit = () => {
    setIsEditingBio(false)
    setTempBio(bio)
  }

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
    <div className="p-4 rounded-xl shadow-lg w-4/5 z-50 h-full">
      <button
        onClick={onClose}
        className="absolute top-9 right-20 z-[80] bg-white p-2 rounded-full border border-black"
        aria-label="Close settings"
      >
        <img src={Cross} alt="Close button" className="w-6 h-6" />
      </button>
      <h2 className="text-5xl font-bold text-gray-300">SETTINGS</h2>

      <div className="text-white w-full h-full">
        <div className="pt-4 flex flex-row">
          <div className="w-1/3 h-full items-center justify-center flex">
            <div
              style={{ backgroundColor: '#484848' }}
              className="h-40 w-40 rounded-full border-2 border-gray-200 flex items-center justify-center flex-col space-y-2"
            >
              <FaPlus className="" />
              <p className="text-xs">Add your logo</p>
            </div>
          </div>

          <div className="px-3 py-5 w-full">
            <div className="flex flex-row justify-between">
              <h2 className="font-bold text-sm">Your Bio :</h2>
              {!isEditingBio && (
                <img
                  alt="Logo_image"
                  src={EditImage}
                  className="h-7 w-7 cursor-pointer"
                  onClick={handleEditClick}
                />
              )}
            </div>

            {isEditingBio ? (
              <div className="flex flex-col gap-2">
                <textarea
                  value={tempBio}
                  onChange={(e) => setTempBio(e.target.value)}
                  className="w-full p-2 text-sm bg-gray-700 text-white rounded-md"
                  rows={3}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveBio}
                    className="px-4 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-1 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm">{bio}</p>
            )}
          </div>
        </div>
        <div className="h-full w-full">
          <div className="w-full h-1/4 p-5">
            <div className="flex flex-row gap-2 items-center">
              <PaintBrushIcon className="h-4 w-4 text-white" />
              <p className="text-xs text-bold">Tools</p>
            </div>

            <div className="h-full w-full  mt-2">
              <div className="h-2/3 bg-white  rounded-lg flex items-center  justify-center flex-row">
                <div className="flex items-center border-r w-[100px] 2xl:w-[170px] border-gray-300  justify-center 2xl:gap-1 flex-col">
                  <div
                    onClick={openNichModal}
                    className="cursor-pointer bg-black w-10 2xl:w-12 h-10 rounded-full flex items-center justify-center"
                  >
                    <img alt="Nich" src={AddIcon} className="" />
                  </div>
                  <p className="text-sm 2xl:text-base text-black font-bold">Nich</p>
                </div>

                <div className="flex items-center border-x w-[120px] 2xl:w-[170px] border-gray-300 2xl:px-0 px-2 justify-center 2xl:gap-1 flex-col">
                  <div
                    onClick={openThemeModal}
                    className="cursor-pointer bg-black w-10 2xl:w-12 h-10 rounded-full flex items-center justify-center"
                  >
                    <img alt="ThemeIcon" src={ThemeIcon} className="" />
                  </div>
                  <p className="text-sm 2xl:text-base text-black font-bold">Page Theme</p>
                </div>

                <div className="flex items-center border-x w-[140px] 2xl:w-[170px] border-gray-300 2xl:px-0 px-2 justify-center 2xl:gap-1 flex-col">
                  <div className="cursor-pointer bg-black w-10 2xl:w-12 h-10 rounded-full flex items-center justify-center">
                    <img alt="PostingFreq" src={PostingFreqIcon} className="" />
                  </div>
                  <p className="text-sm 2xl:text-base text-black font-bold">Posting Frequency</p>
                </div>

                <div className="flex items-center border-x w-[140px] 2xl:w-[170px] border-gray-300 2xl:px-0 px-2 justify-center 2xl:gap-1 flex-col">
                  <div className="cursor-pointer bg-black w-10 2xl:w-12 h-10 rounded-full flex items-center justify-center">
                    <img alt="Language" src={Language} className="" />
                  </div>
                  <p className="text-sm 2xl:text-base text-black font-bold">Language Accent</p>
                </div>

                <div className="flex items-center border-l w-[100px] 2xl:w-[170px] border-gray-300 2xl:px-0 px-2 justify-center 2xl:gap-1 flex-col">
                  <div
                    onClick={openAudioModal}
                    className="cursor-pointer bg-black w-10 h-10 2xl:w-12 rounded-full flex items-center justify-center "
                  >
                    <img alt="Mic" src={MicIcon} className="" />
                  </div>
                  <p className="text-sm 2xl:text-base text-black font-bold">Audio</p>
                </div>
              </div>

              <div className="flex pt-1 flex-col">
                <div>
                  <p className="text-white py-2 text-lg underline underline-offset-8 font-bold">
                    # Hashtags
                  </p>
                </div>
                <div className="justify-between gap-5 w-full flex">
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
                <div className="custom-scrollbar px-1 pt-2 h-[170px] overflow-y-auto">
                  <div className="grid h-max auto-rows-max gap-2 grid-cols-5">
                    <div className="w-full">
                      <input
                        type="text"
                        placeholder="# Example"
                        className="w-full p-2 text-sm bg-gray-400 bg-opacity-15 border-t-2 rounded-lg border border-gray-200"
                      />
                    </div>
                    {hashtags.map((hashtag, index) => (
                      <div
                        key={index}
                        className="p-2 text-sm bg-gray-400 bg-opacity-15 border-t-2 rounded-lg border border-gray-200 flex items-center justify-between"
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
