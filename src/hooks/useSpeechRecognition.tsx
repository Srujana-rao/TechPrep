
import { useState, useEffect, useRef } from 'react';

interface UseSpeechRecognitionOptions {
  continuous?: boolean;
  interimResults?: boolean;
  lang?: string;
}

interface UseSpeechRecognitionReturn {
  transcript: string;
  isListening: boolean;
  hasRecognitionSupport: boolean;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

/**
 * React hook for using the Web Speech API for speech recognition
 */
export const useSpeechRecognition = ({
  continuous = true,
  interimResults = true,
  lang = 'en-US',
}: UseSpeechRecognitionOptions = {}): UseSpeechRecognitionReturn => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  
  // Check if browser supports speech recognition
  const hasRecognitionSupport = Boolean(
    typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)
  );

  // Set up speech recognition
  useEffect(() => {
    if (!hasRecognitionSupport) return;

    // Get the appropriate SpeechRecognition constructor
    const SpeechRecognitionAPI = 
      window.SpeechRecognition || 
      window.webkitSpeechRecognition;
    
    if (!SpeechRecognitionAPI) return;
    
    const recognition = new SpeechRecognitionAPI();
    
    recognition.continuous = continuous;
    recognition.interimResults = interimResults;
    recognition.lang = lang;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let currentTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        currentTranscript += result[0].transcript;
      }
      
      setTranscript(currentTranscript);
    };

    recognition.onend = () => {
      if (isListening) {
        recognition.start();
      } else {
        setIsListening(false);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [continuous, hasRecognitionSupport, interimResults, isListening, lang]);

  const startListening = () => {
    if (!hasRecognitionSupport || !recognitionRef.current) return;
    
    setIsListening(true);
    recognitionRef.current.start();
  };

  const stopListening = () => {
    if (!hasRecognitionSupport || !recognitionRef.current) return;
    
    setIsListening(false);
    recognitionRef.current.stop();
  };

  const resetTranscript = () => {
    setTranscript('');
  };

  return {
    transcript,
    isListening,
    hasRecognitionSupport,
    startListening,
    stopListening,
    resetTranscript,
  };
};

export default useSpeechRecognition;
