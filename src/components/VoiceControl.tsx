import React, { useEffect, useState } from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVoice } from '../contexts/VoiceContext';

interface VoiceControlProps {
  onCommand: (command: string) => void;
}

const VoiceControl: React.FC<VoiceControlProps> = ({ onCommand }) => {
  const { 
    isListening, 
    startListening, 
    stopListening, 
    transcript, 
    speak,
    isSpeaking,
    stopSpeaking,
    error 
  } = useVoice();
  
  const [showTranscript, setShowTranscript] = useState(false);
  
  // Process transcript when it changes
  useEffect(() => {
    if (transcript && isListening) {
      setShowTranscript(true);
      // Clear the transcript display after 5 seconds
      const timer = setTimeout(() => {
        setShowTranscript(false);
      }, 5000);
      
      // Send the command to the parent component
      onCommand(transcript);
      
      return () => clearTimeout(timer);
    }
  }, [transcript, isListening, onCommand]);
  
  // Show error for 3 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        // Reset error after 3 seconds (this would be handled in a real app)
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="fixed bottom-4 right-4 z-20 flex flex-col items-end space-y-2">
      {/* Transcript display */}
      <AnimatePresence>
        {showTranscript && transcript && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="bg-background border border-border rounded-lg p-3 shadow-lg max-w-xs"
          >
            <p className="text-sm">
              <span className="font-medium">I heard: </span>
              {transcript}
            </p>
          </motion.div>
        )}
        
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="bg-error/10 border border-error/30 text-error rounded-lg p-3 shadow-lg max-w-xs"
          >
            <p className="text-sm">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Voice controls */}
      <div className="flex space-x-2">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={isSpeaking ? stopSpeaking : () => {}}
          className={`p-3 rounded-full shadow-lg 
            ${isSpeaking 
              ? 'bg-secondary text-white' 
              : 'bg-muted text-muted-foreground cursor-default'}`}
          disabled={!isSpeaking}
          aria-label={isSpeaking ? "Stop speaking" : "Not speaking"}
        >
          {isSpeaking ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </motion.button>
        
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={isListening ? stopListening : startListening}
          className={`p-3 rounded-full shadow-lg 
            ${isListening 
              ? 'bg-accent text-white animate-pulse' 
              : 'bg-primary text-white'}`}
          aria-label={isListening ? "Stop listening" : "Start listening"}
        >
          {isListening ? <Mic size={24} /> : <MicOff size={24} />}
        </motion.button>
      </div>
    </div>
  );
};

export default VoiceControl;