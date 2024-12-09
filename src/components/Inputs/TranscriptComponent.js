import React, { useState, useEffect } from 'react'
import AudioImage from '../../assests/images/inputs/audiotext.png'
import { FaRedo, FaEdit, FaSave } from 'react-icons/fa'
import Propreties from './Propreties'

function TranscriptComponent({ transcript, onRecordAgain }) {
  const [showProperties, setShowProperties] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedTranscript, setEditedTranscript] = useState(transcript)

  const handleProceed = (e) => {
    e.stopPropagation()
    setShowProperties(true)
  }

  if (showProperties) {
    return <Propreties />
  }
  const handleEditClick = (e) => {
    e.stopPropagation()
    setIsEditing(true)
  }
  const handleSaveClick = (e) => {
    e.stopPropagation()
    setIsEditing(false)
    console.log('hiii')
  }
  const handleTranscriptChange = (e) => {
    setEditedTranscript(e.target.value)
  }
  const handelclickedit = (e) => {
    e.stopPropagation()
  }

  return (
    <div className=" ml-16 w-full flex-col  ">
      {/* form  */}

      {/* left side */}
      <div className="">
        <div className="flex ">
          <img src={AudioImage} className="w-[250px]  " />
        </div>
      </div>
      {/* right side */}
      <div className=" flex-col flex items-center justify-center   ">
        {/* buttons */}

        <div
          style={{ backgroundColor: '#7090B033' }}
          className=" w-[530px]  h-[190px] rounded-lg p-3 pr-12 "
        >
          <div className="flex flex-row  justify-between">
            <div>
              <div className="text-white text-xs">Record Borto2ana :</div>
              <div className="text-xs text-gray-600">13/09/2023</div>
            </div>
            <div
              onClick={onRecordAgain}
              className="flex flex-row space-x-2 justify-center items-center"
            >
              <div className="w-[80px] h-[15px] bg-slate-950 text-[8px] rounded-sm text-gray-600 flex justify-center items-center cursor-pointer">
                <FaRedo className="mr-1" />
                Record Again
              </div>
              <div
                onClick={(e) => handleEditClick(e)}
                className="w-[60px] h-[15px] bg-slate-950 text-[8px] rounded-sm text-gray-600 flex justify-center items-center cursor-pointer"
              >
                <FaEdit className="mr-1 cursor-pointer" />
                <div className="cursor-pointer">Edit Text</div>
              </div>
            </div>
          </div>

          {/* Transcript text or input */}
          <div className="text-white text-xs mt-2">
            {isEditing ? (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={editedTranscript}
                  onChange={handleTranscriptChange}
                  onClick={(e) => handelclickedit(e)}
                  className="text-white text-xs w-full rounded-sm px-2 py-1 bg-gray-800"
                />
                <button
                  onClick={(e) => handleSaveClick(e)}
                  className=" cursor-pointer text-white bg-blue-500 text-xs rounded-sm px-2 py-1  z-50 "
                >
                  <FaSave className="mr-1" />
                </button>
              </div>
            ) : (
              <span>{editedTranscript}</span>
            )}
          </div>
          <div></div>
        </div>
      </div>
      {/* button Proceed */}

      <div onClick={handleProceed} className="ml-24">
        <button
          style={{ backgroundColor: '#0004FF' }}
          className="text-white text-xs  w-[100px] h-[35px]  rounded-sm mt-2"
        >
          Proceed
        </button>
      </div>
    </div>
  )
}
export default TranscriptComponent
