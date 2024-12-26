import React, { useState } from 'react'
import { Play, Share2 } from 'lucide-react'
import Cookies from 'js-cookie'

const LinkedInVideoShare = () => {
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
      // Get the LinkedIn access token from cookies
      const accessToken = Cookies.get('linkedin_oauth_access_token')
      if (!accessToken) {
        throw new Error('LinkedIn authentication required. Please login first.')
      }

      console.log('Access token from cookies:', accessToken)

      const response = await fetch('http://localhost:5001/api/auth/linkedin/Share-Video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          videoUrl,
          title: 'Check out this amazing video!',
          description: 'Sharing this awesome video to LinkedIn.'
        })
      })

      const data = await response.json()
      console.log('Response:', data)

      if (!response.ok) {
        throw new Error(data.error || 'Failed to share video')
      }

      setMessage('Video shared successfully to LinkedIn!')
    } catch (err) {
      setError(err.message)
      console.error('Share error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-gray-50 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-blue-400 mb-6 text-center">Share Video to LinkedIn</h2>

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
        {isLoading ? 'Sharing...' : 'Share to LinkedIn'}
      </button>

      {message && <p className="mt-4 text-green-600 text-center">{message}</p>}
      {error && <p className="mt-4 text-red-600 text-center">{error}</p>}
    </div>
  )
}

export default LinkedInVideoShare
