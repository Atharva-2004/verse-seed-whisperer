/**
 * Advanced poem generation using soft computing concepts
 * - Fuzzy logic for rhyme matching
 * - Probabilistic word selection with theme guidance
 * - ABAB rhyme scheme implementation
 */

// Dictionary of words with their rhyming sounds
// This simulates NLTK's rhyme detection capabilities
const rhymeDictionary: Record<string, string[]> = {
  // -ay sound rhymes
  "day": ["say", "way", "play", "stay", "may", "lay", "pay", "away", "today", "display"],
  "say": ["day", "way", "play", "stay", "may", "lay", "pay", "away", "today"],
  "way": ["day", "say", "play", "stay", "may", "lay", "pay", "away", "today"],
  
  // -ight sound rhymes
  "light": ["night", "sight", "bright", "fight", "might", "right", "tight", "flight", "delight"],
  "night": ["light", "sight", "bright", "fight", "might", "right", "tight", "flight"],
  "sight": ["light", "night", "bright", "fight", "might", "right", "tight", "flight"],
  
  // -ove sound rhymes
  "love": ["above", "dove", "glove", "shove", "thereof", "thereof"],
  "above": ["love", "dove", "glove", "shove"],
  
  // -eart sound rhymes
  "heart": ["part", "start", "art", "smart", "chart", "depart", "impart"],
  "part": ["heart", "start", "art", "smart", "chart", "depart"],
  
  // -ind sound rhymes
  "mind": ["kind", "find", "bind", "behind", "remind", "signed", "blind", "defined", "designed"],
  "find": ["mind", "kind", "bind", "behind", "remind", "signed", "blind"],
  
  // -ime sound rhymes
  "time": ["rhyme", "climb", "prime", "sublime", "crime", "mime", "chime"],
  "rhyme": ["time", "climb", "prime", "sublime", "crime", "mime"],
  
  // -ear sound rhymes
  "fear": ["near", "clear", "dear", "year", "appear", "tear", "hear"],
  "near": ["fear", "clear", "dear", "year", "appear", "tear", "hear"],
  
  // -ream sound rhymes
  "dream": ["stream", "cream", "team", "beam", "scheme", "theme", "supreme", "redeem"],
  "stream": ["dream", "cream", "team", "beam", "scheme", "theme", "supreme"],
  
  // -ire sound rhymes
  "fire": ["desire", "inspire", "tire", "wire", "choir", "require", "entire", "attire", "perspire"],
  "inspire": ["fire", "desire", "tire", "wire", "require", "entire"],
  
  // -ain sound rhymes
  "rain": ["pain", "gain", "main", "chain", "brain", "train", "again", "remain", "obtain"],
  "pain": ["rain", "gain", "main", "chain", "brain", "train", "again", "remain"],
  
  // -oon sound rhymes
  "moon": ["soon", "tune", "dune", "spoon", "noon", "immune", "commune", "balloon"],
  "soon": ["moon", "tune", "dune", "spoon", "noon", "immune", "commune"],

  // -ope sound rhymes
  "hope": ["cope", "slope", "rope", "scope", "elope", "pope", "telescope", "envelope"],
  "cope": ["hope", "slope", "rope", "scope", "elope", "pope", "telescope"],
  
  // -un sound rhymes
  "sun": ["run", "fun", "done", "gun", "none", "won", "begun", "undone", "spun"],
  "run": ["sun", "fun", "done", "gun", "none", "won", "begun", "undone"],
  
  // -tar sound rhymes
  "star": ["far", "car", "jar", "bar", "scar", "par", "bizarre", "radar"],
  "far": ["star", "car", "jar", "bar", "scar", "par", "bizarre"],
  
  // -ow sound rhymes
  "glow": ["flow", "know", "show", "grow", "blow", "slow", "below", "follow", "window"],
  "flow": ["glow", "know", "show", "grow", "blow", "slow", "below", "follow"],
  
  // -ide sound rhymes
  "side": ["wide", "tide", "hide", "ride", "guide", "pride", "provide", "inside", "decide"],
  "wide": ["side", "tide", "hide", "ride", "guide", "pride", "provide", "inside"],
};

