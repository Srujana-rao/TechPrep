
import { useState, useEffect, useCallback } from 'react';

interface SpeechRecognitionHookProps {
  continuous?: boolean;
  interimResults?: boolean;
  lang?: string;
  onTextUpdate?: (text: string) => void;
}

interface SpeechRecognitionHookReturn {
  text: string;
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  resetText: () => void;
  hasRecognitionSupport: boolean;
  error: string | null;
}

export const useSpeechRecognition = ({
  continuous = true,
  interimResults = true,
  lang = 'en-US',
  onTextUpdate
}: SpeechRecognitionHookProps = {}): SpeechRecognitionHookReturn => {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  // Check if browser supports speech recognition
  const hasRecognitionSupport = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;

  // Initialize speech recognition
  useEffect(() => {
    if (!hasRecognitionSupport) return;

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) return;
    
    const recognitionInstance = new SpeechRecognitionAPI();
    
    recognitionInstance.continuous = continuous;
    recognitionInstance.interimResults = interimResults;
    recognitionInstance.lang = lang;

    recognitionInstance.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognitionInstance.onend = () => {
      setIsListening(false);
    };

    recognitionInstance.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setError(event.error);
      setIsListening(false);
    };

    recognitionInstance.onresult = (event) => {
      let transcript = '';
      
      // Process all results including interim ones
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      
      setText(transcript);
      if (onTextUpdate) onTextUpdate(transcript);
    };

    setRecognition(recognitionInstance);

    // Cleanup
    return () => {
      if (recognitionInstance) {
        try {
          recognitionInstance.stop();
        } catch (err) {
          // Ignore errors when stopping (might not be started)
        }
      }
    };
  }, [continuous, interimResults, lang, hasRecognitionSupport, onTextUpdate]);

  const startListening = useCallback(() => {
    if (!recognition) return;
    
    setError(null);
    try {
      recognition.start();
    } catch (err) {
      console.error("Couldn't start speech recognition", err);
      
      // Handle the case where recognition is already started
      if (err instanceof DOMException && err.name === 'InvalidStateError') {
        try {
          recognition.stop();
          setTimeout(() => {
            recognition.start();
          }, 100);
        } catch (stopErr) {
          console.error("Error stopping and restarting recognition", stopErr);
          setError("Failed to restart speech recognition");
        }
      } else {
        setError("Failed to start speech recognition");
      }
    }
  }, [recognition]);

  const stopListening = useCallback(() => {
    if (!recognition) return;
    
    try {
      recognition.stop();
      setIsListening(false);
    } catch (err) {
      console.error("Error stopping speech recognition", err);
    }
  }, [recognition]);

  const resetText = useCallback(() => {
    setText('');
    if (onTextUpdate) onTextUpdate('');
  }, [onTextUpdate]);

  return {
    text,
    isListening,
    startListening,
    stopListening,
    resetText,
    hasRecognitionSupport,
    error
  };
};

export default useSpeechRecognition;
