import React, { useState, useRef, useEffect } from 'react'
import { Mic, Square, Pause, Play, X } from 'lucide-react'
import WaveSurfer from 'wavesurfer.js'

const VoiceRecorderModal = ({ isOpen, onClose, onSave }) => {
  const [state, setState] = useState({
    isRecording: false,
    isPaused: false,
    error: null,
    audioUrl: null,
    recordingTime: 0,
    isLoading: false
  })

  const mediaRecorder = useRef(null)
  const audioChunks = useRef([])
  const timer = useRef(null)
  const waveformRef = useRef(null)
  const wavesurfer = useRef(null)

  useEffect(() => {
    if (isOpen) {
      setupWaveform()
    }
    return () => cleanup()
  }, [isOpen])

  const setupWaveform = () => {
    if (wavesurfer.current) wavesurfer.current.destroy()

    wavesurfer.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: '#4a9eff',
      progressColor: '#1e6abc',
      cursorColor: '#1e6abc',
      barWidth: 2,
      barRadius: 3,
      cursorWidth: 1,
      height: 80,
      barGap: 3,
      normalize: true
    })
  }

  const cleanup = () => {
    if (timer.current) clearInterval(timer.current)
    if (wavesurfer.current) wavesurfer.current.destroy()
    if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
      mediaRecorder.current.stop()
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorder.current = new MediaRecorder(stream)
      audioChunks.current = []

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data)
      }

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' })
        const url = URL.createObjectURL(audioBlob)
        wavesurfer.current.load(url)
        setState((prev) => ({ ...prev, audioUrl: url, isRecording: false }))
      }

      mediaRecorder.current.start()
      setState((prev) => ({ ...prev, isRecording: true, error: null }))

      timer.current = setInterval(() => {
        setState((prev) => ({
          ...prev,
          recordingTime: prev.recordingTime + 1
        }))
      }, 1000)
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: 'Please allow microphone access to record audio'
      }))
    }
  }

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
      mediaRecorder.current.stop()
      clearInterval(timer.current)
      mediaRecorder.current.stream.getTracks().forEach((track) => track.stop())
    }
  }

  const togglePause = () => {
    if (mediaRecorder.current && state.isRecording) {
      if (state.isPaused) {
        mediaRecorder.current.resume()
      } else {
        mediaRecorder.current.pause()
      }
      setState((prev) => ({ ...prev, isPaused: !prev.isPaused }))
    }
  }

  const handleSave = async () => {
    if (!state.audioUrl) return

    setState((prev) => ({ ...prev, isLoading: true }))
    try {
      const response = await fetch(state.audioUrl)
      const audioBlob = await response.blob()
      const formData = new FormData()
      formData.append('audio', audioBlob, 'recording.wav')

      const result = await fetch('http://localhost:5001/api/audio/convert', {
        method: 'POST',
        body: formData
      })

      const data = await result.json()
      if (data.success && data.data.text) {
        onSave({ audioUrl: state.audioUrl, transcribedText: data.data.text })
        onClose()
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: `Error: ${error.message}`,
        isLoading: false
      }))
    }
  }

  if (!isOpen) return null

  const formatTime = (seconds) =>
    `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 sm:p-4 z-40">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto max-h-[40vh] sm:max-h-[60vh] overflow-y-auto hide-scrollbar">
        <div className="p-2 sm:p-4 border-b flex justify-between items-center">
          <h2 className="text-base sm:text-lg font-semibold">Record Your Voice</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        <div className="p-2 sm:p-4 space-y-2 sm:space-y-4">
          {state.error && (
            <div className="bg-red-50 text-red-500 p-2 rounded-md text-xs sm:text-sm">
              {state.error}
            </div>
          )}

          <div className="text-center text-lg sm:text-2xl font-mono">
            {formatTime(state.recordingTime)}
          </div>

          <div ref={waveformRef} className="bg-gray-50 rounded-lg p-2 h-12 sm:h-16 md:h-20" />

          <div className="flex justify-center gap-2 sm:gap-4">
            {!state.isRecording ? (
              <button
                onClick={startRecording}
                className="bg-red-500 hover:bg-red-600 text-white p-2 sm:p-4 rounded-full"
              >
                <Mic className="w-4 h-4 sm:w-6 sm:h-6" />
              </button>
            ) : (
              <>
                <button
                  onClick={togglePause}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 sm:p-4 rounded-full"
                >
                  {state.isPaused ? (
                    <Play className="w-4 h-4 sm:w-6 sm:h-6" />
                  ) : (
                    <Pause className="w-4 h-4 sm:w-6 sm:h-6" />
                  )}
                </button>
                <button
                  onClick={stopRecording}
                  className="bg-red-500 hover:bg-red-600 text-white p-2 sm:p-4 rounded-full"
                >
                  <Square className="w-4 h-4 sm:w-6 sm:h-6" />
                </button>
              </>
            )}
          </div>

          <button
            onClick={handleSave}
            disabled={!state.audioUrl || state.isLoading}
            className={`w-full py-1.5 sm:py-2 px-3 rounded-lg text-white text-sm sm:text-base
              ${
                state.audioUrl && !state.isLoading
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
          >
            {state.isLoading ? 'Converting...' : 'Generate Text'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default VoiceRecorderModal
