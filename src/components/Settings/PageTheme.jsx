import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import ThemeIcon from '../../assests/images/SettingsIcons/ThemeIcon.svg'
import { PaintBrushIcon, XMarkIcon } from '@heroicons/react/24/solid'
import ReactPlayer from 'react-player'
import None from '../../assests/images/SettingsIcons/EffectIcons/None.svg'
import Vignette from '../../assests/images/SettingsIcons/EffectIcons/Brightness.svg'
import Cinematic from '../../assests/images/SettingsIcons/EffectIcons/Contrast.svg'
import Grayscale from '../../assests/images/SettingsIcons/EffectIcons/Grayscale.svg'
import Mirror from '../../assests/images/SettingsIcons/EffectIcons/Miror.svg'
import Sharpen from '../../assests/images/SettingsIcons/EffectIcons/Normal.svg'
import Rotate180 from '../../assests/images/SettingsIcons/EffectIcons/Rotate180.svg'
import Vintage from '../../assests/images/SettingsIcons/EffectIcons/Saturate.svg'
import Sepia from '../../assests/images/SettingsIcons/EffectIcons/sepia.svg'
import Warmth from '../../assests/images/SettingsIcons/EffectIcons/blur.svg'
import Video from '../../assests/videos/edit_test.mp4'
import { createFFmpeg } from '@ffmpeg/ffmpeg'
import Cookies from 'js-cookie'

import axios from 'axios'

import {
  RiAlignItemLeftFill,
  RiAlignItemRightFill,
  RiAlignItemHorizontalCenterFill
} from 'react-icons/ri'

