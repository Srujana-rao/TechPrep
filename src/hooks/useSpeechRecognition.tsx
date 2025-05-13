
import { useState } from 'react';

// This is a placeholder hook that maintains the same API but doesn't
// actually use Web Speech Recognition API
const useSpeechRecognition = () => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  
  // Dummy functions that maintain the API but don't do anything
  const startListening = () => {
    console.log('Speech recognition is disabled');
  };

  const stopListening = () => {
    console.log('Speech recognition is disabled');
  };

  const resetTranscript = () => {
    setTranscript('');
  };

  return {
    transcript,
    isListening: false,
    hasRecognitionSupport: false,
    startListening,
    stopListening,
    resetTranscript,
  };
};

export default useSpeechRecognition;