// Vocabulary organized by sentiment/theme
// This is a simplified version of what might come from a neural network
const thematicVocabulary: Record<string, string[][]> = {
  // Nature words
  "nature": [
    ["green", "forest", "tree", "leaf", "flower", "bloom", "grow", "garden", "plant"],
    ["river", "stream", "flow", "water", "lake", "ocean", "wave", "shore", "beach"],
    ["sky", "cloud", "sun", "moon", "star", "light", "bright", "shine", "glow"],
    ["wind", "breeze", "gentle", "soft", "quiet", "peace", "calm", "serene", "still"]
  ],
  
  // Love words
  "love": [
    ["heart", "beat", "pulse", "feel", "warm", "touch", "embrace", "hold", "close"],
    ["care", "tender", "sweet", "kind", "gentle", "soft", "soothe", "comfort", "safe"],
    ["passion", "desire", "yearn", "want", "need", "long", "wish", "hope", "dream"],
    ["together", "forever", "always", "eternal", "bond", "tie", "join", "unite", "one"]
  ],
  
  // Time words
  "time": [
    ["moment", "second", "minute", "hour", "day", "night", "dawn", "dusk", "twilight"],
    ["past", "memory", "remember", "forget", "lost", "gone", "faded", "distant", "far"],
    ["present", "now", "here", "this", "current", "instant", "today", "immediate", "urgent"],
    ["future", "tomorrow", "soon", "coming", "approach", "await", "expect", "hope", "dream"]
  ],
  
  // Dream words
  "dream": [
    ["sleep", "night", "dark", "quiet", "peace", "rest", "calm", "still", "silent"],
    ["vision", "see", "imagine", "create", "form", "shape", "build", "make", "craft"],
    ["wish", "hope", "want", "desire", "yearn", "long", "aspire", "reach", "grasp"],
    ["fantasy", "unreal", "magic", "wonder", "awe", "amaze", "inspire", "delight", "joy"]
  ],
  
  // Hope words
  "hope": [
    ["wish", "dream", "desire", "want", "need", "crave", "seek", "search", "find"],
    ["future", "tomorrow", "soon", "coming", "next", "ahead", "forward", "onward", "upward"],
    ["light", "bright", "shine", "glow", "warm", "comfort", "soothe", "ease", "calm"],
    ["believe", "faith", "trust", "confidence", "sure", "certain", "know", "feel", "sense"]
  ],
  
  // Star words
  "star": [
    ["sky", "night", "dark", "space", "vast", "infinite", "endless", "eternal", "forever"],
    ["light", "shine", "glow", "bright", "twinkle", "sparkle", "flicker", "flash", "gleam"],
    ["distant", "far", "remote", "away", "beyond", "unreachable", "untouchable", "separate", "apart"],
    ["guide", "lead", "direct", "show", "point", "indicate", "mark", "signal", "sign"]
  ],
  
  // Moon words
  "moon": [
    ["night", "dark", "shadow", "shade", "black", "dim", "faint", "soft", "gentle"],
    ["light", "silver", "white", "pale", "glow", "shine", "beam", "ray", "luminous"],
    ["sky", "space", "heaven", "above", "high", "lofty", "elevated", "raised", "lifted"],
    ["cycle", "phase", "change", "shift", "turn", "revolve", "rotate", "spin", "circle"]
  ],
  
  // Heart words
  "heart": [
    ["beat", "pulse", "rhythm", "thump", "pound", "drum", "bang", "throb", "palpitate"],
    ["love", "care", "feel", "emotion", "passion", "ardor", "fervor", "zeal", "intensity"],
    ["center", "core", "middle", "inside", "within", "internal", "inner", "deep", "profound"],
    ["life", "live", "alive", "vital", "essential", "crucial", "important", "necessary", "key"]
  ],
  
  // Default/fallback words for any other theme
  "default": [
    ["time", "day", "moment", "hour", "instant", "second", "minute", "year", "age"],
    ["place", "space", "room", "area", "spot", "location", "position", "site", "zone"],
    ["person", "human", "being", "soul", "spirit", "mind", "heart", "body", "self"],
    ["thought", "idea", "concept", "notion", "belief", "view", "opinion", "perspective", "outlook"]
  ]
};

// Sentence templates for poem lines
const lineTemplates: string[] = [
  "The $adj $noun $verb with $adj $noun",
  "$adj $noun $verb in the $adj $noun",
  "$pron $verb the $adj $noun of $noun",
  "$adv, the $noun $verb like a $noun",
  "When $noun $verb, $pron $verb $adv",
  "$pron $verb $prep the $adj $noun",
  "As $adj as the $noun that $verb",
  "The $noun of $noun $verb $adv",
  "$noun $verb where $noun $verb $adv",
  "$pron $verb with $adj $noun and $noun"
];

