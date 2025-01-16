import React, { useState } from 'react';
import { FaRedo, FaEdit, FaSave } from 'react-icons/fa';
import Propreties from './Propreties';
import { ArrowLeftIcon } from 'lucide-react';
import AudioPic from "../../assests/images/settings/Audio-Pic.svg"
import RecordVoiceModal from '../../Modal/RecordVoice/recordVoice';

const TranscriptComponent = ({ transcript, onRecordAgain, onClose }) => {
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTranscript, setEditedTranscript] = useState(transcript || '');
  const [showProperties, setShowProperties] = useState(false);

  const handleProceed = () => {
    setShowProperties(true);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleSaveClick = (e) => {
    e.stopPropagation();
    setIsEditing(false);
  };

  const handleTranscriptChange = (e) => {
    setEditedTranscript(e.target.value);
  };

  const handleRecordAgain = () => {
    setShowRecordModal(true);
  };

  const handleSaveRecording = (recordingData) => {
    if (recordingData.transcribedText) {
      setEditedTranscript(prevTranscript => {
        const separator = prevTranscript ? '\n' : '';
        return prevTranscript + separator + recordingData.transcribedText;
      });
    }
    setShowRecordModal(false);
  };

  if (showProperties) {
    return <Propreties />;
  }

  return (
    <div className="ml-16 w-full flex-col">
      <div>
        <img 
          alt="audio visualization" 
          src={AudioPic}
          className="w-[250px]" 
        />
      </div>

      <div className="flex flex-row gap-16">
        <button
          onClick={onClose}
          className="mt-5 top-0 bg-white w-[35px] h-[35px] cursor-pointer rounded-full flex items-center justify-center"
        >
          <ArrowLeftIcon className="w-4 h-5 text-gray-700" />
        </button>

        <div className="w-[530px] h-[190px] rounded-lg p-3 bg-[#7090B033]">
          <div className="flex flex-row justify-between">
            <div>
              <div className="text-white text-xs">Record Bortoana :</div>
              <div className="text-xs text-gray-600">13/09/2023</div>
            </div>
            
            <div className="flex flex-row space-x-2 justify-center items-center">
              <button
                onClick={handleRecordAgain}
                className="w-[80px] h-[15px] bg-slate-950 text-[8px] rounded-sm text-gray-600 flex justify-center items-center cursor-pointer hover:bg-slate-900"
              >
                <FaRedo className="mr-1" />
                Record Again
              </button>
              
              <button
                onClick={handleEditClick}
                className="w-[60px] h-[15px] bg-slate-950 text-[8px] rounded-sm text-gray-600 flex justify-center items-center cursor-pointer hover:bg-slate-900"
              >
                <FaEdit className="mr-1" />
                Edit Text
              </button>
            </div>
          </div>

          <div className="text-white text-xs mt-2">
            {isEditing ? (
              <div className="flex flex-col space-y-2">
                <textarea
                  value={editedTranscript}
                  onChange={handleTranscriptChange}
                  className="text-white text-xs w-full rounded-sm px-2 py-1 bg-gray-800 min-h-[80px] resize-none"
                />
                <div className="flex justify-start">
                  <button
                    onClick={handleSaveClick}
                    className="cursor-pointer text-white bg-blue-500 text-xs rounded-sm px-3 py-1 flex items-center gap-1"
                  >
                    <FaSave className="w-3 h-3" />
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

      <div className="ml-24">
        <button
          onClick={handleProceed}
          className="text-white text-xs w-[100px] h-[35px] rounded-sm mt-2 bg-[#0004FF]"
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
  );
};

export default TranscriptComponent;