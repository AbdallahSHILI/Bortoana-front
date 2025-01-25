import React, { useState } from 'react'
import { FaRedo, FaEdit, FaSave } from 'react-icons/fa'
import Propreties from './Propreties'
import { ArrowLeftIcon } from 'lucide-react'
import AudioPic from '../../assests/images/settings/Audio-Pic.svg'
import RecordVoiceModal from '../../Modal/RecordVoice/recordVoice'

const TranscriptComponent = ({ transcript, onRecordAgain, onClose }) => {
  const [showRecordModal, setShowRecordModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedTranscript, setEditedTranscript] = useState(transcript || '')
  const [showProperties, setShowProperties] = useState(false)

  const handleProceed = () => {
    setShowProperties(true)
  }

  const handleEditClick = (e) => {
    e.stopPropagation()
    setIsEditing(true)
  }

  const handleSaveClick = (e) => {
    e.stopPropagation()
    setIsEditing(false)
  }

  const handleTranscriptChange = (e) => {
    setEditedTranscript(e.target.value)
  }

  const handleRecordAgain = () => {
    setShowRecordModal(true)
  }

  const handleSaveRecording = (recordingData) => {
    if (recordingData.transcribedText) {
      setEditedTranscript((prevTranscript) => {
        const separator = prevTranscript ? '\n' : ''
        return prevTranscript + separator + recordingData.transcribedText
      })
    }
    setShowRecordModal(false)
  }

  if (showProperties) {
    return <Propreties description={editedTranscript} onClose={() => setShowProperties(false)} />
  }

  return (
    <div className="ml-8 w-full flex-col">
      <div>
        <img alt="audio visualization" src={AudioPic} className="w-[180px]" />
      </div>

      <div className="flex flex-row gap-8">
        <button
          onClick={onClose}
          className="mt-3 top-0 bg-white w-[28px] h-[28px] cursor-pointer rounded-full flex items-center justify-center"
        >
          <ArrowLeftIcon className="w-3 h-4 text-gray-700" />
        </button>

        <div className="w-[400px] h-[150px] rounded-lg p-2 bg-[#7090B033] smaller-1610:w-[250px]  smaller-1610:h-[120px]">
          <div className="flex flex-row justify-between">
            <div>
              <div className="text-white text-[10px]">Record Bortoana :</div>
              <div className="text-[10px] text-gray-600">
                {' '}
                {new Date().toLocaleDateString('en-GB')}
              </div>
            </div>

            <div className="flex flex-row space-x-2 justify-center items-center">
              <button
                onClick={handleRecordAgain}
                className="w-[60px] h-[12px] bg-slate-950 text-[6px] rounded-sm text-gray-600 flex justify-center items-center cursor-pointer hover:bg-slate-900"
              >
                <FaRedo className="mr-1 w-2 h-2" />
                Record Again
              </button>

              <button
                onClick={handleEditClick}
                className="w-[45px] h-[12px] bg-slate-950 text-[6px] rounded-sm text-gray-600 flex justify-center items-center cursor-pointer hover:bg-slate-900"
              >
                <FaEdit className="mr-1 w-2 h-2" />
                Edit Text
              </button>
            </div>
          </div>

          <div className="text-white text-[10px] mt-2">
            {isEditing ? (
              <div className="flex flex-col space-y-2">
                <textarea
                  value={editedTranscript}
                  onChange={handleTranscriptChange}
                  className="text-white text-[10px] w-full rounded-sm px-2 py-1 bg-gray-800 min-h-[60px] resize-none"
                />
                <div className="flex justify-start">
                  <button
                    onClick={handleSaveClick}
                    className="cursor-pointer text-white bg-blue-500 text-[10px] rounded-sm px-2 py-1 flex items-center gap-1"
                  >
                    <FaSave className="w-2 h-2" />
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="whitespace-pre-wrap">{editedTranscript}</div>
            )}
          </div>
        </div>
      </div>

      <div className="ml-16">
        <button
          onClick={handleProceed}
          className={`text-white text-[10px] w-[80px] h-[25px] rounded-sm mt-2 bg-[#0004FF] ${
            editedTranscript.length < 2 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={editedTranscript.length < 2}
        >
          Proceed
        </button>
      </div>

      {showRecordModal && (
        <RecordVoiceModal
          isOpen={showRecordModal}
          onClose={() => setShowRecordModal(false)}
          onSave={handleSaveRecording}
        />
      )}
    </div>
  )
}

export default TranscriptComponent
