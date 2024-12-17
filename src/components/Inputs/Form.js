import React, { useState } from 'react'
import InputText from '../../assests/images/imput.png'
import microIcon from '../../assests/images/microphone.png'
import textIcon from '../../assests/images/text.png'
import TextInputForm from './TextInputForm'
import AudioInputForm from './AudioInputForm'
// import {Link} from "react-router-dom"
const Form = ({ onClose }) => {
  const [showNewContent, setShowNewContent] = useState(false)
  const [showAudiInput, setShowAudioInput] = useState(false)
  return (
    <div className="absolute inset-0 flex bg-black transition-opacity duration-500 opacity-100  ">
      {showNewContent ? (
        <TextInputForm onClose={() => setShowNewContent(false)} />
      ) : showAudiInput ? (
        <AudioInputForm onClose={() => setShowAudioInput(false)} />
      ) : (
        <div className="flex flex-row  w-full ">
          <div className=" w-2/4 ">
            <img className="w-[250px] h-[100px] ml-12 -mt-2  " src={InputText} />
            <div className="ml-12 p-5 text-white text-[10px] w-[250px] text-center overflow-hidden -m-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
            </div>
          </div>
          <div className="space-y-3 mt-7 ml-10 z-40 w-3/4  m-2">
            {/* audio input button */}
            <div
              onClick={(e) => {
                e.stopPropagation() // Prevents zoom-out when button is clicked
                setShowAudioInput(true)
              }}
              style={{ backgroundColor: '#E5E5EA' }}
              className="w-full h-[50px] flex items-center rounded-lg pl-3 "
            >
              <div className="bg-black w-8 h-8 rounded-full flex items-center justify-center">
                <img src={microIcon} className="h-4 w-4" />
              </div>
              <div className="ml-2">
                <div className="text-[10px] font-medium">Audio Input</div>
                <div className="text-[8px] text-gray-600">Use your voice to generate the text</div>
              </div>
            </div>
            {/* text input button */}
            <button
              onClick={(e) => {
                e.stopPropagation() // Prevents zoom-out when button is clicked
                setShowNewContent(true)
              }}
              style={{ backgroundColor: '#E5E5EA' }}
              className="w-full h-[50px] flex items-center rounded-lg pl-3 "
            >
              <div className="bg-black w-8 h-8 rounded-full flex items-center justify-center ">
                <img src={textIcon} className="h-4 w-4" alt="Text Icon" />
              </div>
              <div className="ml-2">
                <div className="text-[10px] font-medium">Text Input</div>
                <div className="text-[8px] text-gray-600">Use your voice to generate the text</div>
              </div>
            </button>
          </div>
        </div>
      )}
      {/* Ensure this button is not covered by other elements */}
      <div></div>
    </div>
  )
}

export default Form
