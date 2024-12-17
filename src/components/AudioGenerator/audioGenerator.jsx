import React, { useState, useEffect } from 'react'
import AudioText from '../../assests/images/inputs/audiotext.png'
import AudioImage from '../../assests/images/inputs/audioimage.png'
import isListeningImage from '../../assests/images/inputs/isListening.png'
import StopListeningImage from '../../assests/images/inputs/stopListening.png'
import TranscriptComponent from '../Inputs/TranscriptComponent'
import styles from './audioGenerator.module.css'

export default function AudioGenerator() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [mediaRecorder, setMediaRecorder] = useState(null)
  const [audioURL, setAudioURL] = useState(null)
  const [recognition, setRecognition] = useState(null)
  const [showTranscript, setShowTranscript] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Your browser   does not support audio recording.')
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      const newRecognition = new SpeechRecognition()
      newRecognition.continuous = true
      newRecognition.interimResults = true

      newRecognition.onresult = (event) => {
        const finalTranscript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join('')
        setTranscript(finalTranscript)
      }
      setRecognition(newRecognition)
    }
  }, [])

  const startListening = async () => {
    setIsListening(true)
    setTranscript('')
    setShowTranscript(false)
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const recorder = new MediaRecorder(stream)
    const audioChunks = []

    recorder.ondataavailable = (event) => {
      audioChunks.push(event.data)
    }

    recorder.onstop = () => {
      const audioBlob = new Blob(audioChunks)
      const url = URL.createObjectURL(audioBlob)
      setAudioURL(url)

      setLoading(true)
      setTimeout(() => {
        setLoading(false)
        setShowTranscript(true)
      }, 1000)
    }

    recorder.start()
    setMediaRecorder(recorder)

    if (recognition) {
      recognition.start()
    }
  }

  const stopListening = () => {
    if (mediaRecorder) {
      mediaRecorder.stop()
    }
    if (recognition) {
      recognition.stop()
    }
    setIsListening(false)
    setShowTranscript(true)
  }

  const handleButtonClick = (e) => {
    e.stopPropagation()
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  const handleRecordAgain = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setTranscript('')
    setAudioURL(null)
    setShowTranscript(false)
    setIsListening(false)
  }

  const handleEditText = () => {
    console.log('Edit Text clicked')
  }

  return (
    <div className={styles.container}>
      <img src={AudioText} className={styles.audioTextImage} alt="Audio Text" />
      <div className={styles.audioContent}>
        <div className={styles.audioControls}>
          <img
            src={isListening ? isListeningImage : AudioImage}
            alt="Audio Icon"
            className={styles.audioIcon}
          />
          <div className={styles.statusText}>
            {isListening ? 'Listening...' : 'Press to Start Speaking'}
          </div>
          {loading ? (
            <div className={styles.loader}>
              <div className={styles.spinnerAnimation}></div>
            </div>
          ) : isListening ? (
            <button onClick={handleButtonClick} className={styles.stopButton}>
              <div className={styles.stopButtonBar}></div>
              <div className={styles.stopButtonBar}></div>
            </button>
          ) : (
            <button onClick={handleButtonClick} className={styles.recordButton}>
              <div className={styles.recordButtonDot}></div>
            </button>
          )}
        </div>
      </div>
      {!isListening && showTranscript && transcript && (
        <TranscriptComponent
          transcript={transcript}
          onRecordAgain={handleRecordAgain}
          onEditText={handleEditText}
        />
      )}
    </div>
  )
}
