
import React, { useState } from 'react';
import WordInput from './WordInput';
import PoemDisplay from './PoemDisplay';
import { generatePoemFromWord } from '@/utils/markovChain';
import { useToast } from '@/hooks/use-toast';

const PoemGenerator = () => {
  const [poem, setPoem] = useState<string[]>([]);
  const [inputWord, setInputWord] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async (word: string) => {
    if (word.length < 3) {
      toast({
        title: "Input word too short",
        description: "Please provide a word with at least 3 characters.",
        variant: "destructive"
      });
      return;
    }

    setInputWord(word);
    setIsGenerating(true);
    
    // Simulate processing time to show loading state
    setTimeout(() => {
      try {
        const generatedPoem = generatePoemFromWord(word);
        setPoem(generatedPoem);
        
        if (generatedPoem.length < 4) {
          toast({
            title: "Limited poem quality",
            description: "The generator had trouble creating a proper quatrain with rhymes.",
            variant: "default"
          });
        }
      } catch (error) {
        console.error('Error generating poem:', error);
        toast({
          title: "Generation failed",
          description: "An error occurred while generating your poem. Please try again.",
          variant: "destructive"
        });
        setPoem(["Failed to generate poem. Please try with a different word."]);
      } finally {
        setIsGenerating(false);
      }
    }, 1500); // Slightly longer delay to simulate more complex processing
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto px-4">
      <WordInput 
        onGenerate={handleGenerate} 
        isGenerating={isGenerating} 
      />
      <PoemDisplay 
        poem={poem} 
        isLoading={isGenerating}
        highlightWord={inputWord}
      />
    </div>
  );
};

export default PoemGenerator;
