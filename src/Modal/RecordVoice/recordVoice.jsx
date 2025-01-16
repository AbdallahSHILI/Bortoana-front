import React, { useState, useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';
import styles from './recordVoice.module.css';

const RecordVoiceModal = ({ isOpen, onClose, onSave }) => {
  const [recordingState, setRecordingState] = useState({
    isRecording: false,
    isPaused: false,
    error: null,
    audioUrl: null,
    recordingTime: 0,
    transcribedText: null,
    isLoading: false
  });

  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const timer = useRef(null);
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);
  const micStream = useRef(null);
  const audioContext = useRef(null);
  const analyser = useRef(null);
  const animationId = useRef(null);

  useEffect(() => {
    if (isOpen) {
      resetState();
      setupWavesurfer();
    }
    return () => {
      cleanupAudio();
    };
  }, [isOpen]);

  const setupWavesurfer = () => {
    if (wavesurfer.current) {
      wavesurfer.current.destroy();
    }
  
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
      interact: false,
      normalize: true,
      partialRender: true,
      responsive: true,
      fillParent: true,
      audioContext: audioContext.current // Add this line
    });
  };

  const cleanupAudio = () => {
    if (animationId.current) {
      cancelAnimationFrame(animationId.current);
    }

    if (micStream.current) {
      micStream.current.getTracks().forEach(track => track.stop());
    }

    if (audioContext.current) {
      audioContext.current.close();
    }

    if (wavesurfer.current) {
      wavesurfer.current.destroy();
    }

    clearTimer();
  };

  const visualize = () => {
    if (!analyser.current || !recordingState.isRecording) return;
  
    const dataArray = new Float32Array(analyser.current.frequencyBinCount);
    
    const draw = () => {
      if (!recordingState.isRecording) return;
  
      analyser.current.getFloatTimeDomainData(dataArray);
      
      // Calculate RMS (Root Mean Square) for better visualization
      let rms = 0;
      for (let i = 0; i < dataArray.length; i++) {
        rms += dataArray[i] * dataArray[i];
      }
      rms = Math.sqrt(rms / dataArray.length);
  
      // Create a buffer with the current audio data
      const audioBuffer = audioContext.current.createBuffer(1, dataArray.length, audioContext.current.sampleRate);
      const channelData = audioBuffer.getChannelData(0);
      
      // Apply some amplification to make the waveform more visible
      const amplification = Math.min(1 / (rms + 0.0001), 5);
      for (let i = 0; i < dataArray.length; i++) {
        channelData[i] = Math.max(-1, Math.min(1, dataArray[i] * amplification));
      }
  
      // Update wavesurfer
      if (wavesurfer.current) {
        wavesurfer.current.loadDecodedBuffer(audioBuffer);
      }
  
      animationId.current = requestAnimationFrame(draw);
    };
  
    draw();
  };

  const startRecording = async () => {
    try {
      setRecordingState(prev => ({ ...prev, recordingTime: 0 }));
  
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStream.current = stream;
  
      // Set up audio context and analyzer
      audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContext.current.createMediaStreamSource(stream);
      analyser.current = audioContext.current.createAnalyser();
      
      // Modify these parameters for better visualization
      analyser.current.fftSize = 1024; // Smaller FFT size for more responsive updates
      analyser.current.smoothingTimeConstant = 0.8; // Smooth out the visualization
      
      source.connect(analyser.current);

          visualize();

      // Create and set up media recorder
      const recorder = new MediaRecorder(stream);
      audioChunks.current = [];

      recorder.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      recorder.onstop = handleRecordingStop;

      // Start recording
      recorder.start(1000);
      mediaRecorder.current = recorder;

      // Start visualization
      visualize();

      // Update state and start timer
      setRecordingState(prev => ({ ...prev, isRecording: true, error: null }));
      
      clearTimer();
      timer.current = setInterval(
        () => setRecordingState(prev => ({
          ...prev,
          recordingTime: prev.recordingTime + 1,
        })),
        1000
      );

    } catch (err) {
      console.error('Recording error:', err);
      setRecordingState(prev => ({
        ...prev,
        error: 'Please allow microphone access to record audio'
      }));
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
      mediaRecorder.current.stop();
      clearTimer();
      cancelAnimationFrame(animationId.current);
      
      if (micStream.current) {
        micStream.current.getTracks().forEach(track => track.stop());
      }
      
      setRecordingState(prev => ({ 
        ...prev, 
        isRecording: false, 
        isPaused: false 
      }));
    }
  };

  const handleRecordingStop = () => {
    if (audioChunks.current.length === 0) {
      setRecordingState(prev => ({
        ...prev,
        error: "No audio data was recorded"
      }));
      return;
    }

    const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
    const url = URL.createObjectURL(audioBlob);
    
    // Load the complete recording into wavesurfer for playback
    if (wavesurfer.current) {
      wavesurfer.current.load(url);
    }
    
    setRecordingState(prev => ({ ...prev, audioUrl: url }));
  };


  const resetState = () => {
    setRecordingState({
      isRecording: false,
      isPaused: false,
      error: null,
      audioUrl: null,
      recordingTime: 0,
      transcribedText: null,
      isLoading: false
    });
  };

  

  const clearTimer = () => {
    if (timer.current) clearInterval(timer.current);
  };



  const togglePause = () => {
    if (mediaRecorder.current && recordingState.isRecording) {
      if (recordingState.isPaused) {
        mediaRecorder.current.resume();
      } else {
        mediaRecorder.current.pause();
      }
      setRecordingState((prev) => ({ ...prev, isPaused: !prev.isPaused }));
    }
  };

  const formatTime = (seconds) => `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;

  const handleSave = async () => {
    console.log("Save button clicked");
    if (!recordingState.audioUrl) {
      console.error("No audio URL available");
      return;
    }
  
    try {
      setRecordingState(prev => ({ ...prev, isLoading: true, error: null }));
  
      const response = await fetch(recordingState.audioUrl);
      console.log("Fetched audio response:", response);
      
      if (!response.ok) {
        throw new Error('Failed to fetch audio data');
      }
  
      const audioBlob = await response.blob();
      console.log("Created audio blob:", audioBlob);
  
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');
  
      console.log("Sending request to server...");
      const result = await fetch('http://localhost:5001/api/audio/convert', {
        method: 'POST',
        body: formData,
      });
  
      console.log("Server response:", result);
  
      if (!result.ok) {
        throw new Error(`Server error: ${result.status} ${result.statusText}`);
      }
  
      const data = await result.json();
      console.log("Server data:", data);
  
      if (data.success) {
        // Check if the transcribed text is empty
        if (!data.data.text || data.data.text.trim() === '') {
          setRecordingState(prev => ({
            ...prev,
            error: "No speech detected in the recording. Please try recording again with clearer audio.",
            isLoading: false
          }));
          return;
        }

        setRecordingState(prev => ({
          ...prev,
          transcribedText: data.data.text,
          isLoading: false,
          recordingTime: 0
        }));
  
        try {
          if (onSave) {
            onSave({
              audioUrl: recordingState.audioUrl,
              transcribedText: data.data.text
            });
          }
        } catch (saveError) {
          console.error('Error in onSave handler:', saveError);
        }
      } else {
        throw new Error(data.message || 'Failed to convert audio to text');
      }
    } catch (error) {
      console.error('Error saving recording:', error);
      setRecordingState(prev => ({
        ...prev,
        error: `Error: ${error.message}`,
        isLoading: false
      }));
    }
  };


  if (!isOpen) return null;

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

        {recordingState.error && (
          <div className={styles.errorMessage}>{recordingState.error}</div>
        )}

        <div className={styles.recorderControls}>
          <div className={styles.timerDisplay}>
            {formatTime(recordingState.recordingTime)}
          </div>

          <div className={styles.waveformContainer} ref={waveformRef}></div>

          <div className={styles.buttonsContainer}>
            {!recordingState.isRecording ? (
              <button 
                className={styles.controlButton} 
                onClick={startRecording}
                disabled={recordingState.isLoading}
              >
                Start Recording
              </button>
            ) : (
              <>
                <button 
                  className={`${styles.controlButton} ${styles.stopButton}`} 
                  onClick={stopRecording}
                  disabled={recordingState.isLoading}
                >
                  Stop Recording
                </button>
                <button
                  className={`${styles.controlButton} ${styles.pauseButton}`}
                  onClick={togglePause}
                  disabled={recordingState.isLoading}
                >
                  {recordingState.isPaused ? 'Resume Recording' : 'Pause Recording'}
                </button>
              </>
            )}
          </div>

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
                  });
                  onClose();
                }}
              >
                Paste to Notes
              </button>
            </div>
          )}
        </div>

        <div className={styles.saveButtonContainer}>
          <button
            className={`${styles.saveButton} ${(!recordingState.audioUrl || recordingState.isLoading) ? styles.disabled : ''}`}
            onClick={handleSave}
            disabled={!recordingState.audioUrl || recordingState.isLoading}
          >
            {recordingState.isLoading ? 'Converting...' : 'Generate Text'}
            {!recordingState.audioUrl && ' (No Audio)'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecordVoiceModal;