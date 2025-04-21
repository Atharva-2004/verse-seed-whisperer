import React, { useState } from 'react';
import WordInput from './WordInput';
import PoemDisplay from './PoemDisplay';
import { useToast } from '@/hooks/use-toast';

const PoemGenerator = () => {
  const [poem, setPoem] = useState<string[]>([]);
  const [inputWord, setInputWord] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiMode, setApiMode] = useState<'normal' | 'markov' | 'trigram'| 'lstm'>('normal');
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

    const endpoint = {
      normal: 'http://localhost:5000/api/generate-poem',
      markov: 'http://localhost:5000/api/generate-markov-poem',
      trigram: 'http://localhost:5000/api/generate-markov-trigram-poem',
      lstm: 'http://localhost:5000/api/generate-lstm-poem'
    }[apiMode];

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ word }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

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
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto px-4 space-y-6">
      <div className="w-full max-w-md">
        <label htmlFor="mode" className="block text-sm font-medium text-gray-700 mb-1">
          Select Generation Mode
        </label>
        <select
          id="mode"
          value={apiMode}
          onChange={(e) => setApiMode(e.target.value as 'normal' | 'markov' | 'trigram' | 'lstm' )}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="normal">Hardcoded model</option>
          <option value="markov">Markov Chain Model (Single-Order)</option>
          <option value="trigram">Markov Chain Model (Trigram)</option>
          <option value="lstm">LSTM</option>
        </select>
      </div>

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
