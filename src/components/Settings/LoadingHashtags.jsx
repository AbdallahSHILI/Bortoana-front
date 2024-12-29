import { motion } from 'framer-motion'
import CongratsIcon from '../../assests/images/SettingsIcons/CongratsIcon.svg'
import { ArrowPathIcon, XMarkIcon } from '@heroicons/react/24/solid'

const LoadingHashtag = () => {
  return (
    <div className="overflow-y-scroll w-screen h-screen fixed inset-0 flex justify-center items-center z-50">
      {/* Full-screen background overlay */}
      <motion.div
        className="fixed inset-0 w-full h-full bg-black"
        // Close the modal when the background is clicked
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      ></motion.div>

      {/* Content container */}
      <div className="absolute px-24 z-60 flex pt-36 pb-24 flex-col gap-4 p-8 items-center text-center border-4 border-gray-400 border-blur bg-black rounded-xl">
        <div class="loader relative w-24 h-24  animate-spin988">
          <div class="circle absolute top-0 left-0 w-5 h-5 bg-[#0004FF] rounded-full"></div>
          <div class="circle absolute top-0 right-0 w-5 h-5 bg-[#0004FF] rounded-full"></div>
          <div class="circle absolute bottom-0 left-0 w-5 h-5 bg-[#0004FF] rounded-full"></div>
          <div class="circle absolute bottom-0 right-0 w-5 h-5 bg-[#0004FF] rounded-full"></div>
          <div class="circle absolute top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-[#0004FF] rounded-full"></div>
          <div class="circle absolute bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-[#0004FF] rounded-full"></div>
          <div class="circle absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-[#0004FF] rounded-full"></div>
          <div class="circle absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-[#0004FF] rounded-full"></div>
        </div>{' '}
        <div className="text-white pt-24 w-full gap-4">
          <p className="text-sm w-[600px]">
            AI is generating your hashtags... it will be ready in a blink
          </p>
        </div>
        {/* Display hashtags */}
      </div>
    </div>
  )
}

export default LoadingHashtag
