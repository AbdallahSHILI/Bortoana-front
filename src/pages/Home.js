import React, { useState, useEffect } from 'react'
import Header from '../components/Header'
import SideBar from '../components/Home/SideBar'
import JellyVideo from '../assests/videos/videojelly.gif'
import Jellyfish1 from '../assests/images/jellyfish.png'
import imageVideo from '../assests/images/video1.png'
import youtubeIcon from '../assests/images/icons/youtube.png'
import InstagramIcon from '../assests/images/icons/instagram.png'
import whatsup from '../assests/images/icons/whatsup.png'
import X from '../assests/images/icons/x.png'
import Snapchat from '../assests/images/icons/snapchat.png'
import FacebookIcon from '../assests/images/icons/facebook.png'
import JellyFish from '../components/Home/JellyFish'
import Cross from '../assests/images/cross.png'
import { Settings } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

import SettingsForm from '../components/Settings/Settings'
export default function Home() {
  const [isZoomed, setIsZoomed] = useState(false)
  const [isSettingsZoomed, setIsSettingsZoomed] = useState(false)

  return (
    <>
      <div className="h-screen  relative overflow-hidden">
        {/* content */}

        <div className="relative z-10">
          <div className="">
            {!isZoomed && !isSettingsZoomed && (
              <div className="pt-10">
                <Header />
              </div>
            )}
            {/* left screen */}
            <div className=" ">
              {!isZoomed && !isSettingsZoomed && (
                <div className="flex  items-center justify-center flex-col w-60 m-4 absolute bottom-44 left-12 z-20">
                  <img src={imageVideo} alt="Personne" className=" cursor-pointer rounded-full " />

                  <div className=" text-center text-xs text-white z-30">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua.
                  </div>
                </div>
              )}
              {/* end left screen */}
              {/* cross button */}
              {/* Cross Button for Zoom Exit */}
              {isZoomed && (
                <div>
                  <button
                    onClick={() => setIsZoomed(false)}
                    className="absolute top-20 right-48 z-[100] bg-white p-2 rounded-full border border-red-500"
                    aria-label="Close zoom"
                  >
                    <img src={Cross} alt="Close button" className="w-6 h-6" />
                  </button>
                </div>
              )}
              {/* end cross button */}
              <div className="">
                <JellyFish
                  isZoomed={isZoomed}
                  setIsZoomed={setIsZoomed}
                  isSettingsZoomed={isSettingsZoomed}
                  setIsSettingsZoomed={setIsSettingsZoomed}
                />
              </div>
              {!isZoomed && !isSettingsZoomed && (
                <div className="absolute top-32 right-10">
                  <SideBar />
                </div>
              )}
            </div>
          </div>
        </div>
        {/* AnimatePresence ensures smooth entry/exit */}
        <AnimatePresence>
          {isSettingsZoomed && (
            <motion.div
              initial={{ x: '100%', opacity: 0 }} // Initial state
              animate={{ x: 0, opacity: 1 }} // Visible state
              exit={{ x: '100%', opacity: 0 }} // Exit state
              transition={{ duration: 0.5, ease: 'easeInOut' }} // Smooth transition
              className="absolute top-0 right-0 bottom-0 z-40 w-3/5 flexshadow-lg"
            >
              <SettingsForm onClose={() => setIsSettingsZoomed(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
