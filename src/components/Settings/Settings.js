import React,{useState} from 'react'
import EditImage from "../../assests/images/settings/edit.png"
import ToolsImage from '../../assests/images/settings/brush.png'
import AddImage from "../../assests/images/settings/add.png"
import MicrophoneImage from "../../assests/images/settings/microphone.png"
import { FaPlus } from 'react-icons/fa'
import Cross from '../../assests/images/cross.png'
import VoiceGenerator from './VoiceGenerator'
const SettingsForm = ({ onClose }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

   const openAudioModal = () => {
     setIsModalOpen(true)
   }

   const closeAudioModal = () => {
     setIsModalOpen(false)
   }

  return (
    <div className=" p-8 rounded-xl shadow-lg w-4/5 z-50  h-full ">
      {/* Close Button */}
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-9 right-20 z-[80] bg-white p-2 rounded-full border border-red-500"
        aria-label="Close settings"
      >
        <img src={Cross} alt="Close button" className="w-6 h-6" />
      </button>
      <h2 className="text-5xl font-bold mb-4 text-gray-300 ">SETTINGS</h2>
      {/* middel part here */}
      <div className="text-white w-full h-full ">
        {' '}
        {/* horizantal  */}
        <div className="h-2/5 flex flex-row">
          {/* circle */}
          <div className=" w-1/3 h-full items-center justify-center flex">
            <div
              style={{ backgroundColor: '#484848' }}
              className="h-44 w-44 rounded-full border-2 border-gray-200 flex items-center justify-center flex-col space-y-2 "
            >
              <FaPlus className="mr-2" />
              <p className="text-xs">Add your logo</p>
            </div>
          </div>
          {/* bio */}
          <div className="p-10 p-x-5 w-full">
            <div className="flex flex-row justify-between">
              <h2 className="font-bold">Your Bio :</h2>
              <img src={EditImage} className="h-7 w-7"></img>
            </div>
            <p>
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
            <div className=" flex flex-row  items-center p-x-3">
              <img className="h-3 w-3" src={ToolsImage}></img>
              <p className="text-xs text-bold">Tools</p>
            </div>
            {/* buttom */}
            <div className="h-full w-full mt-2  ">
              <div className="h-2/3  bg-white rounded-lg  flex items-center justify-between p-8 ">
                {/*  */}
                <div className="flex items-center justify-center  flex-col">
                  <div className="bg-black h-7 w-7 rounded-full flex items-center justify-center ">
                    <img className="h-4 w-4" src={AddImage}></img>
                  </div>
                  <p className="text-xs text-black text-bold">Nich</p>
                </div>
                {/*  */}
                <div className="flex items-center justify-center flex-col">
                  <div
                    className="bg-black h-7 w-7 rounded-full   flex items-center justify-center cursor-pointer"
                    onClick={openAudioModal}
                  >
                    <img className="h-4 w-4" src={MicrophoneImage} />
                  </div>
                  <p className="text-xs text-black text-bold">Audio</p>
                </div>
              </div>
              {/*  */}
              <div className="mt-4">
                <p className="text-white text-xs text-bold"> # Hashtags</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Modal */}
      {isModalOpen && <VoiceGenerator onClose={closeAudioModal} />}
    </div>
  )
}

export default SettingsForm
