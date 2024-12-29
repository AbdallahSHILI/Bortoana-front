import React, { useState } from 'react'
import { Play, Share2 } from 'lucide-react'
import Cookies from 'js-cookie'

const TwitterVideoShare = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const videoUrl =
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4'

  const handleShare = async () => {
    setIsLoading(true)
    setError('')
    setMessage('')

    try {
      // Get tokens from cookies
      const oauth_token = Cookies.get('twitter_oauth_token')
      const oauth_token_secret = Cookies.get('twitter_oauth_token_secret')

      // Validate tokens exist
      if (!oauth_token || !oauth_token_secret) {
        throw new Error('Twitter authentication required. Please login first.')
      }

      console.log('Tokens from cookies:', { oauth_token, oauth_token_secret })

      const response = await fetch('https://bortoaana.onrender.com/api/auth/twitter/Share-Video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          videoUrl,
          oauth_token,
          oauth_token_secret
        })
      })
      console.log('Response:', response)

      const data = await response.json()
      console.log('Data:', data)

      if (!response.ok) {
        throw new Error(data.error || 'Failed to share video')
      }

      setMessage('Video shared successfully!')
    } catch (err) {
      setError(err.message)
      console.error('Share error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-gray-50 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-blue-400 mb-6 text-center">Share Video to Twitter</h2>

      <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden mb-6">
        <video
          className="w-full h-full object-contain my-video"
          src={videoUrl}
          controls={false}
          poster="path/to/poster.jpg"
          crossOrigin="anonymous"
        >
          Your browser does not support the video tag.
        </video>

        <button
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                     bg-white/80 hover:bg-white p-4 rounded-full transition-colors"
          onClick={() => document.querySelector('.my-video').play()}
        >
          <Play className="w-8 h-8 text-blue-500" />
        </button>
      </div>

      <button
        className="w-full py-3 px-6 bg-blue-400 hover:bg-blue-500 text-white rounded-lg
                   flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
        onClick={handleShare}
        disabled={isLoading}
      >
        <Share2 className="w-5 h-5" />
        {isLoading ? 'Sharing...' : 'Share to Twitter'}
      </button>

      {message && <p className="mt-4 text-green-600 text-center">{message}</p>}
      {error && <p className="mt-4 text-red-600 text-center">{error}</p>}
    </div>
  )
}

export default TwitterVideoShare
