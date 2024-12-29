import React, { useState, useEffect } from 'react'
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg'
import ReactPlayer from 'react-player'

const VideoEditor = () => {
  const [videoFile, setVideoFile] = useState(null)
  const [editedVideo, setEditedVideo] = useState(null)
  const [loading, setLoading] = useState(false)
  const [ffmpeg, setFfmpeg] = useState(null)
  const [loadingFFmpeg, setLoadingFFmpeg] = useState(true)
  const [loadingError, setLoadingError] = useState(null)
  const [progress, setProgress] = useState(0)
  const [processingStep, setProcessingStep] = useState('')
  const [selectedEffect, setSelectedEffect] = useState('none')
  const [cropDimensions, setCropDimensions] = useState({
    width: 640,
    height: 480,
    x: 0,
    y: 0
  })
  const [isCropping, setIsCropping] = useState(false)
  const [cropStart, setCropStart] = useState({ x: 0, y: 0 })

  // Define available effects
  const videoEffects = {
    none: {
      name: 'No Effect',
      filter: ''
    },
    grayscale: {
      name: 'Grayscale',
      filter: 'hue=s=0'
    },
    sepia: {
      name: 'Sepia',
      filter: 'colorbalance=rs=.3:gs=.3:bs=.3:rm=.3:gm=.3:bm=.3:rh=.3:gh=.3:bh=.3'
    },
    blur: {
      name: 'Blur',
      filter: 'boxblur=2:2'
    },
    sharpen: {
      name: 'Sharpen',
      filter: 'unsharp=5:5:1.5:5:5:0'
    },
    brightness: {
      name: 'Bright',
      filter: 'eq=brightness=0.2'
    },
    contrast: {
      name: 'High Contrast',
      filter: 'eq=contrast=1.5'
    },
    saturate: {
      name: 'Saturate',
      filter: 'eq=saturation=2'
    },
    mirror: {
      name: 'Mirror',
      filter: 'hflip'
    },
    rotate180: {
      name: 'Rotate 180°',
      filter: 'rotate=PI'
    },
    invert: {
      name: 'Invert Colors',
      filter: 'negate'
    },
    vignette: {
      name: 'Vignette',
      filter: 'vignette'
    },

    desaturate: {
      name: 'Desaturate',
      filter: 'eq=saturation=0.5'
    },
    oldFilm: {
      name: 'Old Film',
      filter: 'curves=vintage'
    },
    cartoon: {
      name: 'Cartoon Effect',
      filter: 'tblend=all_mode=add:all_opacity=0.5'
    },
    glow: {
      name: 'Glow',
      filter: 'gblur=sigma=10'
    },
    edgeDetect: {
      name: 'Edge Detection',
      filter: 'edgedetect'
    },
    posterize: {
      name: 'Posterize',
      filter: 'curves=poster'
    },
    pixelate: {
      name: 'Pixelate',
      filter: 'scale=iw/10:-1,scale=iw*10:-1'
    }
  }

  useEffect(() => {
    const loadFFmpeg = async () => {
      try {
        setLoadingFFmpeg(true)
        setLoadingError(null)

        const ffmpegInstance = createFFmpeg({
          log: true,
          progress: ({ ratio }) => {
            setProgress(Math.round(ratio * 100))
          }
        })

        await ffmpegInstance.load()
        setFfmpeg(ffmpegInstance)
      } catch (error) {
        console.error('FFmpeg loading error:', error)
        setLoadingError(
          'Failed to load video processing library. Please ensure you are using a supported browser and try again.'
        )
      } finally {
        setLoadingFFmpeg(false)
      }
    }

    loadFFmpeg()
  }, [])

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      setVideoFile(file)
      setEditedVideo(null)
      setLoadingError(null)
      setSelectedEffect('none')
    }
  }

  const handleCropDimensionsChange = (e) => {
    const { name, value } = e.target
    setCropDimensions((prev) => ({
      ...prev,
      [name]: parseInt(value) || 0
    }))
  }

  const applyEffect = async () => {
    if (!ffmpeg || !videoFile) return

    try {
      setLoading(true)
      setLoadingError(null)
      setProgress(0)
      setProcessingStep('Starting processing...')

      // Write the input file to FFmpeg's virtual filesystem
      ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(videoFile))

      let filterCommand = []

      if (selectedEffect === 'crop') {
        const { width, height, x, y } = cropDimensions

        // Apply crop filter
        filterCommand = [
          '-i',
          'input.mp4',
          '-vf',
          `crop=${width}:${height}:${Math.round(x)}:${Math.round(y)}`,
          '-preset',
          'ultrafast',
          '-c:a',
          'copy',
          'output.mp4'
        ]
      } else {
        // Apply selected effect filter
        const effectFilter = videoEffects[selectedEffect].filter
        filterCommand = [
          '-i',
          'input.mp4',
          '-vf',
          effectFilter || 'null',
          '-preset',
          'ultrafast',
          '-c:a',
          'copy',
          'output.mp4'
        ]
      }

      // Run FFmpeg command
      setProcessingStep('Applying effects...')
      await ffmpeg.run(...filterCommand)

      // Read the result
      setProcessingStep('Finalizing...')
      const data = ffmpeg.FS('readFile', 'output.mp4')
      const url = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }))
      setEditedVideo(url)
      setProcessingStep('Complete!')

      // Cleanup files
      ffmpeg.FS('unlink', 'input.mp4')
      ffmpeg.FS('unlink', 'output.mp4')
    } catch (error) {
      console.error('Processing error:', error)
      setLoadingError('Error processing video. Please try with a smaller video file.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl md:text-3xl font-bold text-white text-center">
          Advanced Video Editor
        </h1>

        {loadingFFmpeg && (
          <div className="bg-blue-500 bg-opacity-20 border border-blue-500 text-blue-200 px-4 py-3 rounded-lg">
            Loading video processing library... This may take a few moments.
          </div>
        )}

        {loadingError && (
          <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
            {loadingError}
          </div>
        )}

        <div className="bg-gray-800 rounded-lg p-4 md:p-6 shadow-lg">
          <label className="block mb-4">
            <span className="text-white text-sm mb-2 block">Select Video File</span>
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-300
                file:mr-4 file:py-2 file:px-4 
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-500 file:text-white
                hover:file:bg-blue-600
                cursor-pointer"
            />
          </label>

          {videoFile && (
            <>
              <div className="mb-4">
                <label className="block text-white text-sm mb-2">Select Effect</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {Object.entries(videoEffects).map(([key, effect]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedEffect(key)}
                      className={`p-2 rounded-md text-sm font-medium transition-colors duration-200
                        ${
                          selectedEffect === key
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                    >
                      {effect.name}
                    </button>
                  ))}
                  <button
                    onClick={() => setSelectedEffect('crop')}
                    className={`p-2 rounded-md text-sm font-medium transition-colors duration-200
                      ${
                        selectedEffect === 'crop'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                  >
                    Crop
                  </button>
                </div>
              </div>

              {selectedEffect === 'crop' && (
                <div className="mb-4 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white text-sm mb-1">Width</label>
                    <input
                      type="number"
                      name="width"
                      value={cropDimensions.width}
                      onChange={handleCropDimensionsChange}
                      className="w-full bg-gray-700 text-white rounded-md px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-white text-sm mb-1">Height</label>
                    <input
                      type="number"
                      name="height"
                      value={cropDimensions.height}
                      onChange={handleCropDimensionsChange}
                      className="w-full bg-gray-700 text-white rounded-md px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-white text-sm mb-1">X Position</label>
                    <input
                      type="number"
                      name="x"
                      value={cropDimensions.x}
                      onChange={handleCropDimensionsChange}
                      className="w-full bg-gray-700 text-white rounded-md px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-white text-sm mb-1">Y Position</label>
                    <input
                      type="number"
                      name="y"
                      value={cropDimensions.y}
                      onChange={handleCropDimensionsChange}
                      className="w-full bg-gray-700 text-white rounded-md px-3 py-2"
                    />
                  </div>
                </div>
              )}

              <button
                onClick={applyEffect}
                disabled={loading || loadingFFmpeg || !ffmpeg}
                className={`w-full py-2 px-4 rounded-md text-white font-medium
                  ${
                    loading || loadingFFmpeg || !ffmpeg
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-green-500 hover:bg-green-600'
                  } 
                  transition-colors duration-200`}
              >
                {loading ? 'Processing...' : 'Apply Effect'}
              </button>
            </>
          )}

          {loading && (
            <div className="bg-blue-500 bg-opacity-20 border border-blue-500 text-blue-200 px-4 py-3 rounded-lg mt-4">
              <div className="font-medium mb-2">{processingStep}</div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {videoFile && (
          <div
            className="aspect-video bg-black rounded-lg overflow-hidden"
            style={{
              width: `${cropDimensions.width}px`,
              height: `${cropDimensions.height}px`,
              left: `${cropDimensions.x}px`,
              top: `${cropDimensions.y}px`,
              position: 'relative'
            }}
          >
            <ReactPlayer
              url={URL.createObjectURL(videoFile)}
              controls
              width="100%"
              height="100%"
              onError={(e) => console.error('Video player error:', e)}
            />
          </div>
        )}

        {editedVideo && (
          <div className="bg-gray-800 rounded-lg p-4 md:p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-white mb-4">Edited Video</h2>
            <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
              <ReactPlayer
                url={editedVideo}
                controls
                width="100%"
                height="100%"
                onError={(e) => console.error('Video player error:', e)}
              />
            </div>
            <a
              href={editedVideo}
              download="edited-video.mp4"
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white 
                font-medium py-2 px-4 rounded-md transition-colors duration-200"
            >
              Download Edited Video
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

export default VideoEditor
