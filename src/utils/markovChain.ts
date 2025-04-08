
/**
 * A simple Markov chain implementation for text generation
 * This is a basic approach without using external LLM APIs
 */

// Define the order (context length) for the Markov chain
const DEFAULT_ORDER = 2;
// Define the maximum number of tries to generate each line
const MAX_TRIES = 50;
// Define minimum and maximum words per line
const MIN_WORDS_PER_LINE = 5;
const MAX_WORDS_PER_LINE = 10;
// Define the number of lines in the poem
const NUM_LINES = 4;

// Type for the Markov chain model
type MarkovModel = {
  [key: string]: string[];
};

/**
 * Tokenize the input text into words
 */
const tokenize = (text: string): string[] => {
  // Clean the text and split by non-word characters
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter(word => word.length > 0);
};

/**
 * Build a Markov chain model from input text
 */
const buildMarkovModel = (text: string, order: number = DEFAULT_ORDER): MarkovModel => {
  const words = tokenize(text);
  const model: MarkovModel = {};

  // Return empty model if not enough words
  if (words.length <= order) {
    return {};
  }

  // Build the model
  for (let i = 0; i <= words.length - order; i++) {
    // Create a key from the current context
    const key = words.slice(i, i + order).join(" ");
    
    // Add the following word to the model
    if (i + order < words.length) {
      const nextWord = words[i + order];
      if (!model[key]) {
        model[key] = [];
      }
      model[key].push(nextWord);
    }
  }

  return model;
};

/**
 * Generate next word based on current context
 */
const getNextWord = (model: MarkovModel, context: string[]): string | null => {
  const key = context.join(" ");
  
  // No matching context in the model
  if (!model[key] || model[key].length === 0) {
    return null;
  }
  
  // Randomly select a word from the possible next words
  const possibleNextWords = model[key];
  const randomIndex = Math.floor(Math.random() * possibleNextWords.length);
  return possibleNextWords[randomIndex];
};

/**
 * Generate a single line of poetry
 */
const generateLine = (
  model: MarkovModel, 
  order: number, 
  minWords: number = MIN_WORDS_PER_LINE,
  maxWords: number = MAX_WORDS_PER_LINE
): string => {
  // Get all possible starting contexts
  const startingKeys = Object.keys(model);
  if (startingKeys.length === 0) {
    return "Not enough seed text to generate poem";
  }
  
  // Try multiple times to generate a good line
  for (let attempt = 0; attempt < MAX_TRIES; attempt++) {
    // Start with a random context from the model
    const randomStartingKey = startingKeys[Math.floor(Math.random() * startingKeys.length)];
    let context = randomStartingKey.split(" ");
    let generated = [...context];
    
    // Generate the line word by word
    while (generated.length < maxWords) {
      const nextWord = getNextWord(model, context.slice(-order));
      
      // If no next word can be found, break
      if (!nextWord) {
        break;
      }
      
      generated.push(nextWord);
      context = [...context.slice(1), nextWord];
    }
    
    // If the line meets our criteria, return it
    if (generated.length >= minWords) {
      // Capitalize first letter
      generated[0] = generated[0].charAt(0).toUpperCase() + generated[0].slice(1);
      return generated.join(" ");
    }
  }
  
  return "Could not generate a suitable line";
};

/**
 * Add some variety to the ending punctuation
 */
const addPunctuation = (line: string, lineIndex: number, totalLines: number): string => {
  // End lines with different punctuation for variety
  if (lineIndex === totalLines - 1) {
    return `${line}.`; // Last line ends with a period
  }
  
  const punctuation = [",", ";", ":", ""];
  const randomPunct = punctuation[Math.floor(Math.random() * punctuation.length)];
  return `${line}${randomPunct}`;
};

/**
 * Generate a complete poem
 */
export const generatePoem = (
  seedText: string, 
  numLines: number = NUM_LINES,
  order: number = DEFAULT_ORDER
): string[] => {
  // If the seed text is too short, return an error
  if (seedText.length < 20) {
    return ["Please provide more seed text (at least 20 characters)"];
  }
  
  // Build the Markov model
  const model = buildMarkovModel(seedText, order);
  
  // If the model is empty, return an error
  if (Object.keys(model).length === 0) {
    return ["Not enough unique words in seed text"];
  }
  
  // Generate the poem line by line
  const poem: string[] = [];
  for (let i = 0; i < numLines; i++) {
    let line = generateLine(model, order);
    line = addPunctuation(line, i, numLines);
    poem.push(line);
  }
  
  return poem;
};

/**
 * Generate a poem with fallback to ensure output
 */
export const generatePoemWithFallback = (seedText: string): string[] => {
  // Try with different orders if needed
  let poem = generatePoem(seedText);
  
  // If failed with default order, try with order 1
  if (poem.length === 1 && poem[0].includes("Not enough")) {
    poem = generatePoem(seedText, NUM_LINES, 1);
  }
  
  // If still failing, use very simple word-level generation
  if (poem.length === 1 && poem[0].includes("Not enough")) {
    const words = tokenize(seedText);
    if (words.length >= 5) {
      // Extremely basic fallback: just pick random words from input
      poem = [];
      for (let i = 0; i < NUM_LINES; i++) {
        const lineWords = [];
        const lineLength = Math.floor(Math.random() * 
          (MAX_WORDS_PER_LINE - MIN_WORDS_PER_LINE + 1)) + MIN_WORDS_PER_LINE;
        
        for (let j = 0; j < lineLength; j++) {
          const randomWord = words[Math.floor(Math.random() * words.length)];
          lineWords.push(randomWord);
        }
        
        lineWords[0] = lineWords[0].charAt(0).toUpperCase() + lineWords[0].slice(1);
        poem.push(addPunctuation(lineWords.join(" "), i, NUM_LINES));
      }
    }
  }
  
  return poem;
};
