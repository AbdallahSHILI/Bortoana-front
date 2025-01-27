import React, { useEffect, useState, useRef } from 'react'
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
  const jellyfishRef = useRef(null)

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth)
    }

    // Add initial resize handler
    handleResize()

    // Add debounced resize listener
    let timeoutId
    const debouncedResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(handleResize, 100)
    }

    window.addEventListener('resize', debouncedResize)
    return () => {
      window.removeEventListener('resize', debouncedResize)
      clearTimeout(timeoutId)
    }
  }, [])

  const handleSettingsClick = (e) => {
    e.stopPropagation()
    setIsSettingsZoomed(!isSettingsZoomed)
  }

  const getSocialMediaIconPositions = () => {
    const baseTransition = 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)'
    const isWideScreen = screenWidth > 1500
    const isExtraWideScreen = screenWidth > 2100

    return {
      instagram: {
        left: '49%',
        top: '49%',
        transition: baseTransition,
        transform:
          isZoomed || isSettingsZoomed
            ? 'translate(-50%, -50%) scale(1.5)'
            : 'translate(-50%, -50%)'
      },
      facebook: {
        left: '42%',
        top: '54%',
        transition: baseTransition,
        transform:
          isZoomed || isSettingsZoomed
            ? 'translate(-50%, -50%) scale(1.5)'
            : 'translate(-50%, -50%)'
      },
      twitter: {
        left: '45%',
        top: '68%',
        transition: baseTransition,
        transform:
          isZoomed || isSettingsZoomed
            ? 'translate(-50%, -50%) scale(1.5)'
            : 'translate(-50%, -50%)'
      },
      linkedin: {
        left: '53%',
        top: '41%',
        transition: baseTransition,
        transform:
          isZoomed || isSettingsZoomed
            ? 'translate(-50%, -50%) scale(1.5)'
            : 'translate(-50%, -50%)'
      },
      rectangle: {
        left: isZoomed
          ? '38%'
          : isExtraWideScreen
            ? '35%' // More to the left on extra wide screens
            : isWideScreen
              ? '37%' // Position for wide screens
              : '34%', // Original position on smaller screens
        top: isZoomed ? '43%' : '20%',
        transition: baseTransition,
        transform:
          isZoomed || isSettingsZoomed
            ? 'translate(-50%, -50%) scale(1.5)'
            : 'translate(-50%, -50%)',
        width: isZoomed
          ? '32%'
          : isExtraWideScreen
            ? '11rem' // Larger width for extra wide screens
            : '8rem',
        height: isZoomed
          ? '40%'
          : isExtraWideScreen
            ? '10rem' // Larger height for extra wide screens
            : '7rem',
        marginTop: isZoomed ? '4rem' : '0'
      },
      settings: {
        left: isSettingsZoomed
          ? '30%'
          : isExtraWideScreen
            ? '45%' // More to the left on extra wide screens
            : isWideScreen
              ? '45%' // Position for wide screens
              : '44%', // Original position on smaller screens
        top: isSettingsZoomed ? '40%' : '20%',
        transition: baseTransition,
        transform:
          isZoomed || isSettingsZoomed
            ? 'translate(-50%, -50%) scale(1.5)'
            : 'translate(-50%, -50%)',
        width: isSettingsZoomed
          ? '32%'
          : isExtraWideScreen
            ? '10rem' // Larger width for extra wide screens
            : '7rem',
        height: isSettingsZoomed
          ? '40%'
          : isExtraWideScreen
            ? '10rem' // Larger height for extra wide screens
            : '7rem',
        marginTop: isSettingsZoomed ? '4rem' : '0'
      }
    }
  }

  const socialMediaIconPositions = getSocialMediaIconPositions()

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
        {/* All social media icons moved here, above jellyfish */}
        {!isZoomed && !isSettingsZoomed && (
          <>
            <FacebookAuth
              style={{
                ...socialMediaIconPositions.facebook,
                pointerEvents: 'auto',
                zIndex: 30
              }}
            />
            <InstagramAuth
              style={{
                ...socialMediaIconPositions.instagram,
                pointerEvents: 'auto',
                zIndex: 30
              }}
            />
            <XAuth
              style={{
                ...socialMediaIconPositions.twitter,
                pointerEvents: 'auto',
                zIndex: 30
              }}
            />
            <LinkedinAuth
              style={{
                ...socialMediaIconPositions.linkedin,
                pointerEvents: 'auto',
                zIndex: 30
              }}
            />
          </>
        )}

        {/* Updated Rectangle - changed z-index to 10 */}
        {!isSettingsZoomed && (
          <div
            onClick={() => setIsZoomed(!isZoomed)}
            className={`transition-all rounded-xl duration-700 fixed flex items-center cursor-pointer justify-center z-10 ${
              isZoomed ? '' : 'hover:bg-white hover:bg-opacity-25'
            }`}
            style={{
              ...socialMediaIconPositions.rectangle,
              borderWidth: '10px',
              borderStyle: 'solid',
              borderImage: isZoomed
                ? 'linear-gradient(to left, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0)) 1'
                : '1',
              pointerEvents: 'auto' // Add this to ensure clickability
            }}
          >
            {isZoomed && <Form onClose={() => setIsZoomed(false)} />}
          </div>
        )}

        {/* Updated Settings Icon */}
        {!isZoomed && (
          <div
            style={{
              position: 'fixed',
              ...socialMediaIconPositions.settings,
              zIndex: 10,
              pointerEvents: 'auto'
            }}
            className="transition-all duration-700"
            onClick={(e) => handleSettingsClick(e)}
          >
            {isSettingsZoomed ? (
              <img src={SettingsIcon} alt="Settings" className="w-full h-full cursor-pointer" />
            ) : (
              <Cog6ToothIcon className="w-full h-full cursor-pointer text-white hover:text-opacity-70" />
            )}
          </div>
        )}

        {/* Updated Jellyfish positioning with larger size for wide screens */}
        {/*First for settings at translate*/}
        {/*second for rectangle at translate */}
        <div
          className="absolute left-[45%] top-[40%] z-20"
          ref={jellyfishRef}
          style={{
            transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
            transform:
              isZoomed || isSettingsZoomed
                ? `${
                    isSettingsZoomed
                      ? 'translate(-70%, 18%) scale(1.5)'
                      : 'translate(-10%, 10%) scale(1.1)'
                  }`
                : `translate(-50%, -50%) scale(${screenWidth > 2100 ? 0.9 : 0.75})`,
            pointerEvents: 'none'
          }}
        >
          <img
            src={JellyFishImage}
            alt="Jellyfish"
            className="max-w-none"
            style={{
              width: screenWidth > 2100 ? 'min(1500px, 90vw)' : 'min(1300px, 80vw)',
              height: screenWidth > 2100 ? '900px' : '800px',
              objectFit: 'contain',
              maxHeight: '80vh',
              transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
              pointerEvents: 'none',
              z: 20
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default JellyFish
