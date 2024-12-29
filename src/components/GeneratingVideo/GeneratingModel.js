import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { FaRedo, FaEdit, FaSave } from 'react-icons/fa'
import Start from '../../assests/images/start.png'
import ReactPlayer from 'react-player'
import Video from '../../assests/videos/edit_test.mp4'
import ScheduleModal from './ScheduleModal'
export default function GeneratingModal({ show, onClose }) {
  const [isGenerating, setIsGenerating] = useState(true)
  const [isSheduleModal, setisSheduleModal] = useState(false)

  // Use useEffect to transition from generating state to final content
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        setIsGenerating(false)
      }, 5000) // Wait for 5 seconds
      return () => clearTimeout(timer) // Cleanup timer on unmount
    }
  }, [show])

  if (!show) return null

  const handleModalClick = (e) => {
    e.stopPropagation() // Prevent click from reaching the backdrop
  }

  const handleOpen = () => {
    setisSheduleModal(true)
  }
  const handleClose = () => {
    setisSheduleModal(false)
  }

  return ReactDOM.createPortal(
    <div
      onClick={onClose}
      className="inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 fixed"
    >
      <div
        style={{ backgroundColor: '#303030' }}
        className="w-1/2 h-2/4 border border-white rounded-lg flex flex-col items-center justify-center"
      >
        {isGenerating ? (
          <>
            <div className="loader border-4 border-gray-300 border-t-blue-500 rounded-full w-10 h-10 animate-spin"></div>
            <p className="text-white mt-3 text-sm">Generating your video...</p>
          </>
        ) : (
          <div>
            <div className="inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 fixed">
              <div
                onClick={handleModalClick}
                style={{ backgroundColor: '#303030' }}
                className="  border border-white rounded-lg flex flex-col"
              >
                <div className="p-3 text-white flex flex-row items-center justify-between ">
                  <div className="text-bold">
                    Why do People watch other people play video game ?
                  </div>
                  <div className="flex flex-row space-x-2">
                    <div className="text-xs p-2 bg-[#1A1A1C] hover:bg-slate-600 cursor-pointer rounded-md flex flex-row items-center">
                      <FaRedo className="mr-2" />
                      Regenerate
                    </div>
                    <div className="text-xs p-2 hover:bg-slate-600 cursor-pointer bg-[#1A1A1C] rounded-md flex flex-row items-center">
                      <FaEdit className="mr-2" />
                      Edit Result
                    </div>
                  </div>
                </div>

                <div className="px-12 pb-2 w-[800px]  rounded-xl relative flex items-center justify-center">
                  {/* Video Image */}
                  <ReactPlayer url={Video} controls width="100%" height="100%" />

                  {/* Start Image (Play Icon) */}
                </div>
                {/* proceed button  */}
                <div className="flex items-center justify-center">
                  <div
                    onClick={handleOpen}
                    className="p-6 m-3 bg-[#0004FF] text-white hover:bg-blue-700 cursor-pointer w-[160px]  h-[30px] flex items-center justify-center rounded-md"
                  >
                    {' '}
                    Proceed{' '}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {isSheduleModal && <ScheduleModal onClose={handleClose} />}
      {/* Loader Styles */}
      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>,
    document.body // Use document.body as the portal container
  )
}
