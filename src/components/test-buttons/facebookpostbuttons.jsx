import { useState } from 'react'
import axios from 'axios'

const FacebookShare = ({ videoUrl, description, title }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  const handleShareVideo = async () => {
    setIsLoading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const response = await axios.post(
        'https://bortoaana.onrender.com/facebook/share-video',
        {
          videoUrl:
            'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
          description: 'check out this video',
          title: 'testing video'
        },
        {
          withCredentials: true, // Add this
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      setSuccessMessage(response.data.message)
    } catch (err) {
      console.error('Error details:', err.response?.data) // Add this for debugging

      setError(err.response?.data?.error || 'Failed to share video')
    } finally {
      setIsLoading(false)
    }
  }

  //   const handleShareStory = async () => {
  //     setIsLoading(true)
  //     setError(null)
  //     setSuccessMessage(null)

  //     try {
  //       const response = await axios.post(
  //         'https://bortoaana.onrender.com/facebook/share-story',
  //         {
  //           videoUrl:
  //             'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  //           description: 'Work test'
  //         },
  //         { withCredentials: true } // Include cookies with the request
  //       )
  //       setSuccessMessage(response.data.message)
  //     } catch (err) {
  //       setError(err.response?.data?.error || 'Failed to share story')
  //     } finally {
  //       setIsLoading(false)
  //     }
  //   }

  return (
    <div className="p-4 space-y-4">
      {/* Share buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleShareVideo}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300 transition"
        >
          {isLoading ? 'Sharing...' : 'Share to Facebook'}
        </button>
        {/* 
        <button
          onClick={handleShareStory}
          disabled={isLoading}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-purple-300 transition"
        >
          {isLoading ? 'Sharing...' : 'Share as Story'}
        </button> */}
      </div>

      {/* Status messages */}
      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>
      )}

      {successMessage && (
        <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {successMessage}
        </div>
      )}
    </div>
  )
}

export default FacebookShare