// Parts of speech
const partOfSpeech: Record<string, string[]> = {
  "noun": [
    "heart", "mind", "soul", "life", "time", "world", "day", "night",
    "love", "hope", "dream", "star", "moon", "sun", "sky", "sea",
    "tree", "flower", "leaf", "wind", "rain", "snow", "fire", "ice",
    "bird", "song", "dance", "smile", "tear", "eye", "hand", "word",
    "voice", "silence", "moment", "memory", "thought", "wish", "way"
  ],
  "verb": [
    "flows", "shines", "speaks", "waits", "dreams", "hopes", "lives", "loves",
    "sings", "dances", "smiles", "cries", "sees", "hears", "feels", "knows",
    "grows", "falls", "rises", "calls", "whispers", "wanders", "wonders", "stays",
    "moves", "watches", "sleeps", "wakes", "breathes", "begins", "ends", "returns"
  ],
  "adj": [
    "gentle", "quiet", "soft", "sweet", "warm", "cold", "dark", "bright",
    "deep", "shallow", "high", "low", "old", "new", "young", "ancient",
    "wild", "tame", "fierce", "calm", "happy", "sad", "lost", "found",
    "lovely", "beautiful", "graceful", "elegant", "simple", "complex"
  ],
  "adv": [
    "gently", "quietly", "softly", "sweetly", "warmly", "coldly", "brightly",
    "deeply", "slowly", "quickly", "suddenly", "gradually", "eternally",
    "forever", "never", "always", "sometimes", "perhaps", "maybe", "surely"
  ],
  "prep": [
    "with", "without", "through", "beyond", "beneath", "above", "below",
    "beside", "between", "among", "around", "within", "outside", "inside"
  ],
  "pron": [
    "I", "you", "we", "they", "it", "one", "some", "all", "none", "each", "every"
  ]
};

// Find thematic words based on input
const getThematicWords = (inputWord: string): string[][] => {
  // Check if the input word has a direct thematic match
  if (thematicVocabulary[inputWord.toLowerCase()]) {
    return thematicVocabulary[inputWord.toLowerCase()];
  }
  
  // Try to find a close match
  for (const theme in thematicVocabulary) {
    // Simple fuzzy match: check if theme contains input or input contains theme
    if (theme.includes(inputWord.toLowerCase()) || inputWord.toLowerCase().includes(theme)) {
      return thematicVocabulary[theme];
    }
    
    // Check if the input word appears in any of the theme's word lists
    const found = thematicVocabulary[theme].some(wordList => 
      wordList.some(word => word === inputWord.toLowerCase())
    );
    
    if (found) {
      return thematicVocabulary[theme];
    }
  }
  
  // Fallback to default theme
  return thematicVocabulary["default"];
};

// Find rhyming words for a given word
const findRhymingWords = (word: string): string[] => {
  // Direct lookup
  if (rhymeDictionary[word.toLowerCase()]) {
    return rhymeDictionary[word.toLowerCase()];
  }
  
  // Look for words that might rhyme with the input word
  for (const baseWord in rhymeDictionary) {
    if (rhymeDictionary[baseWord].includes(word.toLowerCase())) {
      return [baseWord, ...rhymeDictionary[baseWord].filter(w => w !== word.toLowerCase())];
    }
  }
  
  // Fuzzy match: find words that end with the same 2+ characters
  if (word.length >= 3) {
    const ending = word.slice(-2).toLowerCase();
    const potentialRhymes: string[] = [];
    
    for (const baseWord in rhymeDictionary) {
      if (baseWord.endsWith(ending) && baseWord.toLowerCase() !== word.toLowerCase()) {
        potentialRhymes.push(baseWord);
      }
      
      for (const rhyme of rhymeDictionary[baseWord]) {
        if (rhyme.endsWith(ending) && rhyme.toLowerCase() !== word.toLowerCase() 
            && !potentialRhymes.includes(rhyme)) {
          potentialRhymes.push(rhyme);
        }
      }
    }
    
    if (potentialRhymes.length > 0) {
      return potentialRhymes;
    }
  }
  
  // Fallback to some common rhyming words
  return ["day", "way", "light", "night", "heart", "part", "see", "me", "find", "mind", "new", "true"];
};

// Replace template tags with actual words
const fillTemplate = (template: string, thematicWords: string[][], endWord: string | null = null): string => {
  let result = template;
  
  // Replace part-of-speech markers with words
  for (const pos in partOfSpeech) {
    while (result.includes(`$${pos}`)) {
      // Use thematic words when possible
      let wordPool: string[] = [];
      
      if (pos === "noun") {
        // Try to use thematic nouns (from first row)
        wordPool = thematicWords[0];
      } else if (pos === "verb") {
        // Try to use thematic verbs (from second row) 
        wordPool = thematicWords[1];
      } else if (pos === "adj" || pos === "adv") {
        // Try to use thematic adjectives/adverbs (from third row)
        wordPool = thematicWords[2];
      } else {
        // Use default parts of speech
        wordPool = partOfSpeech[pos];
      }
      
      // If this is the last word and we have a specific end word to use for rhyming
      if (endWord && result.lastIndexOf(`$${pos}`) === result.indexOf(`$${pos}`)) {
        result = result.replace(`$${pos}`, endWord);
      } else {
        const randomWord = wordPool[Math.floor(Math.random() * wordPool.length)];
        result = result.replace(`$${pos}`, randomWord);
      }
    }
  }
  
  // Capitalize first letter
  return result.charAt(0).toUpperCase() + result.slice(1);
};

