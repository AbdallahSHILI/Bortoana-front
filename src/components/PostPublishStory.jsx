import axios from 'axios'
const PostStoryButton = () => {
  const publishVideo = async () => {
    try {
      const response = await axios.post(
        'https://bortoaana.onrender.com/instagram/publish-story',
        {
          videoUrl:
            'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
          caption: 'Check out my awesome video!'
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
  return (
    <button
      onClick={publishVideo}
      className="text-white p-2  hover:bg-blue-800 bg-blue-500 rounded-full
  "
    >
      post Story
    </button>
  )
}

export default PostStoryButton
