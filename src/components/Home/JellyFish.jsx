import React, { useState } from 'react'
import Form from '../Inputs/Form' // Adjust the path as necessary
import JellyFishImage from '../../assests/images/c.png'
import SettingsIcon from '../../assests/images/settings/setting.png'
import SettingsBoldIcon from '../../assests/images/settings/settingbold.png'
import InstagramAuth from '../AuthIcons/InstagramAuth'
import LinkedInIcon from '../../assests/images/settings/LinkedIn_Icon.svg'
import PinterestIcon from '../../assests/images/settings/Pinterest_Icon.svg'
import SnapchatIcon from '../../assests/images/settings/snapchatIcon.svg'
import TwitterIcon from '../../assests/images/settings/X_Icon.svg'
import CalendarIcon from '../../assests/images/settings/CalendarIcon.svg'
import { Link } from 'react-router-dom'
const JellyFish = ({ isZoomed, setIsZoomed, isSettingsZoomed, setIsSettingsZoomed }) => {
  const [isHovered, setIsHovered] = useState(false)

  const handleSettingsClick = (e) => {
    e.stopPropagation()
    setIsSettingsZoomed(!isSettingsZoomed)
  }

  return (
    <div
      className={`flex justify-center w-full items-center h-screen bg-black overflow-hidden transition-transform duration-700 ${
        isZoomed || isSettingsZoomed ? 'scale-150' : 'scale-100'
      }`}
      style={{
        transformOrigin: 'center'
      }}
    >
      {/* Rectangle for zoom effect, only show if isSettingsZoomed is false */}
      {!isSettingsZoomed && (
        <div
          onClick={() => setIsZoomed(!isZoomed)}
          className={`transition-all rounded-xl duration-700 ${
            isZoomed ? 'w-2/4 h-2/4 fixed' : 'w-28 h-24 fixed'
          } flex items-center cursor-pointer hover:bg-white hover:bg-opacity-25 justify-center z-20`}
          style={{
            top: isZoomed ? '13%' : '70px',
            left: isZoomed ? '13%' : '650px',
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
            zIndex: isSettingsZoomed ? 20 : 50 // Set z-index dynamically based on isZoomed
          }}
          className={`absolute w-20 h-20 top-16 left-[calc(650px + 5rem)]  transition-transform duration-700 ${
            isSettingsZoomed ? 'scale-[3]  -translate-x-[39vw] translate-y-[9vh]' : ''
          }`}
          onMouseEnter={() => setIsHovered(true)} // Hover effect starts
          onMouseLeave={() => setIsHovered(false)} // Hover effect ends
        >
          <img
            src={isHovered ? SettingsBoldIcon : SettingsIcon} //Swap icons based on hover state
            alt="Settings"
            className="w-20 h-20 cursor-pointer ml-[95%] mt-8 z-50"
            onClick={(e) => handleSettingsClick(e)}
          />
        </div>
      )}

      {/* Jellyfish image with zoom and translate effect */}
      <div
        className={`absolute flex  justify-center items-center transition-transform duration-700 ${
          isZoomed || isSettingsZoomed
            ? `scale-150 ${
                isSettingsZoomed
                  ? '-translate-x-[19vw] translate-y-[37vh]' // New translation when settings button is clicked
                  : 'translate-x-[19vw] translate-y-[37vh]'
              }`
            : 'scale-100 fixed'
        } z-30`}
        style={{
          top: isZoomed ? 'bottom right' : '80px',
          left: isZoomed ? 'bottom right' : '660px'
        }}
      >
        <InstagramAuth />
        <Link to="/twitter-test">
          <img
            src={TwitterIcon}
            alt="Twitter"
            className="absolute top-23 left-0 w-12 h-12 z-30"
            onClick={() => setIsSettingsZoomed(false)}
          />
        </Link>
        <Link to="/linkedIn-test">
          <img
            src={LinkedInIcon}
            alt="LinkedIn"
            className="absolute top-17 left-14 w-12 h-12 z-30"
            onClick={() => setIsSettingsZoomed(false)}
          />
        </Link>
        <Link to="/pinterest-login">
          <img
            src={PinterestIcon}
            alt="Pinterest"
            className="absolute top-19 left-24 w-12 h-12 z-30"
            onClick={() => setIsSettingsZoomed(false)}
          />
        </Link>
        <Link to="/snapchat-login">
          <img
            src={SnapchatIcon}
            alt="Snapchat"
            className="absolute top-10 left-15 w-12 h-12 z-30"
            onClick={() => setIsSettingsZoomed(false)}
          />
        </Link>
        <Link to="/twitter-schedule">
          <img
            src={CalendarIcon}
            alt="CalendarIcon"
            className="absolute top-18 left-0 w-12 h-12 z-30"
            onClick={() => setIsSettingsZoomed(false)}
          />
        </Link>
        <img
          src={JellyFishImage}
          alt="Jellyfish"
          className={`transition-opacity  duration-700 ${
            isZoomed || isSettingsZoomed ? 'opacity-100' : 'opacity-100'
          }`}
        />

        {/* Button positioned at the top-left of the jellyfish */}
        <button
          className="absolute top-16 left-10 w-12 h-12 z-30"
          onClick={() => setIsZoomed(true)}
          style={{ backgroundColor: '', border: 'none' }}
          aria-label="Jellyfish head"
        />
      </div>
    </div>
  )
}

export default JellyFish
