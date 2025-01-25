import axios from 'axios'
import Video from '../assests/videos/edit_test.mp4'
import Cookies from 'js-cookie'
const videoUrl =
  'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4'

export const publishToFacebook = async (content) => {
  try {
    const response = await axios.post(
      'https://bortoaana.onrender.com/facebook/share-video',
      {
        videoUrl: content.videoUrl,
        title: content.title
      },
      {
        withCredentials: true
      }
    )

    if (response.data.success) {
      return response.data
    } else {
      throw new Error(response.data.error)
    }
  } catch (error) {
    throw error.response?.data?.error || error.message
  }
}

export const publishInstagramVideo = async (content) => {
  console.log('Publishing to Facebook:', content)

  try {
    const response = await axios.post(
      'https://bortoaana.onrender.com/instagram/publish-video',
      {
        videoUrl: content.Video,
        caption: content.title
      },
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    console.log('Video published:', response.data)
  } catch (error) {
    console.error('Video publish failed:', error.response?.data || error.message)
  }
}

export const publishInstagramStory = async (content) => {
  console.log('Publishing to Facebook Story:', content)

  try {
    const response = await axios.post(
      'https://bortoaana.onrender.com/instagram/publish-story',
      {
        videoUrl: content.Video,
        caption: content.title
      },
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    console.log('Video published:', response.data)
  } catch (error) {
    console.error('Video publish failed:', error.response?.data || error.message)
  }
}

export const handleLinkedinShare = async (content) => {
  console.log('Publishing to LinkedIn:', content)

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
        videoUrl: content.videoUrl,
        title: content.title
        // description: 'Sharing this awesome video to LinkedIn.'
      })
    })

    const data = await response.json()
    console.log('Response:', data)

    if (!response.ok) {
      throw new Error(data.error || 'Failed to share video')
    }

    return data
  } catch (err) {
    console.error('Share error:', err)
    throw err
  }
}

export const handleTwitterShare = async (content) => {
  console.log('Publishing to Twitter:', content)

  try {
    const oauth_token = Cookies.get('twitter_oauth_token')
    const oauth_token_secret = Cookies.get('twitter_oauth_token_secret')

    if (!oauth_token || !oauth_token_secret) {
      throw new Error('Twitter authentication required. Please login first.')
    }

    // Create FormData and append the video file
    const formData = new FormData()

    // Fetch the video file from the URL
    const videoResponse = await fetch(Video)
    const videoBlob = await videoResponse.blob()
    formData.append('video', videoBlob, 'video.mp4')

    // Append the tokens
    formData.append('oauth_token', oauth_token)
    formData.append('oauth_token_secret', oauth_token_secret)

    const response = await fetch('http://localhost:5001/api/auth/twitter/Share-Video', {
      method: 'POST',
      // Don't set Content-Type header - let the browser set it with the boundary
      body: formData
    })

    console.log('Response:', response)
    const data = await response.json()
    console.log('Data:', data)

    if (!response.ok) {
      throw new Error(data.error || 'Failed to share video')
    }

    return data
  } catch (err) {
    console.error('Share error:', err)

    throw err
  }
}

export const publishToSelectedPlatforms = async (selected, content) => {
  const publishers = {
    facebook: publishToFacebook,
    //   instagram: publishToInstagram,
    X: handleTwitterShare,
    linkedin: handleLinkedinShare
    //   tiktok: async (content) => console.log('Publishing to TikTok:', content),
    //   youtube: async (content) => console.log('Publishing to YouTube:', content),
    //   telegram: async (content) => console.log('Publishing to Telegram:', content),
    //   whatsapp: async (content) => console.log('Publishing to WhatsApp:', content),
    //   pinterest: async (content) => console.log('Publishing to Pinterest:', content),
    //   snapchat: async (content) => console.log('Publishing to Snapchat:', content)
  }

  const successes = []
  const failures = []

  const scheduledTime = new Date(content.scheduledTime)
  const now = new Date()
  const isScheduled = scheduledTime > now
  // Process each selected platform
  for (const platformId of selected) {
    if (publishers[platformId]) {
      try {
        if (isScheduled) {
          // Store the scheduled post in your database or scheduling system
          await schedulePost(platformId, content)
          successes.push({
            platform: platformId,
            status: 'scheduled',
            scheduledTime: content.scheduledTime
          })
        } else {
          // Publish immediately
          await publishers[platformId](content)
          successes.push({
            platform: platformId,
            status: 'success'
          })
        }
      } catch (error) {
        successes.push({
          platform: platformId,
          status: 'error',
          error: error.message
        })
      }
    }
  }
  return {
    success: successes,
    failures: failures
  }
}

const schedulePost = async (platform, content) => {
  try {
    const userId = Cookies.get('userId')

    const response = await fetch(`http://localhost:5001/api/user/schedule`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        platform,
        content,
        scheduledTime: content.scheduledTime,
        userId
      }),
      credentials: 'include' // Ensure cookies are sent with the request
    })

    if (!response.ok) {
      throw new Error(`Failed to schedule post for ${platform}`)
    }

    return await response.json()
  } catch (error) {
    throw new Error(`Scheduling failed for ${platform}: ${error.message}`)
  }
}
