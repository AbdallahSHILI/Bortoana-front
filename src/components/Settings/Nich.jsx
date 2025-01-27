import React, { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import person from '../../assests/images/settings/person.png'
import NichIcon from '../../assests/images/SettingsIcons/AddIcon.svg'
import { PaintBrushIcon, XMarkIcon } from '@heroicons/react/24/solid'
import NichCard from './NichCard'
import PersonalAccount from '../../assests/images/SettingsIcons/PersonalAccount.svg'
import BuisnessAccount from '../../assests/images/SettingsIcons/BuisnessAccount.svg'
import CookingPage from '../../assests/images/SettingsIcons/CookingPage.svg'
import TravelPage from '../../assests/images/SettingsIcons/TravelPage.svg'
import CreativeAccount from '../../assests/images/SettingsIcons/CreativeAccount.svg'
import FitnessPage from '../../assests/images/SettingsIcons/FitnessPage.svg'
import EducationalPage from '../../assests/images/SettingsIcons/EducationalPage.svg'
import Fashion from '../../assests/images/SettingsIcons/Fashion.svg'
import Comedy from '../../assests/images/SettingsIcons/Comedy.svg'
import Charity from '../../assests/images/SettingsIcons/Charity.svg'
import Pet from '../../assests/images/SettingsIcons/Pet.svg'
import News from '../../assests/images/SettingsIcons/News.svg'
import Ecommerce from '../../assests/images/SettingsIcons/Ecommerce.svg'
import Motivation from '../../assests/images/SettingsIcons/Motivation.svg'
import Hobby from '../../assests/images/SettingsIcons/Hobby.svg'
import Cookies from 'js-cookie'
import axios from 'axios'

const NichGenerator = ({ onClose }) => {
  const [existingNich, setExistingNich] = useState('')
  const id = Cookies.get('userId')
  const baseUrl =
    process.env.NODE_ENV == 'production' ? 'ttps://bortoaana.onrender.com' : 'http://localhost:5001'

  //   const cards = Array.from({ length: 8 }, (_, index) => ({
  //   id: index + 1,
  //   name: `Charles-young adult`,
  //   photo: person // Placeholder photo URL
  // }))

  // This will keep calling itself because existingNich changes cause re-renders
  useEffect(() => {
    const handleGetNich = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/user/getnich/${id}`, {
          withCredentials: true
        })
        setExistingNich(response.data.nich)
      } catch (error) {
        console.error('Error fetching niche:', error)
      }
    }

    if (id) {
      // Only fetch if we have an ID
      handleGetNich()
    }
    console.log('nich', existingNich)
  }, [id])

  const handleNich = useCallback(
    async (nich) => {
      try {
        const response = await axios.patch(`http://localhost:5001/api/user/updatenich/${id}`, {
          nich
        })
        setExistingNich(nich)
      } catch (error) {
        console.error('Error updating niche:', error)
      }
    },
    [id]
  )

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 overflow-y-auto">
      <motion.div
        className="fixed inset-0 bg-black"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      />
      <div className="flex w-full max-w-screen-xl mx-auto relative">
        {/* Left section */}
        <div className="w-full lg:w-5/6 z-10 max-h-[90vh] overflow-y-scroll hide-scrollbar">
          <div className="bg-[#303030] rounded-xl flex flex-col gap-2 px-4 md:px-8 my-4 py-6 w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-3xl md:text-5xl text-gray-400 font-bold">Set up your nich</h2>
              <XMarkIcon
                onClick={onClose}
                className="cursor-pointer rounded-full h-7 w-7 text-white hover:bg-gray-500"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {console.log('Parent rendering, handleNich:', handleNich)}

              <NichCard
                handleNich={handleNich}
                existingNich={existingNich}
                ImgUrl={PersonalAccount}
                Title="Personal Accounts"
                Description="Accounts for individuals to share daily photos and videos with friends and family."
              />
              <NichCard
                handleNich={handleNich}
                existingNich={existingNich}
                ImgUrl={BuisnessAccount}
                Title="Buisness Accounts"
                Description="Dedicated accounts for businesses and brands to promote products or services."
              />
              <NichCard
                handleNich={handleNich}
                existingNich={existingNich}
                ImgUrl={CreativeAccount}
                Title="Creator Accounts"
                Description="Dedicated to influencers, artists, and creative content creators."
              />
              <NichCard
                handleNich={handleNich}
                existingNich={existingNich}
                ImgUrl={EducationalPage}
                Title="Educational Pages"
                Description="Provide advice or educational information in areas such as languages, science, or skills."
              />
              <NichCard
                handleNich={handleNich}
                existingNich={existingNich}
                ImgUrl={CookingPage}
                Title="Food Pages"
                Description="Focuses on recipes, restaurant experiences, and food photography."
              />
              <NichCard
                handleNich={handleNich}
                existingNich={existingNich}
                ImgUrl={TravelPage}
                Title="Travel Pages"
                Description="Dedicated to reviewing tourist attractions and travel experiences."
              />
              <NichCard
                handleNich={handleNich}
                existingNich={existingNich}
                ImgUrl={FitnessPage}
                Title="Fitness & Health Pages"
                Description="Focuses on exercise, nutritional advice, and a healthy lifestyle."
              />
              <NichCard
                handleNich={handleNich}
                existingNich={existingNich}
                ImgUrl={Fashion}
                Title="Fashion & Beauty Pages"
                Description="Interested in sharing fashion, cosmetics and the latest trends."
              />
              <NichCard
                handleNich={handleNich}
                existingNich={existingNich}
                ImgUrl={Comedy}
                Title="Comedy Pages"
                Description="Provides entertainment content, jokes, satirical videos, and memes."
              />
              <NichCard
                handleNich={handleNich}
                existingNich={existingNich}
                ImgUrl={Charity}
                Title="Charity Pages"
                Description="Aim to support community issues or spread awareness and collect donations."
              />
              <NichCard
                handleNich={handleNich}
                existingNich={existingNich}
                ImgUrl={Hobby}
                Title="Hobby Pages"
                Description="Dedicated to sharing hobbies such as photography, drawing, gaming, etc."
              />
              <NichCard
                handleNich={handleNich}
                existingNich={existingNich}
                ImgUrl={Pet}
                Title="Pets Pages"
                Description="Focuses on photos and videos of pets and their parenting experiences."
              />
              <NichCard
                handleNich={handleNich}
                existingNich={existingNich}
                ImgUrl={News}
                Title="News Pages"
                Description="Covering daily news and political, economic, or sports developments."
              />
              <NichCard
                handleNich={handleNich}
                existingNich={existingNich}
                ImgUrl={Ecommerce}
                Title="E-commerce Pages"
                Description="Sell ​​products or services directly through Instagram."
              />
              <NichCard
                handleNich={handleNich}
                existingNich={existingNich}
                ImgUrl={Motivation}
                Title="Motivational Pages"
                Description="Provides tips for personal motivation and skill development."
              />
            </div>
          </div>
        </div>
        {/* right section */}
        <div className="hidden lg:block fixed right-0 z-20 h-screen">
          <div className="pt-36">
            <div className="flex flex-row items-center">
              <PaintBrushIcon className="text-white h-10 w-10" />
              <h1 className="text-white pl-2 text-2xl">Tools</h1>
            </div>

            <div
              className="w-52 h-56 rounded-l-3xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(to right, #E5E5EA, #81818421)'
              }}
            >
              <div className="flex flex-col items-center">
                <div className="h-32 w-32 rounded-full bg-white flex items-center justify-center">
                  <img alt="Nich_Icon" className="w-20 h-20" src={NichIcon} />
                </div>
                <div className="text-white text-3xl font-bold mt-4">Nich</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NichGenerator