// Generate a line with a particular ending word for rhyming
const generateLineWithEndingWord = (thematicWords: string[][], endWord: string): string => {
  // Select templates that end with a replaceable part of speech
  const suitableTemplates = lineTemplates.filter(template => {
    const parts = template.split(' ');
    const lastTagMatch = parts[parts.length - 1].match(/\$(\w+)/);
    return lastTagMatch && partOfSpeech[lastTagMatch[1]];
  });
  
  if (suitableTemplates.length === 0) {
    // Fallback if no suitable template is found
    return fillTemplate(lineTemplates[0], thematicWords) + ' ' + endWord;
  }
  
  const template = suitableTemplates[Math.floor(Math.random() * suitableTemplates.length)];
  
  // Determine which part of speech the ending word is
  let wordPos = "noun"; // Default
  for (const pos in partOfSpeech) {
    if (partOfSpeech[pos].includes(endWord.toLowerCase())) {
      wordPos = pos;
      break;
    }
  }
  
  // Replace the last tag of the matching part of speech with our end word
  const parts = template.split(' ');
  const lastTagIndex = parts.findIndex(part => part.includes(`$${wordPos}`));
  
  if (lastTagIndex >= 0) {
    parts[lastTagIndex] = parts[lastTagIndex].replace(`$${wordPos}`, endWord);
    return fillTemplate(parts.join(' '), thematicWords);
  }
  
  // If we couldn't fit the exact end word, create a line that ends with it
  return fillTemplate(template, thematicWords).replace(/\.$/, '') + ' ' + endWord;
};

// Main function to generate a poem from a single word
export const generatePoemFromWord = (inputWord: string): string[] => {
  if (inputWord.length < 3) {
    return ["Please provide a longer word"];
  }
  
  try {
    // Get thematic words based on input
    const thematicWords = getThematicWords(inputWord.toLowerCase());
    
    // Generate first line
    const firstLineTemplate = lineTemplates[Math.floor(Math.random() * lineTemplates.length)];
    const firstLine = fillTemplate(firstLineTemplate, thematicWords);
    
    // Extract last word of first line for rhyming
    const firstLineWords = firstLine.split(' ');
    const lastWordA = firstLineWords[firstLineWords.length - 1].replace(/[^\w]/g, '').toLowerCase();
    
    // Find rhyming word for A scheme
    const aRhymes = findRhymingWords(lastWordA);
    const rhymeForA = aRhymes.length > 0 ? aRhymes[Math.floor(Math.random() * aRhymes.length)] : "day";
    
    // Generate second line with a different rhyme sound (B)
    const secondLineTemplate = lineTemplates[Math.floor(Math.random() * lineTemplates.length)];
    const secondLine = fillTemplate(secondLineTemplate, thematicWords);
    
    // Extract last word of second line for rhyming
    const secondLineWords = secondLine.split(' ');
    const lastWordB = secondLineWords[secondLineWords.length - 1].replace(/[^\w]/g, '').toLowerCase();
    
    // Find rhyming word for B scheme
    const bRhymes = findRhymingWords(lastWordB);
    const rhymeForB = bRhymes.length > 0 ? bRhymes[Math.floor(Math.random() * bRhymes.length)] : "night";
    
    // Generate third line with rhyme for A
    const thirdLine = generateLineWithEndingWord(thematicWords, rhymeForA);
    
    // Generate fourth line with rhyme for B
    const fourthLine = generateLineWithEndingWord(thematicWords, rhymeForB);
    
    // Add proper punctuation
    return [
      firstLine + ',',
      secondLine + ';',
      thirdLine + ',',
      fourthLine + '.'
    ];
  } catch (error) {
    console.error('Error generating poem:', error);
    return ["Could not generate poem. Please try a different word."];
  }
};

// For backward compatibility, keep the older function
export const generatePoemWithFallback = (seedText: string): string[] => {
  const words = seedText.split(/\s+/);
  if (words.length === 0) return ["Please provide a seed word"];
  
  // Use the first word as input
  return generatePoemFromWord(words[0]);
};

// Keep the old function signature for compatibility
export const generatePoem = (seedText: string): string[] => {
  return generatePoemFromWord(seedText.split(/\s+/)[0]);
};
