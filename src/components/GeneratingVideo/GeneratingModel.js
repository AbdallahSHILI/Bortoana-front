import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { FaRedo, FaEdit, FaSave } from 'react-icons/fa'
import Video from '../../assests/images/video2.png'
import Start from '../../assests/images/start.png'
<<<<<<< HEAD

=======
>>>>>>> origin/develop
export default function GeneratingModal({ show, onClose }) {
  const [isGenerating, setIsGenerating] = useState(true)

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

  return ReactDOM.createPortal(
    <div className="inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 fixed">
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
                style={{ backgroundColor: '#303030' }}
                className="w-1/2 h-2/4  border border-white rounded-lg flex flex-col"
              >
                <div className="p-3 text-white flex flex-row items-center justify-between ">
                  <div className="text-bold">
                    Why do People watch other people play video game ?
                  </div>
                  <div className="flex flex-row space-x-2">
                    <div
                      style={{ backgroundColor: '#1A1A1C' }}
                      className="text-xs p-1 rounded-md flex flex-row items-center"
                    >
                      <FaRedo className="mr-2" />
                      Regenerate
                    </div>
                    <div
                      style={{ backgroundColor: '#1A1A1C' }}
                      className="text-xs p-1 rounded-md flex flex-row items-center"
                    >
                      <FaEdit className="mr-2" />
                      Edit Result
                    </div>
                  </div>
                </div>

                <div className="relative flex items-center justify-center">
                  {/* Video Image */}
                  <img className="w-[785px] h-[255px]" src={Video} alt="Video Thumbnail" />

                  {/* Start Image (Play Icon) */}
                  <img className="absolute inset-0 mx-auto my-auto" src={Start} alt="Play Icon" />
                </div>
                {/* proceed button  */}
                <div className="flex items-center justify-center">
                  <div className="p-6 bg-blue-600 w-[160px]  h-[30px] flex items-center justify-center rounded-md">
                    {' '}
                    Proceed{' '}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

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
