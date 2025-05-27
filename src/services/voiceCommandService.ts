import { Recipe } from '../types/recipe';

// Command types for different voice actions
export enum CommandType {
  NEXT_STEP = 'NEXT_STEP',
  PREVIOUS_STEP = 'PREVIOUS_STEP',
  REPEAT_STEP = 'REPEAT_STEP',
  GO_TO_STEP = 'GO_TO_STEP',
  LIST_INGREDIENTS = 'LIST_INGREDIENTS',
  FIND_INGREDIENT = 'FIND_INGREDIENT',
  HOW_MUCH = 'HOW_MUCH',
  START_COOKING = 'START_COOKING',
  TIMER = 'TIMER',
  STOP_TIMER = 'STOP_TIMER',
  UNKNOWN = 'UNKNOWN'
}

interface Command {
  type: CommandType;
  payload?: any;
}

// Process voice input to extract commands
export const processVoiceCommand = (transcript: string, recipe: Recipe | null): Command => {
  const lowerTranscript = transcript.toLowerCase().trim();
  
  // Next step commands
  if (/^next( step)?$|^continue$|^go on$|^proceed$|^forward$/.test(lowerTranscript)) {
    return { type: CommandType.NEXT_STEP };
  }
  
  // Previous step commands
  if (/^(previous|last)( step)?$|^go back$|^back$/.test(lowerTranscript)) {
    return { type: CommandType.PREVIOUS_STEP };
  }
  
  // Repeat step commands
  if (/^repeat( step)?$|^again$|^say (that|it) again$/.test(lowerTranscript)) {
    return { type: CommandType.REPEAT_STEP };
  }
  
  // Go to specific step
  const goToStepMatch = lowerTranscript.match(/^(go to|jump to|step) (\d+)$/);
  if (goToStepMatch) {
    const stepNumber = parseInt(goToStepMatch[2], 10);
    return { 
      type: CommandType.GO_TO_STEP,
      payload: { stepNumber } 
    };
  }
  
  // List all ingredients
  if (/^(list|what are|show) (the )?ingredients$/.test(lowerTranscript)) {
    return { type: CommandType.LIST_INGREDIENTS };
  }
  
  // Find specific ingredient information
  const ingredientMatch = lowerTranscript.match(/^(what|how much|do i need|is there) .* (of )?([a-z ]+)(\?)?$/);
  if (ingredientMatch) {
    const ingredientName = ingredientMatch[3].trim();
    
    if (recipe) {
      const ingredient = recipe.ingredients.find(ing => 
        ing.name.toLowerCase().includes(ingredientName)
      );
      
      if (ingredient) {
        if (/how much|do i need/.test(lowerTranscript)) {
          return { 
            type: CommandType.HOW_MUCH,
            payload: { ingredient } 
          };
        } else {
          return { 
            type: CommandType.FIND_INGREDIENT,
            payload: { ingredient } 
          };
        }
      }
    }
  }
  
  // Start cooking
  if (/^(start|begin|let's start|let's begin)( cooking)?$/.test(lowerTranscript)) {
    return { type: CommandType.START_COOKING };
  }
  
  // Set timer
  const timerMatch = lowerTranscript.match(/^(set|start)( a)? timer( for)? (\d+) (minute|minutes|min|mins|second|seconds|sec|secs)$/);
  if (timerMatch) {
    const duration = parseInt(timerMatch[4], 10);
    const unit = timerMatch[5].startsWith('m') ? 'minutes' : 'seconds';
    return { 
      type: CommandType.TIMER,
      payload: { duration, unit } 
    };
  }
  
  // Stop timer
  if (/^(stop|cancel|end)( the)? timer$/.test(lowerTranscript)) {
    return { type: CommandType.STOP_TIMER };
  }
  
  // Unknown command
  return { type: CommandType.UNKNOWN, payload: { transcript: lowerTranscript } };
};

// Generate response for each command type
export const generateCommandResponse = (command: Command, currentStep: number, totalSteps: number): string => {
  switch (command.type) {
    case CommandType.NEXT_STEP:
      if (currentStep >= totalSteps) {
        return "You've reached the end of the recipe. Congratulations on completing the dish!";
      }
      return "Moving to the next step.";
      
    case CommandType.PREVIOUS_STEP:
      if (currentStep <= 1) {
        return "You're already at the first step.";
      }
      return "Going back to the previous step.";
      
    case CommandType.REPEAT_STEP:
      return "I'll repeat the current step.";
      
    case CommandType.GO_TO_STEP:
      const requestedStep = command.payload.stepNumber;
      if (requestedStep < 1 || requestedStep > totalSteps) {
        return `This recipe only has ${totalSteps} steps. Please choose a step between 1 and ${totalSteps}.`;
      }
      return `Going to step ${requestedStep}.`;
      
    case CommandType.LIST_INGREDIENTS:
      return "Here are all the ingredients for this recipe.";
      
    case CommandType.FIND_INGREDIENT:
      return `Found ${command.payload.ingredient.name} in the recipe.`;
      
    case CommandType.HOW_MUCH:
      const { ingredient } = command.payload;
      return `You need ${ingredient.amount} ${ingredient.unit} of ${ingredient.name}.`;
      
    case CommandType.START_COOKING:
      return "Let's start cooking! I'll guide you through each step.";
      
    case CommandType.TIMER:
      const { duration, unit } = command.payload;
      return `Setting a timer for ${duration} ${unit}.`;
      
    case CommandType.STOP_TIMER:
      return "Timer stopped.";
      
    case CommandType.UNKNOWN:
      return `I didn't understand "${command.payload.transcript}". Try saying "next step", "repeat", or "go back".`;
      
    default:
      return "I'm not sure how to help with that.";
  }
};