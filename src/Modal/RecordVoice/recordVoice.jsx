<<<<<<< HEAD
import React, { useState, useRef, useEffect } from 'react'
import { Mic, Square, Pause, Play, X } from 'lucide-react'
import WaveSurfer from 'wavesurfer.js'
=======
import React, { useState, useEffect, useRef } from 'react'
import WaveSurfer from 'wavesurfer.js'
import styles from './recordVoice.module.css'
>>>>>>> origin/develop2

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
<<<<<<< HEAD

  useEffect(() => {
    if (isOpen) {
      setupWaveform()
    }
    return () => cleanup()
  }, [isOpen])

  const setupWaveform = () => {
    if (wavesurfer.current) wavesurfer.current.destroy()

=======
  const micStream = useRef(null)
  const audioContext = useRef(null)
  const analyser = useRef(null)
  const animationId = useRef(null)

  useEffect(() => {
    if (isOpen) {
      resetState()
      setupWavesurfer()
    }
    return () => {
      cleanupAudio()
    }
  }, [isOpen])

  const setupWavesurfer = () => {
    if (wavesurfer.current) {
      wavesurfer.current.destroy()
    }

>>>>>>> origin/develop2
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
<<<<<<< HEAD
      normalize: true
    })
  }

  const cleanup = () => {
    if (timer.current) clearInterval(timer.current)
    if (wavesurfer.current) wavesurfer.current.destroy()
    if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
      mediaRecorder.current.stop()
    }
=======
      interact: false,
      normalize: true,
      partialRender: true,
      responsive: true,
      fillParent: true,
      audioContext: audioContext.current // Add this line
    })
  }

  const cleanupAudio = () => {
    if (animationId.current) {
      cancelAnimationFrame(animationId.current)
    }

    if (micStream.current) {
      micStream.current.getTracks().forEach((track) => track.stop())
    }

    if (audioContext.current) {
      audioContext.current.close()
    }

    if (wavesurfer.current) {
      wavesurfer.current.destroy()
    }

    clearTimer()
  }

  const visualize = () => {
    if (!analyser.current || !recordingState.isRecording) return

    const dataArray = new Float32Array(analyser.current.frequencyBinCount)

    const draw = () => {
      if (!recordingState.isRecording) return

      analyser.current.getFloatTimeDomainData(dataArray)

      // Calculate RMS (Root Mean Square) for better visualization
      let rms = 0
      for (let i = 0; i < dataArray.length; i++) {
        rms += dataArray[i] * dataArray[i]
      }
      rms = Math.sqrt(rms / dataArray.length)

      // Create a buffer with the current audio data
      const audioBuffer = audioContext.current.createBuffer(
        1,
        dataArray.length,
        audioContext.current.sampleRate
      )
      const channelData = audioBuffer.getChannelData(0)

      // Apply some amplification to make the waveform more visible
      const amplification = Math.min(1 / (rms + 0.0001), 5)
      for (let i = 0; i < dataArray.length; i++) {
        channelData[i] = Math.max(-1, Math.min(1, dataArray[i] * amplification))
      }

      // Update wavesurfer
      if (wavesurfer.current) {
        wavesurfer.current.loadDecodedBuffer(audioBuffer)
      }

      animationId.current = requestAnimationFrame(draw)
    }

    draw()
>>>>>>> origin/develop2
  }

  const startRecording = async () => {
    try {
<<<<<<< HEAD
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
=======
      setRecordingState((prev) => ({ ...prev, recordingTime: 0 }))

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      micStream.current = stream

      // Set up audio context and analyzer
      audioContext.current = new (window.AudioContext || window.webkitAudioContext)()
      const source = audioContext.current.createMediaStreamSource(stream)
      analyser.current = audioContext.current.createAnalyser()

      // Modify these parameters for better visualization
      analyser.current.fftSize = 1024 // Smaller FFT size for more responsive updates
      analyser.current.smoothingTimeConstant = 0.8 // Smooth out the visualization

      source.connect(analyser.current)

      visualize()

      // Create and set up media recorder
      const recorder = new MediaRecorder(stream)
      audioChunks.current = []

      recorder.ondataavailable = (event) => {
        audioChunks.current.push(event.data)
      }

      recorder.onstop = handleRecordingStop

      // Start recording
      recorder.start(1000)
      mediaRecorder.current = recorder

      // Start visualization
      visualize()

      // Update state and start timer
      setRecordingState((prev) => ({ ...prev, isRecording: true, error: null }))

      clearTimer()
      timer.current = setInterval(
        () =>
          setRecordingState((prev) => ({
            ...prev,
            recordingTime: prev.recordingTime + 1
          })),
        1000
      )
    } catch (err) {
      console.error('Recording error:', err)
      setRecordingState((prev) => ({
>>>>>>> origin/develop2
        ...prev,
        error: 'Please allow microphone access to record audio'
      }))
    }
  }

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
      mediaRecorder.current.stop()
