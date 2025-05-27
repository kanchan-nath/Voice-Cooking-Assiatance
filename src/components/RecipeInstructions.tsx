import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Recipe } from '../types/recipe';
import { useVoice } from '../contexts/VoiceContext';
import VoiceControl from './VoiceControl';
import { 
  processVoiceCommand, 
  CommandType, 
  generateCommandResponse 
} from '../services/voiceCommandService';

interface RecipeInstructionsProps {
  recipe: Recipe;
}

const RecipeInstructions: React.FC<RecipeInstructionsProps> = ({ recipe }) => {
  const [currentStep, setCurrentStep] = useState(0); // 0 is ingredients view
  const [timer, setTimer] = useState<{ duration: number; remaining: number } | null>(null);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const { speak, stopSpeaking } = useVoice();
  const totalSteps = recipe.instructions.length;
  
  // Handle voice commands
  const handleVoiceCommand = (transcript: string) => {
    if (!transcript) return;
    
    const command = processVoiceCommand(transcript, recipe);
    const response = generateCommandResponse(command, currentStep, totalSteps);
    
    // Process the command
    switch (command.type) {
      case CommandType.NEXT_STEP:
        if (currentStep < totalSteps) {
          setCurrentStep(prev => prev + 1);
        }
        break;
      
      case CommandType.PREVIOUS_STEP:
        if (currentStep > 0) {
          setCurrentStep(prev => prev - 1);
        }
        break;
      
      case CommandType.REPEAT_STEP:
        // Will re-speak the current step below
        break;
      
      case CommandType.GO_TO_STEP:
        const requestedStep = command.payload.stepNumber;
        if (requestedStep >= 1 && requestedStep <= totalSteps) {
          setCurrentStep(requestedStep);
        }
        break;
      
      case CommandType.LIST_INGREDIENTS:
        setCurrentStep(0); // Go to ingredients view
        break;
      
      case CommandType.START_COOKING:
        setCurrentStep(1); // Go to first step
        break;
      
      case CommandType.TIMER:
        const { duration, unit } = command.payload;
        const durationInSeconds = unit === 'minutes' ? duration * 60 : duration;
        setTimer({ duration: durationInSeconds, remaining: durationInSeconds });
        setIsTimerActive(true);
        break;
      
      case CommandType.STOP_TIMER:
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
        setIsTimerActive(false);
        setTimer(null);
        break;
        
      default:
        break;
    }
    
    // Speak the response
    speak(response);
    
    // After response, speak the current content
    setTimeout(() => {
      if (currentStep === 0) {
        // Speak ingredients
        const ingredientsText = "Here are the ingredients: " + 
          recipe.ingredients.map(ing => `${ing.amount} ${ing.unit} ${ing.name}`).join(", ");
        speak(ingredientsText);
      } else if (currentStep > 0 && currentStep <= totalSteps) {
        // Speak current step
        const stepText = `Step ${currentStep}: ${recipe.instructions[currentStep - 1].step}`;
        speak(stepText);
      }
    }, 1500);
  };
  
  // Handle timer functionality
  useEffect(() => {
    if (timer && isTimerActive) {
      timerRef.current = setInterval(() => {
        setTimer(prev => {
          if (!prev) return null;
          
          const newRemaining = prev.remaining - 1;
          
          if (newRemaining <= 0) {
            // Timer complete
            speak("Timer is complete!");
            setIsTimerActive(false);
            if (timerRef.current) {
              clearInterval(timerRef.current);
            }
            return null;
          }
          
          return { ...prev, remaining: newRemaining };
        });
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timer, isTimerActive, speak]);
  
  // Automatically speak the step when it changes
  useEffect(() => {
    if (currentStep === 0) {
      // Speak the introduction and ingredients
      speak(`Let's cook ${recipe.title}. Here are the ingredients you'll need.`);
    } else if (currentStep > 0 && currentStep <= totalSteps) {
      // Speak the current step
      speak(`Step ${currentStep}: ${recipe.instructions[currentStep - 1].step}`);
    }
    
    return () => {
      stopSpeaking();
    };
  }, [currentStep, recipe, speak, stopSpeaking, totalSteps]);
  
  // Format timer display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  return (
    <div className="relative">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-medium">
          {currentStep === 0 ? 'Ingredients' : `Step ${currentStep} of ${totalSteps}`}
        </h2>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
            disabled={currentStep === 0}
            className="btn btn-ghost p-2 disabled:opacity-30"
            aria-label="Previous step"
          >
            <ArrowLeft size={20} />
          </button>
          
          <button 
            onClick={() => setCurrentStep(prev => Math.min(totalSteps, prev + 1))}
            disabled={currentStep === totalSteps}
            className="btn btn-ghost p-2 disabled:opacity-30"
            aria-label="Next step"
          >
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
      
      {/* Timer display */}
      <AnimatePresence>
        {timer && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-4 p-3 bg-accent/10 border border-accent rounded-md flex items-center justify-between"
          >
            <div>
              <span className="font-medium">Timer: </span>
              <span className="text-xl tabular-nums">{formatTime(timer.remaining)}</span>
            </div>
            <button 
              onClick={() => {
                if (timerRef.current) {
                  clearInterval(timerRef.current);
                }
                setIsTimerActive(false);
                setTimer(null);
              }}
              className="btn btn-sm btn-ghost"
            >
              Cancel
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Content area */}
      <div className="bg-muted rounded-lg p-5 min-h-[300px]">
        <AnimatePresence mode="wait">
          {currentStep === 0 ? (
            <motion.div
              key="ingredients"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-medium mb-4">You'll need:</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {recipe.ingredients.map((ingredient) => (
                  <li key={ingredient.id} className="flex items-start">
                    <span className="inline-block w-10 font-medium text-primary">
                      {ingredient.amount} {ingredient.unit}
                    </span>
                    <span className="ml-2">{ingredient.name}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 text-center">
                <button 
                  onClick={() => setCurrentStep(1)}
                  className="btn btn-primary px-6"
                >
                  Start Cooking
                </button>
              </div>
            </motion.div>
          ) : currentStep <= totalSteps ? (
            <motion.div
              key={`step-${currentStep}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col h-full"
            >
              <p className="text-lg leading-relaxed">
                {recipe.instructions[currentStep - 1].step}
              </p>
              
              {/* Equipment and ingredients used in this step, if available */}
              {recipe.instructions[currentStep - 1].equipment?.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">Equipment needed:</h4>
                  <ul className="flex flex-wrap gap-2">
                    {recipe.instructions[currentStep - 1].equipment?.map((item) => (
                      <li key={item.id} className="bg-background text-sm px-2 py-1 rounded-md">
                        {item.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="mt-auto pt-6 flex justify-between">
                {currentStep > 1 && (
                  <button 
                    onClick={() => setCurrentStep(prev => prev - 1)}
                    className="btn btn-ghost"
                  >
                    <ArrowLeft size={16} className="mr-1" /> Previous
                  </button>
                )}
                
                {currentStep < totalSteps && (
                  <button 
                    onClick={() => setCurrentStep(prev => prev + 1)}
                    className="btn btn-primary ml-auto"
                  >
                    Next <ArrowRight size={16} className="ml-1" />
                  </button>
                )}
                
                {currentStep === totalSteps && (
                  <div className="ml-auto">
                    <p className="text-success font-medium">
                      All done! Enjoy your meal!
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="completed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <h3 className="text-xl font-medium text-success mb-2">Recipe Completed!</h3>
              <p className="mb-4">Congratulations on making {recipe.title}!</p>
              <button 
                onClick={() => setCurrentStep(0)}
                className="btn btn-primary"
              >
                Start Over
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Voice control component */}
      <VoiceControl onCommand={handleVoiceCommand} />
    </div>
  );
};

export default RecipeInstructions;