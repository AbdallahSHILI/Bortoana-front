import React, { useState } from 'react'
import InputText from '../../assests/images/imput.png'
import microIcon from '../../assests/images/microphone.png'
import textIcon from '../../assests/images/text.png'
import TextInputForm from './TextInputForm'
import AudioInputForm from './AudioInputForm'

const Form = ({ onClose }) => {
  const [showNewContent, setShowNewContent] = useState(false)
  const [showAudiInput, setShowAudioInput] = useState(false)

  return (
    <div
      onClick={(e) => {
        e.stopPropagation()
      }}
      className="absolute z-[1000] cursor-default inset-0 bg- transition-opacity duration-500 opacity-100"
    >
      {showNewContent ? (
        <TextInputForm onClose={() => setShowNewContent(false)} />
      ) : showAudiInput ? (
        <AudioInputForm onClose={() => setShowAudioInput(false)} />
      ) : (
        <div className="flex flex-row w-full max-1350:flex-col">
          <div className="w-2/4 max-1350:w-full">
            <img alt="Input text" className="w-[200px] h-[80px] ml-8 -mt-2" src={InputText} />
            <div className="ml-8 p-4 text-white text-[8px] w-[200px] text-center overflow-hidden -m-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
            </div>
          </div>
          <div className="flex flex-col gap-2 py-4 w-full px-4 max-1350:flex-col">
            {/* audio input button */}
            <div
              onClick={(e) => {
                e.stopPropagation()
                setShowAudioInput(true)
              }}
              style={{ backgroundColor: '#E5E5EA' }}
              className="w-full h-[40px] cursor-pointer flex items-center rounded-lg pl-2"
            >
              <div className="bg-black w-6 h-6 rounded-full flex items-center justify-center">
                <img alt="Mic Icon" src={microIcon} className="h-3 w-3" />
              </div>
              <div className="ml-2">
                <div className="text-[8px] font-medium">Audio Input</div>
                <div className="text-[6px] text-gray-600">Use your voice to generate the text</div>
              </div>
            </div>
            {/* text input button */}
            <div
              onClick={(e) => {
                e.stopPropagation()
                setShowNewContent(true)
              }}
              style={{ backgroundColor: '#E5E5EA' }}
              className="w-full h-[40px] flex items-center rounded-lg pl-2 cursor-pointer relative z-[1000]"
            >
              <div className="bg-black w-6 h-6 rounded-full flex items-center justify-center">
                <img alt="Text Icon" src={textIcon} className="h-3 w-3" />
              </div>
              <div className="ml-2 text-start">
                <div className="text-[8px] font-medium">Text Input</div>
                <div className="text-[6px] text-gray-600">Use your voice to generate the text</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Form
