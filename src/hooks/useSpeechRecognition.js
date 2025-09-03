// client/src/hooks/useSpeechRecognition.js
import { useState, useEffect, useRef } from 'react';

const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      console.error("Web Speech API is not supported by this browser.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event) => console.error("Speech recognition error", event.error);
    
    recognition.onresult = (event) => {
      let finalTranscript = transcript; // Start with the existing transcript
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + ' '; // Append final results
        }
      }
      setTranscript(finalTranscript);
    };

    recognitionRef.current = recognition;
  }, [transcript]); // We re-run this effect if the transcript changes to keep the closure updated

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };
  
  // New function to allow clearing the transcript
  const resetTranscript = () => {
      setTranscript('');
  }

  return { isListening, transcript, startListening, stopListening, resetTranscript };
};

export default useSpeechRecognition;