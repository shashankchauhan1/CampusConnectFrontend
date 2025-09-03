// client/src/components/InterviewPage.jsx
import React, { useState, useEffect } from 'react';
import Vapi from '@vapi-ai/web';

// --- ACTION REQUIRED: PASTE YOUR KEYS HERE ---
const VAPI_PUBLIC_KEY = "8246f765-b17d-4d0e-b4a6-d2934a5ec998";
const VAPI_ASSISTANT_ID = "72f31508-cf76-410a-809b-27a07e6673d0";
// -----------------------------------------

const vapi = new Vapi(VAPI_PUBLIC_KEY);

const InterviewPage = () => {
  const [callStatus, setCallStatus] = useState('idle');
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    // Event listeners to update our UI based on the call's state
    const onCallStart = () => setCallStatus('connected');
    const onCallEnd = () => setCallStatus('ended');
    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);
    const onError = (e) => {
      console.error(e);
      setCallStatus('error');
    };

    vapi.on('call-start', onCallStart);
    vapi.on('call-end', onCallEnd);
    vapi.on('speech-start', onSpeechStart);
    vapi.on('speech-end', onSpeechEnd);
    vapi.on('error', onError);

    // This is a cleanup function that runs when the component is removed
    return () => {
      vapi.off('call-start', onCallStart);
      vapi.off('call-end', onCallEnd);
      vapi.off('speech-start', onSpeechStart);
      vapi.off('speech-end', onSpeechEnd);
      vapi.off('error', onError);
    };
  }, []); // The empty array means this runs only once

  const startCall = () => {
    setCallStatus('connecting');
    vapi.start(VAPI_ASSISTANT_ID);
  };

  const endCall = () => {
    vapi.stop();
  };

  return (
    <div className="container mx-auto px-6 py-8 flex flex-col items-center justify-center text-center" style={{ minHeight: 'calc(100vh - 140px)' }}>
      <h1 className="text-4xl font-extrabold text-white mb-4">Vapi Integration Test</h1>
      <p className="text-lg text-gray-300 mb-8">Let's establish a basic connection.</p>
      
      <div className={`relative w-48 h-48 rounded-full flex items-center justify-center transition-all duration-300 mb-6
        ${isSpeaking ? 'bg-indigo-500 shadow-2xl shadow-indigo-500/50 animate-pulse' : 'bg-gray-700'}`}
      >
        <span className="text-6xl z-10">{isSpeaking ? '🔊' : '🤖'}</span>
      </div>
      
      <p className="text-xl font-semibold text-white mb-6">
        Status: <span className="text-gray-300">{callStatus}</span>
      </p>

      <button 
        onClick={callStatus === 'connected' ? endCall : startCall}
        className={`w-full max-w-xs py-3 text-white font-semibold rounded-lg transition duration-300 ${callStatus === 'connected' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
      >
        {callStatus === 'connected' ? 'End Call' : 'Start Call'}
      </button>
    </div>
  );
};

export default InterviewPage;