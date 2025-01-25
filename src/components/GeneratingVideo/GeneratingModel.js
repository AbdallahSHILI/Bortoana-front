import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { FaRedo, FaEdit, FaSave, FaTimes } from 'react-icons/fa'
import Start from '../../assests/images/start.png'
import ReactPlayer from 'react-player'
import ScheduleModal from './ScheduleModal'

export default function GeneratingModal({
  show,
  onClose,
  isGeneratingOnly = false,
  videoPath = null,
  onRegenerate
}) {
  const [isGenerating, setIsGenerating] = useState(true)
  const [isScheduleModal, setIsScheduleModal] = useState(false)
  const [videoTitle, setVideoTitle] = useState('Why Do People Watch Other People Play Video Games?')

  // Reset all states when modal is closed
  const handleClose = () => {
    setIsGenerating(true)
    setIsScheduleModal(false) // Reset schedule modal state
    if (typeof onClose === 'function') {
      onClose()
    }
  }

  // Handle schedule modal close separately
  const handleScheduleModalClose = () => {
    setIsScheduleModal(false)
    handleClose() // Close the main modal as well
  }

  // Reset isGenerating when modal is shown
  useEffect(() => {
    if (show) {
      setIsGenerating(true)
    }
  }, [show])

  // Only update isGenerating when videoPath changes and is not null
  useEffect(() => {
    if (videoPath) {
      setIsGenerating(false)
    }
  }, [videoPath])

  if (!show) return null

  const handleModalClick = (e) => {
    e.stopPropagation()
  }

  const handleRegenerate = () => {
    setIsGenerating(true)
    if (typeof onRegenerate === 'function') {
      onRegenerate()
    }
  }

  const handleOpen = () => setIsScheduleModal(true)
  // Function to handle canceling the generating process
  const handleCancelGenerating = async () => {
    try {
      // Call the cancel generation endpoint
      const response = await fetch('http://localhost:5001/api/video/cancel-generating', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (data.success) {
        console.log('Generation cancelled successfully')
        setIsGenerating(false) // Stop the generating state
        onClose() // Close the modal
      } else {
        console.error('Failed to cancel generation:', data.message)
      }
    } catch (error) {
      console.error('Error cancelling generation:', error)
    }
  }

  const extractedFileName = videoPath || ''

  return ReactDOM.createPortal(
    <div
      onClick={isGeneratingOnly ? undefined : handleClose}
      className="inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 fixed"
    >
      <div
        style={{ backgroundColor: '#303030' }}
        className="w-1/2 h-2/4 border border-white rounded-lg flex flex-col items-center justify-center"
      >
        {isGenerating || isGeneratingOnly ? (
          <>
            <div className="loader border-4 border-gray-300 border-t-blue-500 rounded-full w-10 h-10 animate-spin"></div>
            <p className="text-white mt-3 text-sm">Generating your video...</p>
            {/* Cancel Generating Button */}
            <button
              onClick={handleCancelGenerating}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center"
            >
              <FaTimes className="mr-2" /> {/* Cancel icon */}
              Cancel Generating
            </button>
          </>
        ) : (
          <div>
            <div className="inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 fixed">
              <div
                onClick={handleModalClick}
                style={{ backgroundColor: '#303030' }}
                className="border border-white rounded-lg flex flex-col"
              >
                <div className="p-3 text-white flex flex-row items-center justify-between">
                  <div className="text-bold">Video Generated Successfully</div>
                  <div className="flex flex-row space-x-2">
                    <div
                      onClick={handleRegenerate}
                      className="text-xs p-2 bg-[#1A1A1C] hover:bg-slate-600 cursor-pointer rounded-md flex flex-row items-center"
                    >
                      <FaRedo className="mr-2" />
                      Regenerate
                    </div>
                    <div className="text-xs p-2 hover:bg-slate-600 cursor-pointer bg-[#1A1A1C] rounded-md flex flex-row items-center">
                      <FaEdit className="mr-2" />
                      Edit Result
                    </div>
                  </div>
                </div>

                <div className="px-12 pb-2 w-[800px] rounded-xl relative flex items-center justify-center">
                  <ReactPlayer
                    url={extractedFileName}
                    controls={true}
                    width="100%"
                    height="100%"
                    config={{
                      file: {
                        attributes: {
                          crossOrigin: 'anonymous'
                        },
                        forceVideo: true,
                        forceHLS: false,
                        forceDASH: false
                      }
                    }}
                    onError={(e) => console.error('ReactPlayer error:', e)}
                  />
                </div>

                <div className="flex items-center justify-center">
                  <div
                    onClick={handleOpen}
                    className="p-6 m-3 bg-[#0004FF] text-white hover:bg-blue-700 cursor-pointer w-[160px] h-[30px] flex items-center justify-center rounded-md"
                  >
                    Proceed
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {isScheduleModal && (
        <ScheduleModal
          onClose={handleScheduleModalClose}
          videoUrl={videoPath}
          videoTitle={videoTitle}
        />
      )}

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
    document.body
  )
}
