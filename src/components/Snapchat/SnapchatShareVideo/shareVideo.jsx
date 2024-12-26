import React, { useState } from 'react'
import { Play, Share2 } from 'lucide-react'
import Cookies from 'js-cookie'

const SnapchatVideoShare = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const videoUrl =
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4'

  const handleShare = async () => {
    setIsLoading(true)
    setError('')
    setMessage('')

    try {
      // Get access token from cookies
      const access_token = Cookies.get('snapchatAccessToken')

      // Validate token
      if (!access_token) {
        throw new Error('Snapchat authentication required. Please login first.')
      }

      console.log('Access token:', access_token)

      const response = await fetch('http://localhost:5001/api/auth/snapchat/Share-Video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          videoUrl,
          access_token
        })
      })
      console.log('response', response)

      const data = await response.json()
      console.log('Data:', data)

      if (!response.ok) {
        throw new Error(data.error || 'Failed to share video')
      }

      setMessage('Video shared successfully on Snapchat!')
    } catch (err) {
      setError(err.message)
      console.error('Share error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-gray-50 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-purple-500 mb-6 text-center">
        Share Video to Snapchat
      </h2>

      <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden mb-6">
        <video
          className="w-full h-full object-contain"
          src={videoUrl}
          controls={false}
          poster={videoUrl + '?poster=1'}
        >
          Your browser does not support the video tag.
        </video>

        <button
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                     bg-white/80 hover:bg-white p-4 rounded-full transition-colors"
          onClick={() => document.querySelector('video').play()}
        >
          <Play className="w-8 h-8 text-purple-500" />
        </button>
      </div>

      <button
        className="w-full py-3 px-6 bg-purple-500 hover:bg-purple-600 text-white rounded-lg
                   flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
        onClick={handleShare}
        disabled={isLoading}
      >
        <Share2 className="w-5 h-5" />
        {isLoading ? 'Sharing...' : 'Share to Snapchat'}
      </button>

      {message && <p className="mt-4 text-green-600 text-center">{message}</p>}
      {error && <p className="mt-4 text-red-600 text-center">{error}</p>}
    </div>
  )
}

export default SnapchatVideoShare
