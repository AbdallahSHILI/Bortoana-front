import React, { useEffect, useState } from 'react'
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
  const [screenWidth, setScreenWidth] = useState(window.innerWidth)

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleSettingsClick = (e) => {
    e.stopPropagation()
    setIsSettingsZoomed(!isSettingsZoomed)
  }

  const jellyfishSize = screenWidth >= 1600 ? 700 : 500 // Adjust size based on screen width

  // Function to calculate the rectangle's position based on screen width
  const getRectanglePosition = (width) => {
    if (width >= 1600) {
      return { left: '600px', top: '90px' } // Adjust for larger screens
    } else {
      return { left: '490px', top: '48px' } // Default for smaller screens
    }
  }

  // Function to calculate the Settings Icon's position based on screen width
  const getSettingPosition = (width) => {
    if (width >= 1600) {
      return { left: 'calc(880px + 3rem)', top: '100px' } // Adjust for larger screens
    } else {
      return { left: 'calc(680px + 5rem)', top: '54px' } // Default for smaller screens
    }
  }

  // Function to calculate the Rectangle Hidden button's position based on screen width
  const getRectangleButtonPosition = (width) => {
    if (width >= 1600) {
      return { left: '250px', top: '10px' } // Adjust for larger screens (move right and bottom)
    } else {
      return { left: '160px', top: '-9px' } // Default for smaller screens
    }
  }

  const getSettingButtonPosition = (width) => {
    if (width >= 1600) {
      return { left: '463px', top: '30px' } // Adjust for larger screens (move right and bottom)
    } else {
      return { left: '334px', top: '-3px' } // Default for smaller screens
    }
  }

  const rectanglePosition = getRectanglePosition(screenWidth)
  const settingPosition = getSettingPosition(screenWidth)
  const rectangleButtonPosition = getRectangleButtonPosition(screenWidth)
  const settingButtonPosition = getSettingButtonPosition(screenWidth) // Add this line

  return (
    <div
      className={`flex justify-center w-full items-center h-screen transition-transform duration-700 ${
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
            className={`transition-all rounded-xl duration-700 ${
              isZoomed
                ? 'w-2/4 h-2/4 mt-16 fixed'
                : 'hover:bg-white hover:bg-opacity-25 w-28 h-24 fixed'
            } flex items-center cursor-pointer justify-center z-20`}
            style={{
              top: isZoomed ? '13%' : rectanglePosition.top, // Use dynamic top position
              left: isZoomed ? '13%' : rectanglePosition.left, // Use dynamic left position
              borderWidth: '10px',
              borderStyle: 'solid',
              borderImage: isZoomed
                ? 'linear-gradient(to left, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0)) 1'
                : '1'
            }}
          >
            {isZoomed && <Form onClose={() => setIsZoomed(false)} />}
          </div>
        )}

        {/* Settings Icon, only show if isZoomed is false */}
        {!isZoomed && (
          <div
            style={{
              zIndex: 20, // Set z-index dynamically based on isZoomed
              left: settingPosition.left, // Use dynamic left position
              top: settingPosition.top // Use dynamic top position
            }}
            className={`absolute w-20 h-20 transition-transform duration-700 ${
              isSettingsZoomed
                ? 'scale-[4] -translate-x-[19vw] translate-y-[28vh]'
                : '-translate-x-[9vw] translate-y-[1vh]'
            }`}
            onMouseEnter={() => setIsHovered(true)} // Hover effect starts
            onMouseLeave={() => setIsHovered(false)} // Hover effect ends
          >
            {isSettingsZoomed ? (
              <img
                src={SettingsIcon} // Swap icons based on hover state
                alt="Settings"
                className={`w-20 h-20 cursor-pointer text-white hover:text-opacity-70`}
                onClick={(e) => handleSettingsClick(e)}
              />
            ) : (
              <Cog6ToothIcon
                alt="Settings"
                className={`w-24 h-24 cursor-pointer text-white z-50 ${
                  isSettingsZoomed ? 'text-[#C0C0C0]' : ''
                }`}
                onClick={(e) => handleSettingsClick(e)}
              />
            )}
          </div>
        )}
        <div>
          {/* Jellyfish image with zoom and translate effect */}
          <div
            className={`absolute justify-center items-center transition-transform duration-700 ${
              isZoomed || isSettingsZoomed
                ? ` ${
                    isSettingsZoomed
                      ? '-translate-x-[10vw] 2xl:-translate-x-[9vw] scale-[150%] 2xl:scale-[140%] translate-y-[44vh]'
                      : 'translate-x-[30vw] translate-y-[53vh] scale-[135%]'
                  }`
                : 'scale-75 '
            } z-30`}
            style={{
              top: isZoomed ? 'bottom right' : '0px',
              left: isZoomed ? 'bottom right' : '280px'
            }}
          >
            {/* Rectangle Hidden button */}
            <button
              className={`Rectangle absolute rounded-lg hover:bg-white hover:bg-opacity-25 w-36 h-28 z-[50] ${
                isZoomed || isSettingsZoomed ? 'hidden' : 'block'
              }`}
              onClick={() => setIsZoomed(true)}
              style={{
                backgroundColor: '',
                border: 'none',
                left: rectangleButtonPosition.left, // Use dynamic left position
                top: rectangleButtonPosition.top // Use dynamic top position
              }}
              aria-label="Jellyfish head"
            />
            {/* Settings Hidden button */}
            <Cog6ToothIcon
              className={`Settings absolute rounded-full cursor-pointer text-transparent hover:text-gray-400 hover:text-opacity-50 w-32 h-32 z-[50] ${
                isZoomed || isSettingsZoomed ? 'hidden' : 'block'
              }`}
              onClick={() => setIsSettingsZoomed(true)}
              style={{
                backgroundColor: '',
                border: 'none',
                left: settingButtonPosition.left, // Add this
                top: settingButtonPosition.top // Add this
              }}
              aria-label="Jellyfish head"
            />
            <img
              src={JellyFishImage}
              alt="Jellyfish"
              className="transition-opacity duration-700 opacity-100"
              style={{ height: `${jellyfishSize}px`, width: 'auto' }}
            />
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
