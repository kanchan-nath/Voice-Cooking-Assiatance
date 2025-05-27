import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

interface VoiceContextType {
  isListening: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  speak: (text: string) => void;
  isSpeaking: boolean;
  stopSpeaking: () => void;
  error: string | null;
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

export const VoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Initialize speech recognition and synthesis on component mount
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const current = event.resultIndex;
        const result = event.results[current];
        const transcript = result[0].transcript;
        setTranscript(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        setError(`Speech recognition error: ${event.error}`);
      };
    } else {
      setError('Speech recognition not supported in this browser');
    }

    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    } else {
      setError('Speech synthesis not supported in this browser');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (synthRef.current && utteranceRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const startListening = useCallback(() => {
    setTranscript('');
    setError(null);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        if (err instanceof Error) {
          setError(`Could not start speech recognition: ${err.message}`);
        }
      }
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  const speak = useCallback((text: string) => {
    if (synthRef.current) {
      // Stop any current speech
      synthRef.current.cancel();
      
      // Create a new utterance
      utteranceRef.current = new SpeechSynthesisUtterance(text);
      
      // Set properties for better cooking assistant voice
      utteranceRef.current.rate = 1.0;  // Normal speed
      utteranceRef.current.pitch = 1.0; // Normal pitch
      
      // Try to find a nice voice if available
      const voices = synthRef.current.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Female') || voice.name.includes('Google') || voice.name.includes('Samantha')
      );
      
      if (preferredVoice) {
        utteranceRef.current.voice = preferredVoice;
      }
      
      // Set event handlers
      utteranceRef.current.onstart = () => setIsSpeaking(true);
      utteranceRef.current.onend = () => setIsSpeaking(false);
      utteranceRef.current.onerror = (event) => {
        setError(`Speech synthesis error: ${event.error}`);
        setIsSpeaking(false);
      };
      
      // Speak the text
      synthRef.current.speak(utteranceRef.current);
    }
  }, []);

  const stopSpeaking = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return (
    <VoiceContext.Provider value={{
      isListening,
      transcript,
      startListening,
      stopListening,
      speak,
      isSpeaking,
      stopSpeaking,
      error
    }}>
      {children}
    </VoiceContext.Provider>
  );
};

export const useVoice = (): VoiceContextType => {
  const context = useContext(VoiceContext);
  if (context === undefined) {
    throw new Error('useVoice must be used within a VoiceProvider');
  }
  return context;
};