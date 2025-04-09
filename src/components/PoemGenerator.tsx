
import React, { useState } from 'react';
import WordInput from './WordInput';
import PoemDisplay from './PoemDisplay';
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
    
    try {
      const response = await fetch('http://localhost:5000/api/generate-poem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ word }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setPoem(data.poem);
      } else {
        toast({
          title: "Generation failed",
          description: data.message || "An error occurred while generating your poem.",
          variant: "destructive"
        });
        setPoem(["Failed to generate poem. Please try with a different word."]);
      }
    } catch (error) {
      console.error('Error generating poem:', error);
      toast({
        title: "Connection error",
        description: "Could not connect to poem generation service. Is the Flask server running?",
        variant: "destructive"
      });
      setPoem(["Failed to connect to poem generation service. Is the Flask server running?"]);
    } finally {
      setIsGenerating(false);
    }
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
