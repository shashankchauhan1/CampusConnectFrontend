// client/src/hooks/useSpeechSynthesis.js
import { useState, useEffect } from 'react';

const useSpeechSynthesis = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const synth = window.speechSynthesis;

  const speak = (text) => {
    if (synth.speaking) {
      console.error('SpeechSynthesis.speaking');
      return;
    }
    if (text !== '') {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (event) => {
        console.error('SpeechSynthesisUtterance.onerror', event);
        setIsSpeaking(false);
      };
      synth.speak(utterance);
    }
  };

  const cancel = () => {
    synth.cancel();
    setIsSpeaking(false);
  };

  // Cancel speech when the component unmounts
  useEffect(() => {
    return () => {
      if (synth.speaking) {
        cancel();
      }
    };
  }, [synth]);

  return { speak, cancel, isSpeaking };
};

export default useSpeechSynthesis;