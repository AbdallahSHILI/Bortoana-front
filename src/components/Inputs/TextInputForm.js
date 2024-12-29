import { useState } from 'react'
import TextPhoto from '../../assests/images/textphoto.png'
import { ArrowLeftIcon } from '@heroicons/react/24/solid'
import Propreties from './Propreties'

const TextInputForm = ({ onClose }) => {
  const [showProperties, setShowProperties] = useState(false)

  const handleProceed = (e) => {
    e.stopPropagation()
    setShowProperties(true)
  }

  if (showProperties) {
    return <Propreties />
  }

  return (
    <div onClick={(e) => e.stopPropagation()} className="p-5 pl-16 text-white w-full">
      <div className="flex space-x-8 ">
        {/* left side  */}
        <div className="flex flex-col  w-1/4">
          <img alt="text Input" src={TextPhoto} className="w-[240px]" />
          <div className="mt-5 bg-white w-[35px] h-[35px] rounded-full flex items-center justify-center">
            <ArrowLeftIcon
              onClick={() => onClose()}
              className="w-4 cursor-pointer h-5 text-gray-700"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex-1 flex items-center  border-gray-700  ">
          <input
            type="text"
            placeholder="Make conversation"
            className="flex-1 bg-transparent outline-none placeholder-gray-500 text-white py-2 text-sm border-b-2 "
          />
          {/* Button */}
          <button
            className="bg-blue-500 text-white rounded w-[80px] h-[30px] ml-3 mr-4  absolute  right-2   "
            onClick={handleProceed} // Or any other function you want to trigger
          >
            Proceed
          </button>

          <div className=""></div>
        </div>
      </div>
    </div>
  )
}

export default TextInputForm