const PageTheme = ({ onClose }) => {
  const [ffmpeg, setFfmpeg] = useState(null)
  const [selectedFilter, setSelectedFilter] = useState('none')
  const [processedVideo, setProcessedVideo] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [statusMessage, setStatusMessage] = useState(null) // To store the success message

  const [progress, setProgress] = useState(0)
  const userId = Cookies.get('userId')

  useEffect(() => {
    const fetchUserFilter = async () => {
      try {
        const response = await axios.get(
          `https://bortoaana.onrender.com/api/user/getTheme/${userId}`
        )
        const fetchedFilter = response.data.filter
        setSelectedFilter(fetchedFilter)

        // Only apply filter if ffmpeg is loaded
        if (ffmpeg && fetchedFilter) {
          await applyVideoFilter(fetchedFilter)
        }

        console.log('fetchedfilter', response.data)
      } catch (error) {
        console.error('Error fetching filter:', error.message)
      }
    }

    if (ffmpeg) {
      // Only fetch if ffmpeg is loaded
      fetchUserFilter()
    }
  }, [userId, ffmpeg])

  const saveUserFilter = async (selectedFilter) => {
    console.log('selectedFilter', selectedFilter)
    try {
      const response = await axios.patch(
        `https://bortoaana.onrender.com/api/user/updateTheme/${userId}`,
        {
          filter: selectedFilter
        }
      )
      console.log('Filter saved successfully:', response.data)
      setStatusMessage('Saved Successfully')
      setTimeout(() => setStatusMessage(null), 3000) // Clear after 3 seconds
    } catch (error) {
      console.error('Error saving filter:', error.response?.data || error.message)
      setStatusMessage('Failed to Save')
      setTimeout(() => setStatusMessage(null), 3000) // Clear after 3 seconds
    }
  }

  useEffect(() => {
    const loadFFmpeg = async () => {
      const ffmpegInstance = createFFmpeg({
        log: true,
        progress: ({ ratio }) => {
          setProgress(Math.round(ratio * 100))
        }
      })
      await ffmpegInstance.load()
      setFfmpeg(ffmpegInstance)
    }
    loadFFmpeg()
  }, [])

  //add text function
  const applyTextToVideo = async (text, fontSize = 24, fontColor = 'white') => {
    if (!ffmpeg) return
    setIsProcessing(true)

    try {
      // Load video data
      const videoResponse = await fetch(Video)
      const videoData = await videoResponse.arrayBuffer()
      const videoUint8Array = new Uint8Array(videoData)

      // Load the font file (if needed)
      const fontResponse = await fetch('/path/to/font.ttf')
      const fontData = await fontResponse.arrayBuffer()
      const fontUint8Array = new Uint8Array(fontData)

      ffmpeg.FS('writeFile', 'input.mp4', videoUint8Array)
      ffmpeg.FS('writeFile', 'font.ttf', fontUint8Array)

      // Run FFmpeg with drawtext filter
      await ffmpeg.run(
        '-i',
        'input.mp4',
        '-vf',
        `drawtext=text='${text}':fontfile=font.ttf:fontsize=${fontSize}:fontcolor=${fontColor}:x=(w-text_w)/2:y=(h-text_h)/2`,
        '-pix_fmt',
        'yuv420p',
        '-preset',
        'ultrafast',
        'output.mp4'
      )

      // Read processed video
      const data = ffmpeg.FS('readFile', 'output.mp4')
      const videoUrl = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }))
      setProcessedVideo(videoUrl)
    } catch (error) {
      console.error('Processing error:', error)
    } finally {
      setIsProcessing(false)
      setProgress(0)
    }
  }

  //editing video function
  const applyVideoFilter = async (filterId) => {
    if (!ffmpeg) return
    setIsProcessing(true)
    setSelectedFilter(filterId)

    try {
      // Convert video to Uint8Array
      const videoResponse = await fetch(Video)
      const videoData = await videoResponse.arrayBuffer()
      const videoUint8Array = new Uint8Array(videoData)

      ffmpeg.FS('writeFile', 'input.mp4', videoUint8Array)

      // Get FFmpeg filter command based on CSS filter
      const ffmpegFilters = {
        grayscale: 'format=gray',
        sepia: 'colorchannelmixer=.393:.769:.189:0:.349:.686:.168:0:.272:.534:.131',
        blur: 'gblur=sigma=2',
        brightness: 'eq=brightness=0.2',
        contrast: 'eq=contrast=1.5',
        saturate: 'eq=saturation=2',
        warmth: 'colorbalance=rm=0.4:gm=0.3:bm=0.2',
        vignette: 'vignette=PI/4',
        sharpen: 'unsharp=5:5:1.0:5:5:0.0',
        cinematic:
          'curves=r=0/0 0.5/0.4 1/0.9:g=0/0 0.5/0.4 1/0.9:b=0/0 0.5/0.4 1/0.9,eq=saturation=0.8:contrast=1.2',
        mirror: 'hflip',
        rotate180: 'rotate=PI'
      }

      const filterCommand = ffmpegFilters[filterId] || 'null'

      await ffmpeg.run(
        '-i',
        'input.mp4',
        '-vf',
        filterCommand,
        '-pix_fmt',
        'yuv420p',
        '-preset',
        'ultrafast',
        'output.mp4'
      )

      const data = ffmpeg.FS('readFile', 'output.mp4')
      const videoUrl = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }))

      setProcessedVideo(videoUrl)
    } catch (error) {
      console.error('Processing error:', error)
    } finally {
      setIsProcessing(false)
      setProgress(0)
    }
  }

  // useEffect(() => {
  //   applyVideoFilter()
  // }, [selectedFilter, userId])

  const filterPreviews = [
    {
      id: 'none',
      previewUrl: None,
      name: 'No Effect'
    },
    {
      id: 'grayscale',
      previewUrl: Grayscale,
      name: 'Grayscale'
    },
    {
      id: 'sepia',
      previewUrl: Sepia,
      name: 'Sepia'
    },
    {
      id: 'vintage',
      previewUrl: Vintage,
      name: 'Vintage'
    },
    {
      id: 'cinematic',
      previewUrl: Cinematic,
      name: 'Cinematic'
    },
    {
      id: 'warmth',
      previewUrl: Warmth,
      name: 'Warm'
    },
    {
      id: 'vignette',
      previewUrl: Vignette,
      name: 'Vignette'
    },
    {
      id: 'sharpen',
      previewUrl: Sharpen,
      name: 'Sharpen'
    },
    {
      id: 'mirror',
      previewUrl: Mirror,
      name: 'Mirror'
    },
    {
      id: 'rotate180',
      previewUrl: Rotate180,
      name: 'Rotate 180°'
    }
  ]

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      {/* Full-screen background overlay */}
      <motion.div
        className="fixed inset-0 bg-black pointer-events-none" // Ensures it doesn't block interactions
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      ></motion.div>

      {/* Main modal content */}
      <div className="flex flex-row gap-12 h-screen w-screen z-10">
        {' '}
        {/* left section */}
        <div className="z-20 w-64 h-screen">
          <div className=" pt-36 right-0">
            <div
              className=" w-40 sm:w-10 lg:w-52 h-7 sm:h-7 lg:h-56 rounded-r-3xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(to right, #E5E5EA, #81818421)'
              }}
            >
              <div className="flex flex-col items-center">
                <div className="lg:h-32 lg:w-32 w-8 h-8 sm:w-6 sm:h-6 rounded-full bg-white flex items-center justify-center">
                  <img
                    alt="Nich_Icon"
                    className="lg:w-20 lg:h-20 sm:w-4 sm:h-4 w-6 h-6"
                    src={ThemeIcon}
                  />
                </div>
                <div className="text-white text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mt-2 lg:mt-4">
                  Page Theme
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Mid section */}
        <div className="flex flex-col gap-8  h-full items-center text-center justify-center">
          <h1 className="text-7xl text-gray-500 font-bold">Page Theme</h1>
          <div
            className="aspect-video w-[700px]  h-[400px] bg-black rounded-lg overflow-hidden"
            style={{
              position: 'relative'
            }}
          >
            {' '}
            <div className="aspect-video w-[700px] h-full bg-black rounded-lg overflow-hidden relative">
              <ReactPlayer url={processedVideo || Video} controls width="100%" height="100%" />
              {isProcessing && (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
                  <div className="loading-spinner mb-4"></div>
                  <div className="text-white">Processing... {progress}%</div>
                </div>
              )}
            </div>
          </div>
          <div className="text-start gap-3 flex flex-col justify-start">
            <p className="font-bold  text-white">Sample Video</p>
            <p className="text-white">
              {isProcessing
                ? 'Applying effect...'
                : `Current filter: ${filterPreviews.find((f) => f.id === selectedFilter)?.name}`}
            </p>
          </div>
        </div>
        {/* right section */}
        <div className="       m-6 ">
          <div className="bg-[#303030] border-4 backdrop-blur-sm my-24 p-6 rounded-xl text-white shadow-xl  border-gray-400">
            <div className="flex h-full justify-between items-center mb-6">
              <h2 className="text-sm font-medium">Set up your page theme</h2>
              <div className="flex flex-col">
                <button
                  onClick={() => saveUserFilter(selectedFilter)}
                  className=" hover:bg-blue-700 px-8 py-3 rounded-xl bg-[#0004FF] text-"
                >
                  Save It
                </button>
                {statusMessage && (
                  <span className="text-green-500 text-xs ">{statusMessage}</span> // Success message below the button
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  <span className="text-sm">Caption text setting :</span>
                </div>
                <div className="flex gap-2">
                  <select className="bg-[#303030] rounded px-2 py-1 text-sm">
                    <option>Normal text</option>
                  </select>
                  <div className="flex gap-1.5">
                    {['B', 'I', 'U', 'S', '<>', '🔗'].map((item, i) => (
                      <button
                        key={i}
                        className="bg-[#303030] px-2 py-1 rounded text-sm min-w-[28px]"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  <span className="text-sm">Placement in the video :</span>
                </div>
                <div className="flex  ">
                  {[
                    <RiAlignItemLeftFill className="hover:bg-gray-300 hover:bg-opacity-45 rounded-md text-white w-4 h-4" />,
                    <RiAlignItemHorizontalCenterFill className="text-white hover:bg-gray-300 hover:bg-opacity-45 rounded-md w-4 h-4" />,
                    <RiAlignItemRightFill className="text-white hover:bg-gray-300 hover:bg-opacity-45 rounded-md w-4 h-4" />
                  ].map((item, i) => (
                    <button key={i} className="bg-[#303030] px-3 py-1.5 rounded text-sm">
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  <span className="text-sm">Filters :</span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {filterPreviews.map((filter, i) => (
                    <div
                      key={i}
                      onClick={() => applyVideoFilter(filter.id)}
                      className={`cursor-pointer aspect-square rounded-lg overflow-hidden relative
                        ${selectedFilter === filter.id ? 'ring-2 ring-blue-500' : ''}`}
                    >
                      <img
                        src={filter.previewUrl}
                        alt="filter preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100">
                        <span className="text-white text-xs">{filter.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PageTheme
