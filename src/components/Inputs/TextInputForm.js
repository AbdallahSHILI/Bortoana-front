import { useState, useEffect } from 'react'
import TextPhoto from '../../assests/images/textphoto.png'
import { ArrowLeftIcon } from '@heroicons/react/24/solid'
import Propreties from './Propreties'

const TextInputForm = ({ onClose }) => {
  const [showProperties, setShowProperties] = useState(false)
  const [inputText, setInputText] = useState('')

  // Load saved text on component mount
  useEffect(() => {
    const savedText = localStorage.getItem('lastInputText')
    if (savedText) {
      setInputText(savedText)
    }
  }, [])

  // Update input text and save to localStorage
  const handleInputChange = (e) => {
    const newText = e.target.value
    setInputText(newText)
    localStorage.setItem('lastInputText', newText)
  }

  const handleProceed = (e) => {
    e.stopPropagation()
    setShowProperties(true)
  }

  if (showProperties) {
    return <Propreties description={inputText} onClose={() => setShowProperties(false)} />
  }

  return (
    <div onClick={(e) => e.stopPropagation()} className="p-5 pl-16 text-white w-full">
      <div className="flex space-x-8">
        {/* left side  */}
        <div className="flex flex-col w-1/4">
          <img alt="text Input" src={TextPhoto} className="w-[240px]" />
          <div className="mt-5 bg-white w-[35px] h-[35px] rounded-full flex items-center justify-center">
            <ArrowLeftIcon
              onClick={() => onClose()}
              className="w-4 cursor-pointer h-5 text-gray-700"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex-1 flex items-center border-gray-700">
          <input
            type="text"
            placeholder="Make conversation"
            value={inputText}
            onChange={handleInputChange}
            className="flex-1 bg-transparent outline-none placeholder-gray-500 text-white py-2 text-sm border-b-2"
          />
          {/* Button */}
          <button
            className={`bg-blue-500 text-white rounded w-[80px] h-[30px] ml-3 mr-4 ${
              inputText.length < 2 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
            }`}
            onClick={handleProceed}
            disabled={inputText.length < 2}
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  )
}

export default TextInputForm
