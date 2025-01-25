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
import BortanaVideo from '../Modal/BortoanaVideo/bortanaVideo'
import Cookies from 'js-cookie'

export default function Home() {
  // Original state
  const [isZoomed, setIsZoomed] = useState(false)
  const [isSettingsZoomed, setIsSettingsZoomed] = useState(false)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)

  // New state for user data management
  const [userData, setUserData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const videoUrl =
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4'

  // Function to process avatar URL
  const getAvatarUrl = (avatarPath) => {
    if (!avatarPath) return null
    if (avatarPath.startsWith('http')) return avatarPath
    const normalizedPath = avatarPath.startsWith('/') ? avatarPath : `/${avatarPath}`
    return `http://localhost:5001${normalizedPath}`
  }

  // Function to fetch user data
  const fetchUserData = async () => {
    try {
      const userId = Cookies.get('userId')
      if (!userId) {
        throw new Error('No user ID found in cookies')
      }

      const response = await fetch(`http://localhost:5001/api/user/getuser/${userId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${Cookies.get('google_token')}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Failed to fetch user data')
      }

      const data = await response.json()
      if (data.success) {
        const processedUserData = {
          ...data.data,
          avatar: getAvatarUrl(data.data.avatar)
        }
        setUserData(processedUserData)
        // Store in localStorage for persistence
        window.localStorage.setItem('userData', JSON.stringify(processedUserData))
      } else {
        throw new Error(data.message)
      }
    } catch (err) {
      console.error('Error fetching user data:', err)
      setError(err.message)
      // Try to load from localStorage as fallback
      const storedData = window.localStorage.getItem('userData')
      if (storedData) {
        setUserData(JSON.parse(storedData))
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Function to refresh user data (can be passed to children)
  const refreshUserData = () => {
    fetchUserData()
  }

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData()
  }, [])

  return (
    <>
      <div className="h-screen relative overflow-hidden">
        {/* content */}
        <div className="relative z-10">
          <div className="">
            {!isZoomed && !isSettingsZoomed && (
              <div className="pt-10">
                <Header
                  userData={userData}
                  isLoading={isLoading}
                  error={error}
                  refreshUserData={refreshUserData}
                />
              </div>
            )}
            {/* left screen */}
            <div className="">
              {!isZoomed && !isSettingsZoomed && (
                <div className="flex items-center justify-center flex-col w-60 m-4 absolute bottom-44 left-12 z-30">
                  <img
                    src={imageVideo}
                    alt="Personne"
                    className="cursor-pointer rounded-full"
                    onClick={() => setIsVideoModalOpen(true)}
                  />
                  <div className="text-center text-xs text-white z-30">
                    Bortoana is an AI-powered app that creates stunning videos for easy sharing
                    across social media. Transform ideas into captivating content in just a few
                    clicks!
                  </div>
                </div>
              )}
              {/* end left screen */}
              {/* cross button */}
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

        {/* Video Modal */}
        <BortanaVideo
          isOpen={isVideoModalOpen}
          onClose={() => setIsVideoModalOpen(false)}
          videoUrl={videoUrl}
        />

        {/* Settings Panel */}
        <AnimatePresence>
          {isSettingsZoomed && (
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="absolute top-0 right-0 bottom-0 z-40 w-3/5 flexshadow-lg"
            >
              <SettingsForm
                onClose={() => setIsSettingsZoomed(false)}
                userData={userData}
                refreshUserData={refreshUserData}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