<<<<<<< HEAD
      clearInterval(timer.current)
      mediaRecorder.current.stream.getTracks().forEach((track) => track.stop())
    }
  }

  const togglePause = () => {
    if (mediaRecorder.current && state.isRecording) {
      if (state.isPaused) {
=======
      clearTimer()
      cancelAnimationFrame(animationId.current)

      if (micStream.current) {
        micStream.current.getTracks().forEach((track) => track.stop())
      }

      setRecordingState((prev) => ({
        ...prev,
        isRecording: false,
        isPaused: false
      }))
    }
  }

  const handleRecordingStop = () => {
    if (audioChunks.current.length === 0) {
      setRecordingState((prev) => ({
        ...prev,
        error: 'No audio data was recorded'
      }))
      return
    }

    const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' })
    const url = URL.createObjectURL(audioBlob)

    // Load the complete recording into wavesurfer for playback
    if (wavesurfer.current) {
      wavesurfer.current.load(url)
    }

    setRecordingState((prev) => ({ ...prev, audioUrl: url }))
  }

  const resetState = () => {
    setRecordingState({
      isRecording: false,
      isPaused: false,
      error: null,
      audioUrl: null,
      recordingTime: 0,
      transcribedText: null,
      isLoading: false
    })
  }

  const clearTimer = () => {
    if (timer.current) clearInterval(timer.current)
  }

  const togglePause = () => {
    if (mediaRecorder.current && recordingState.isRecording) {
      if (recordingState.isPaused) {
>>>>>>> origin/develop2
        mediaRecorder.current.resume()
      } else {
        mediaRecorder.current.pause()
      }
<<<<<<< HEAD
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

=======
      setRecordingState((prev) => ({ ...prev, isPaused: !prev.isPaused }))
    }
  }

  const formatTime = (seconds) =>
    `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`

  const handleSave = async () => {
    console.log('Save button clicked')
    if (!recordingState.audioUrl) {
      console.error('No audio URL available')
      return
    }

    try {
      setRecordingState((prev) => ({ ...prev, isLoading: true, error: null }))

      const response = await fetch(recordingState.audioUrl)
      console.log('Fetched audio response:', response)

      if (!response.ok) {
        throw new Error('Failed to fetch audio data')
      }

      const audioBlob = await response.blob()
      console.log('Created audio blob:', audioBlob)

      const formData = new FormData()
      formData.append('audio', audioBlob, 'recording.wav')

      console.log('Sending request to server...')
>>>>>>> origin/develop2
      const result = await fetch('http://localhost:5001/api/audio/convert', {
        method: 'POST',
        body: formData
      })
<<<<<<< HEAD

      const data = await result.json()
      if (data.success && data.data.text) {
        onSave({ audioUrl: state.audioUrl, transcribedText: data.data.text })
        onClose()
      }
    } catch (error) {
      setState((prev) => ({
=======

      console.log('Server response:', result)

      if (!result.ok) {
        throw new Error(`Server error: ${result.status} ${result.statusText}`)
      }

      const data = await result.json()
      console.log('Server data:', data)

      if (data.success) {
        // Check if the transcribed text is empty
        if (!data.data.text || data.data.text.trim() === '') {
          setRecordingState((prev) => ({
            ...prev,
            error:
              'No speech detected in the recording. Please try recording again with clearer audio.',
            isLoading: false
          }))
          return
        }

        setRecordingState((prev) => ({
          ...prev,
          transcribedText: data.data.text,
          isLoading: false,
          recordingTime: 0
        }))

        try {
          if (onSave) {
            onSave({
              audioUrl: recordingState.audioUrl,
              transcribedText: data.data.text
            })
          }
        } catch (saveError) {
          console.error('Error in onSave handler:', saveError)
        }
      } else {
        throw new Error(data.message || 'Failed to convert audio to text')
      }
    } catch (error) {
      console.error('Error saving recording:', error)
      setRecordingState((prev) => ({
>>>>>>> origin/develop2
        ...prev,
        error: `Error: ${error.message}`,
        isLoading: false
      }))
    }
  }

  if (!isOpen) return null
<<<<<<< HEAD

  const formatTime = (seconds) =>
    `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-start p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md ml-80">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Record Your Voice</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {state.error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">{state.error}</div>
          )}

          <div className="text-center text-2xl font-mono">{formatTime(state.recordingTime)}</div>
=======

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Record Your Voice</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            disabled={recordingState.isLoading}
          >
            ×
          </button>
        </div>

        {recordingState.error && <div className={styles.errorMessage}>{recordingState.error}</div>}

        <div className={styles.recorderControls}>
          <div className={styles.timerDisplay}>{formatTime(recordingState.recordingTime)}</div>
>>>>>>> origin/develop2

          <div ref={waveformRef} className="bg-gray-50 rounded-lg p-2 h-24" />

<<<<<<< HEAD
          <div className="flex justify-center gap-4">
            {!state.isRecording ? (
              <button
=======
          <div className={styles.buttonsContainer}>
            {!recordingState.isRecording ? (
              <button
                className={styles.controlButton}
>>>>>>> origin/develop2
                onClick={startRecording}
                className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-full"
              >
                <Mic className="w-6 h-6" />
              </button>
            ) : (
              <>
                <button
<<<<<<< HEAD
                  onClick={togglePause}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white p-4 rounded-full"
=======
                  className={`${styles.controlButton} ${styles.stopButton}`}
                  onClick={stopRecording}
                  disabled={recordingState.isLoading}
>>>>>>> origin/develop2
                >
                  {state.isPaused ? <Play className="w-6 h-6" /> : <Pause className="w-6 h-6" />}
                </button>
                <button
                  onClick={stopRecording}
                  className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-full"
                >
                  <Square className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

<<<<<<< HEAD
          <button
=======
          {recordingState.transcribedText && (
            <div className={styles.transcriptionResult}>
              <h3>Transcribed Text:</h3>
              <p>{recordingState.transcribedText}</p>
              <button
                className={`${styles.pasteButton} ${styles.controlButton}`}
                onClick={() => {
                  onSave({
                    audioUrl: recordingState.audioUrl,
                    transcribedText: recordingState.transcribedText
                  })
                  onClose()
                }}
              >
                Paste to Notes
              </button>
            </div>
          )}
        </div>

        <div className={styles.saveButtonContainer}>
          <button
            className={`${styles.saveButton} ${!recordingState.audioUrl || recordingState.isLoading ? styles.disabled : ''}`}
>>>>>>> origin/develop2
            onClick={handleSave}
            disabled={!state.audioUrl || state.isLoading}
            className={`w-full py-2 px-4 rounded-lg text-white text-lg
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

<<<<<<< HEAD
export default VoiceRecorderModal
=======
export default RecordVoiceModal
>>>>>>> origin/develop2
