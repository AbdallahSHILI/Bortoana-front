import React, { useState, useEffect } from 'react'
import AudioText from '../../assests/images/inputs/audiotext.png'
import AudioImage from '../../assests/images/inputs/audioimage.png'
import isListeningImage from '../../assests/images/inputs/isListening.png'
import StopListeningImage from '../../assests/images/inputs/stopListening.png'
import TranscriptComponent from './TranscriptComponent'

export default function AudioInputForm({ onClose }) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [mediaRecorder, setMediaRecorder] = useState(null)
  const [audioURL, setAudioURL] = useState(null)
  const [recognition, setRecognition] = useState(null)
  const [showTranscript, setShowTranscript] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Your browser does not support audio recording.')
      return
    }

    // Set up Speech Recognition if supported
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
    setTranscript('') // Reset transcript for new recording
    setShowTranscript(false)
    // Access user's microphone
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

      // Set loading to true to show the loader after stopping the recording
      setLoading(true)
      // Simulate processing time with a delay before showing the transcript
      setTimeout(() => {
        setLoading(false) // Stop loading after delay
        setShowTranscript(true)
      }, 1000)
    }

    recorder.start()
    setMediaRecorder(recorder)

    // Start speech recognition if available
    if (recognition) {
      recognition.start()
    }
  }

  const stopListening = () => {
    if (mediaRecorder) {
      mediaRecorder.stop() // Stop recording
    }
    if (recognition) {
      recognition.stop() // Stop speech recognition
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
    setShowTranscript(false) // Reset to show the recording interface
    setIsListening(false) // Ensure listening state is reset
  }

  const handleEditText = () => {
    console.log('Edit Text clicked')
  }

  // Render TranscriptComponent after stopping recording and receiving the transcript
  // if (!isListening && showTranscript && transcript) {
  return (
    <TranscriptComponent
      onClose={onClose}
      transcript={transcript}
      onRecordAgain={handleRecordAgain}
      onEditText={handleEditText}
    />
  )
  // }

  // return (
  //   <div className=" ml-16 w-full">
  //     <img src={AudioText} className="w-60 " alt="Audio Text" />
  //     <div className=" flex items-center justify-center">
  //       <div className="flex items-center justify-center flex-col  ">
  //         <img
  //           src={isListening ? isListeningImage : AudioImage}
  //           alt="Audio Icon"
  //           className="h-32 w-32"
  //         />
  //         <div className="text-white text-xs mt-5">
  //           {isListening ? 'Listening...' : 'Press to Start Speaking'}
  //         </div>
  //         {loading ? (
  //           <div className="loader mt-2 p-2 rounded-full bg-blue-500 w-8 h-8 flex items-center justify-center">
  //             {/* Loader or spinner animation */}
  //             <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
  //           </div>
  //         ) : isListening ? (
  //           // <img onClick={handleButtonClick} src={StopListeningImage} className='w-24 h-24  bg-slate-500' />
  //           <button
  //             onClick={handleButtonClick}
  //             className="mt-2 p-2 rounded-full bg-red-600 w-7 h-7 flex items-center justify-center space-x-[0.3px]"
  //           >
  //             <div className="bg-white w-1 h-2 rounded-full"></div>
  //             <div className="bg-white w-1 h-2  rounded-full"></div>
  //           </button>
  //         ) : (
  //           <button
  //             onClick={handleButtonClick}
  //             className="mt-2 p-2 rounded-full border-white border-2 w-7 h-7 items-center justify-center"
  //           >
  //             <div className="bg-red-600 w-2 h-2 rounded-full"></div>
  //           </button>
  //         )}
  //       </div>
  //     </div>
  //   </div>
  // )
}
