import React, { useState } from 'react'
import Form from '../Inputs/Form' // Adjust the path as necessary
import JellyFishImage from '../../assests/images/c.svg'
import InstagramAuth from '../AuthIcons/InstagramAuth'
import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import SettingsIcon from '../../assests/images/Settings.svg'
import FacebookAuth from '../AuthIcons/FacebookAuth'
import XAuth from '../AuthIcons/TwitterAuth'
import LinkedinAuth from '../AuthIcons/Linkedin'
const JellyFish = ({ isZoomed, setIsZoomed, isSettingsZoomed, setIsSettingsZoomed }) => {
  const [isHovered, setIsHovered] = useState(false)

  const handleSettingsClick = (e) => {
    e.stopPropagation()
    setIsSettingsZoomed(!isSettingsZoomed)
  }

  return (
    <div
      className={`flex justify-center w-full  items-center h-screen   transition-transform duration-700 ${
        isZoomed || isSettingsZoomed ? 'scale-150' : 'scale-100'
      }`}
      style={{
        transformOrigin: 'center'
      }}
    >
      <div className="">
        {/* Rectangle for zoom effect, only show if isSettingsZoomed is false */}
        {!isSettingsZoomed && (
          <div
            onClick={() => setIsZoomed(!isZoomed)}
            className={`transition-all rounded-xl  duration-700 ${
              isZoomed
                ? 'w-2/4 h-2/4 mt-16 fixed '
                : 'hover:bg-white hover:bg-opacity-25 w-28 h-24 fixed'
            } flex items-center cursor-pointer  justify-center z-20`}
            style={{
              top: isZoomed ? '13%' : '48px',
              left: isZoomed ? '13%' : '490px',
              borderWidth: '10px',
              borderStyle: 'solid',
              borderImage: isZoomed
                ? 'linear-gradient(to left, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0)) 1'
                : '1 '
            }}
          >
            {isZoomed && <Form onClose={() => setIsZoomed(false)} />}
          </div>
        )}

        {/* Settings Icon, only show if isZoomed is false */}
        {!isZoomed && (
          <div
            style={{
              zIndex: 20 // Set z-index dynamically based on isZoomed
            }}
            className={`absolute w-20 h-20 top-16 left-[calc(650px + 5rem)]  transition-transform duration-700 ${
              isSettingsZoomed
                ? 'scale-[4]  -translate-x-[19vw] translate-y-[28vh]'
                : '-translate-x-[9vw] translate-y-[1vh]'
            }`}
            onMouseEnter={() => setIsHovered(true)} // Hover effect starts
            onMouseLeave={() => setIsHovered(false)} // Hover effect ends
          >
            {isSettingsZoomed ? (
              <img
                src={SettingsIcon} //Swap icons based on hover state
                alt="Settings"
                className={`w-20 h-20 cursor-pointer text-white  hover:text-opacity-70 `}
                onClick={(e) => handleSettingsClick(e)}
              />
            ) : (
              <Cog6ToothIcon
                alt="Settings"
                className={`w-24 h-24 cursor-pointer text-white    z-50 ${isSettingsZoomed ? ' text-[#C0C0C0]' : ''}`}
                onClick={(e) => handleSettingsClick(e)}
              />
            )}
          </div>
        )}
        <div>
          {/* Jellyfish image with zoom and translate effect */}
          <div
            className={`absolute  justify-center items-center transition-transform duration-700 ${
              isZoomed || isSettingsZoomed
                ? ` ${
                    isSettingsZoomed
                      ? '-translate-x-[12vw] scale-[150%] translate-y-[44vh] '
                      : 'translate-x-[28vw] translate-y-[53vh] scale-[140%]'
                  }`
                : ' scale-75  '
            } z-30`}
            style={{
              top: isZoomed ? 'bottom right' : '0px',
              left: isZoomed ? 'bottom right' : '280px'
            }}
          >
            {/* Rectangle Hiden button */}
            <button
              className={`Rectangle absolute rounded-lg left-[159px] -top-2 hover:bg-white hover:bg-opacity-25 w-36 h-28 z-[50] ${
                isZoomed || isSettingsZoomed ? ' hidden' : 'block'
              }`}
              onClick={() => setIsZoomed(true)}
              style={{ backgroundColor: '', border: 'none' }}
              aria-label="Jellyfish head"
            />
            {/* Settings Hiden button */}
            <Cog6ToothIcon
              className={`Settings absolute left-[320px] top-3 rounded-full cursor-pointer  text-transparent  hover:text-gray-400 hover:text-opacity-50  w-32 h-32 z-[50] ${
                isZoomed || isSettingsZoomed ? ' hidden' : 'block'
              }`}
              onClick={() => setIsSettingsZoomed(true)}
              style={{ backgroundColor: '', border: 'none' }}
              aria-label="Jellyfish head"
            />
            <img
              src={JellyFishImage}
              alt="Jellyfish"
              className={`transition-opacity  max-h-full lg:h-[500px] lg:w-auto duration-700 ${
                isZoomed || isSettingsZoomed ? 'opacity-100' : 'opacity-100'
              }`}
            />

            {/* Button positioned at the top-left of the jellyfish */}
          </div>
        </div>
        {!isZoomed && !isSettingsZoomed && <InstagramAuth />}
        {!isZoomed && !isSettingsZoomed && <FacebookAuth />}
        {!isZoomed && !isSettingsZoomed && <XAuth />}
        {!isZoomed && !isSettingsZoomed && <LinkedinAuth />}
      </div>
    </div>
  )
}

export default JellyFish
