const ScheduledVideo = require('../models/ScheduleVideo')
const fs = require('fs')
require('dotenv').config()
const path = require('path')
const schedule = require('node-schedule')
const oauth = require('oauth')
const os = require('os')
const { TwitterApi } = require('twitter-api-v2')
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args))

const tokenStore = new Map()

exports.LoginTwitter = async (req, res, next) => {
  try {
    // Create OAuth 1.0 consumer
    const oauth1Client = new oauth.OAuth(
      'https://api.twitter.com/oauth/request_token',
      'https://api.twitter.com/oauth/access_token',
      process.env.API_Key_TWITER,
      process.env.API_Key_Secret_TWITER,
      '1.0',
      'https://bortoaana.vercel.app/newbortoaana/callback/twitter', // Replace with your callback URL
      'HMAC-SHA1'
    )

    // Get request token
    oauth1Client.getOAuthRequestToken((error, oauth_token, oauth_token_secret, results) => {
      if (error) {
        console.error('Error getting request token: ', error)
        return res.status(500).json({
          status: 'Failed',
          message: 'Error getting request token',
          error: error.message
        })
      }

      // Store the oauth_token_secret using oauth_token as key
      tokenStore.set(oauth_token, oauth_token_secret)

      const authorizationUrl = `https://api.twitter.com/oauth/authenticate?oauth_token=${oauth_token}`
      return res.json({ url: authorizationUrl })
    })
  } catch (err) {
    console.error('Error in Twitter login function: ', err)
    return res.status(500).json({
      status: 'Failed',
      message: 'Error generating Twitter login URL',
      error: err.message
    })
  }
}

exports.CallbackTwitter = async (req, res) => {
  const { oauth_token, oauth_verifier } = req.query

  const oauth_token_secret = tokenStore.get(oauth_token)

  if (!oauth_token || !oauth_verifier || !oauth_token_secret) {
    return res.status(400).json({ status: 'Failed', message: 'Missing OAuth parameters' })
  }

  try {
    const oauth1Client = new oauth.OAuth(
      'https://api.twitter.com/oauth/request_token',
      'https://api.twitter.com/oauth/access_token',
      process.env.API_Key_TWITER,
      process.env.API_Key_Secret_TWITER,
      '1.0',
      'https://bortoaana.vercel.app/newbortoaana/callback/twitter',
      'HMAC-SHA1'
    )

    oauth1Client.getOAuthAccessToken(
      oauth_token,
      oauth_token_secret,
      oauth_verifier,
      async (error, access_token, access_token_secret, results) => {
        if (error) {
          console.error('Error exchanging tokens:', error)
          return res.status(500).json({
            status: 'Failed',
            message: 'Error exchanging tokens',
            error: error.message
          })
        }

        // Verify tokens by fetching user information
        const twitterClient = new TwitterApi({
          appKey: process.env.API_Key_TWITER,
          appSecret: process.env.API_Key_Secret_TWITER,
          accessToken: access_token,
          accessSecret: access_token_secret
        })

        try {
          const user = await twitterClient.v2.me()

          tokenStore.delete(oauth_token)

          return res.json({
            status: 'Success',
            data: {
              oauth_token: access_token,
              oauth_token_secret: access_token_secret,
              user
            }
          })
        } catch (fetchError) {
          console.error('Error fetching user information:', fetchError)
          return res.status(500).json({
            status: 'Failed',
            message: 'Error fetching user information',
            error: fetchError.message
          })
        }
      }
    )
  } catch (err) {
    console.error('Error in CallbackTwitter:', err)
    return res.status(500).json({
      status: 'Failed',
      message: 'Error in Twitter callback',
      error: err.message
    })
  }
}

exports.shareVideoToTwitter = async (params, res = null) => {
  try {
    const { oauth_token, oauth_token_secret, videoUrl } = params.body || params

    // Validate tokens
    if (!oauth_token || !oauth_token_secret) {
      const error = { error: 'User authentication tokens are required' }
      return res ? res.status(400).json(error) : Promise.reject(error)
    }

    // Validate video URL
    if (!videoUrl) {
      const error = { error: 'Video URL is required' }
      return res ? res.status(400).json(error) : Promise.reject(error)
    }

    // Create a Twitter client with the user's tokens
    const userTwitterClient = new TwitterApi({
      appKey: process.env.API_Key_TWITER,
      appSecret: process.env.API_Key_Secret_TWITER,
      accessToken: oauth_token,
      accessSecret: oauth_token_secret
    })

    // Other implementation remains the same
    try {
      const response = await fetch(videoUrl)
      const arrayBuffer = await response.arrayBuffer()
      const videoBuffer = Buffer.from(arrayBuffer)

      const tempFilePath = path.join(os.tmpdir(), 'temp-video.mp4')
      await fs.promises.writeFile(tempFilePath, videoBuffer)

      const mediaId = await userTwitterClient.v1.uploadMedia(tempFilePath, {
        mimeType: 'video/mp4',
        longVideo: true
      })

      const tweet = await userTwitterClient.v2.tweet({
        text: 'Check out this video!',
        media: { media_ids: [mediaId] }
      })

      await fs.promises.unlink(tempFilePath)

      if (res) {
        return res.status(200).json({
          message: 'Video shared successfully!',
          tweet
        })
      } else {
        return Promise.resolve({ message: 'Video shared successfully!', tweet })
      }
    } catch (uploadError) {
      console.error('Media Upload Error:', uploadError)
      const error = {
        error: 'Failed to upload media or tweet',
        details: uploadError.message
      }
      return res ? res.status(500).json(error) : Promise.reject(error)
    }
  } catch (error) {
    console.error('Twitter API Error:', error)
    const errResponse = {
      error: 'Failed to share video on Twitter',
      details: error.message
    }
    return res ? res.status(500).json(errResponse) : Promise.reject(errResponse)
  }
}

exports.scheduleVideo = async (req, res) => {
  try {
    console.log('good')
    const { scheduleTime, oauth_token, oauth_token_secret, videoUrl } = req.body
    console.log('req.body', req.body)

    // Validate the schedule time
    const scheduleDate = new Date(scheduleTime)
    if (scheduleDate < new Date()) {
      return res.status(400).json({ message: 'Schedule time must be in the future' })
    }

    // Save the schedule in the database
    const newSchedule = await ScheduledVideo.create({
      scheduleTime: scheduleDate,
      status: 'pending',
      platform: 'Twitter'
    })

    // Schedule the job
    schedule.scheduleJob(scheduleDate, async () => {
      try {
        console.log(`Executing scheduled task for videoat ${scheduleDate}`)

        await exports.shareVideoToTwitter({
          oauth_token,
          oauth_token_secret,
          videoUrl
        })
        await ScheduledVideo.findByIdAndUpdate(newSchedule.id, { status: 'completed' })
        console.log(`Video shared successfully at ${newSchedule.platform}`)
      } catch (err) {
        console.error(`Failed to share video:`, err)
        await ScheduledVideo.findByIdAndUpdate(newSchedule.id, { status: 'failed' })
      }
    })

    res.status(201).json({
      message: `Video scheduled successfully at ${newSchedule.platform}`,
      schedule: newSchedule
    })
  } catch (error) {
    console.error('Error scheduling video:', error)
    res.status(500).json({ message: 'Failed to schedule video', error })
  }
}
