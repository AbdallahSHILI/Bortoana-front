import React, { useState } from 'react'
import PropertiesImage from '../../assests/images/inputs/proptext.png'
import GeneratingModal from '../GeneratingVideo/GeneratingModel'

export default function Properties() {
  const [showModal, setShowModal] = useState(false)

  const handleInputChange = (e) => {
    e.stopPropagation()
    e.preventDefault()
  }

  const handleSelectChange = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }
  const handleInputFocus = (e) => {
    e.stopPropagation()
  }

  const handleSelectFocus = (e) => {
    e.stopPropagation()
  }
  const handelClickInput = (e) => {
    e.stopPropagation()
    console.log('hello from input')
  }

  const handleGenerateClick = (e) => {
    e.stopPropagation()
    setShowModal(true)
    // Simulate a loader delay
    // setTimeout(() => {
    //   setShowModal(false); // Close the modal after 3 seconds
    // }, 3000);
  }
  return (
    <div className="">
      <img src={PropertiesImage} className="w-[300px] ml-20" />

      {/* Form */}
      <div className=" w-[480px]  ml-28  p-4">
        <div className="text-xs text-white mb-2">Select your video category</div>
        <input
          type="text"
          placeholder="#category"
          className="w-full h-8 p-2  bg-transparent  border-white border-2 text-gray-700 rounded  placeholder:text-[10px] z-50"
          onChange={handleInputChange}
          onClick={(e) => handelClickInput(e)}
          style={{ fontSize: '16px !important' }}
        />
        <div className="text-xs text-white mb-2">Select your video type</div>
        <input
          type="text"
          placeholder="#example"
          className="w-full h-8 p-2  bg-transparent   border-white border-2 text-gray-700 rounded placeholder:text-[10px] z-50"
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={(e) => e.stopPropagation()}
          onClick={(e) => handelClickInput(e)}
          style={{ fontSize: '16px !important' }}
        />
        <div className="text-xs text-white mb-2">Select video language</div>
        <select
          onClick={(e) => e.stopPropagation()}
          onChange={handleSelectChange}
          style={{ fontSize: '0.60rem' }}
          className="w-full h-8 p-2 text-sm bg-transparent border-white border-2 text-gray-700 rounded placeholder:text-[10px]"
        >
          <option value="" disabled selected className="text-xs">
            Select language
          </option>
          <option value="english">English</option>
          <option value="spanish">Spanish</option>
          <option value="french">French</option>
          <option value="german">German</option>
          <option value="chinese">Chinese</option>
        </select>
      </div>
      {/*  generate button  */}
      <div>
        <div
          onClick={(e) => handleGenerateClick(e)}
          className="rounded-sm text-white w-[70px] h-[25px] ml-32 text-[9px] font-bold bg-blue-500 flex items-center justify-center"
        >
          Generate
        </div>
      </div>

      {/* Modal */}

      <GeneratingModal show={showModal} onClose={() => setShowModal(false)} />
    </div>
  )
}
