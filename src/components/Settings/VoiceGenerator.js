import React from 'react'
import { motion } from 'framer-motion'
import person from '../../assests/images/settings/person.png'
import microphone from '../../assests/images/settings/microphone2.png'
import Cross from '../../assests/images/cross.png'
import { FaPlay } from 'react-icons/fa'
const VoiceGenerator = ({ onClose }) => {
  const cards = Array.from({ length: 8 }, (_, index) => ({
    id: index + 1,
    name: `Charles-young adult`,
    photo: person // Placeholder photo URL
  }))

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 ">
      {/* Full-screen background overlay */}
      <motion.div
        className="fixed inset-0 flex flex-col items-center justify-center p-4 sm:p-6 md:p-10 bg-black rounded-lg shadow-lg"
        onClick={onClose} // Close the modal when the background is clicked
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      ></motion.div>

      {/* Modal content */}
      <motion.div
        className="fixed inset-0 flex flex-col bg-black p-10 rounded-lg shadow-lg"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3, type: 'spring', stiffness: 300 }}
      >
        {/* Close button */}
        {/* <button
          onClick={onClose}
          className="absolute top-9 right-20 z-[100] bg-white p-2 rounded-full border border-red-500"
          aria-label="Close modal"
        >
          <img src={Cross} alt="Close button" className="w-6 h-6" />
        </button> */}

        {/* Modal title */}
        <h2 className="text-xl sm:text-lg md:text-5xl lg:text-6xl w-full md:w-4/6 font-bold mb-6 flex items-center justify-center text-gray-300">
          Voices Generator{' '}
        </h2>
        {/* start left audio icon */}
        <div
          className="w-40 sm:w-10 lg:w-52 h-7 sm:h-7 lg:h-56 absolute left-0 rounded-tr-3xl rounded-br-3xl flex items-center justify-center"
          style={{
            background: 'linear-gradient(to right, #E5E5EA, #81818421)'
          }}
        >
          {' '}
          <div className="flex-row ">
            <div className="lg:h-32 lg:w-32 w-8 h-8 sm:w-6 sm:h-6 rounded-full bg-white items-center justify-center flex ">
              <img className="lg:w-20 lg:h-20 sm:w-4 sm:h-4 w-6 h-6" src={microphone} />
            </div>
            <div className="flex items-center justify-center text-white text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mt-0 lg:mt-4 sm:mt-0">
              Audio
            </div>
          </div>
        </div>
        {/* end left audio icon  */}
        {/* Content */}
        <div className="flex-grow text-white  relative ">
          {/* Add your voice selection content here */}
          <div className=" h-full w-5/6 absolute right-0 items-center flex justify-center overflow-y-auto">
            {/*  cards */}
            {/* Cards container */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
              {cards.map((card) => (
                <div
                  style={{ backgroundColor: '#1F1F1F' }}
                  key={card.id}
                  className=" w-full max-w-xs sm:w-48 md:w-56 lg:w-64  h-[35vh] rounded-lg shadow-lg flex flex-col justify-between items-center text-white p-4"
                >
                  {/* Card Content */}
                  <img
                    src={card.photo}
                    alt={card.name}
                    className="w-24 h-24 rounded-full object-cover "
                  />
                  <h3 className="text-md font-bold mb-2">{card.name}</h3>
                  <button className=" text-white bg-white p-1.5 rounded-full flex items-center justify-center">
                    <div className="bg-black p-1 rounded-full ">
                      <FaPlay className="text-[7px]" />
                    </div>
                  </button>
                  <div className="flex gap-2">
                    <button className="bg-blue-700  hover:bg-blue-800 text-white py-1 w-[18vh] rounded-md text-xs">
                      Select
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default VoiceGenerator
