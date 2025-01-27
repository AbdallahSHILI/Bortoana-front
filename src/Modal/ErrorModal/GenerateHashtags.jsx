import React from 'react'
import sorryIcon from 'assets/settings/sorryIcon' // Adjust the import path as needed

const GenerateHashtags = () => {
  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-70">
      {/* Modal Container */}
      <div
        className="bg-[#303030] rounded-xl border border-[#3A3A3A] p-8 max-w-md w-full mx-4"
        style={{ boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)' }}
      >
        {/* Icon */}
        <div className="flex justify-center">
          <img src={sorryIcon} alt="Sorry Icon" className="w-16 h-16" />
        </div>

        {/* Heading */}
        <h1 className="text-white text-2xl font-bold text-center mt-4">Hold on a moment!</h1>

        {/* Description */}
        <p className="text-gray-400 text-center mt-2">
          To generate hashtags with AI, you first need to set up your niche. Let's get that done to
          ensure the best results!
        </p>

        {/* Button */}
        <div className="flex justify-center mt-6">
          <button
            className="px-6 py-2 rounded-lg text-white font-semibold"
            style={{ backgroundColor: '#0004FF' }}
          >
            Set up my Nich
          </button>
        </div>
      </div>
    </div>
  )
}

export default GenerateHashtags
