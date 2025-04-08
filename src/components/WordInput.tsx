
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface WordInputProps {
  onGenerate: (word: string) => void;
  isGenerating: boolean;
}

const WordInput = ({ onGenerate, isGenerating }: WordInputProps) => {
  const [word, setWord] = useState<string>('');
  const [showPlaceholder, setShowPlaceholder] = useState<boolean>(true);

  const exampleWords = ['nature', 'dream', 'love', 'time', 'hope', 'star', 'moon', 'heart'];
  const getRandomExample = () => exampleWords[Math.floor(Math.random() * exampleWords.length)];

  const handleWordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWord(e.target.value);
    setShowPlaceholder(e.target.value.length === 0);
  };

  const handleGenerate = () => {
    // Use example word if input is empty
    onGenerate(word.length > 0 ? word : getRandomExample());
  };

  const handleUseExample = () => {
    const example = getRandomExample();
    setWord(example);
    setShowPlaceholder(false);
  };

  return (
    <div className="w-full max-w-md">
      <div className="relative mb-4 bg-white rounded-md shadow-sm">
        <Input
          value={word}
          onChange={handleWordChange}
          className={cn(
            "p-4 text-xl bg-white rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200 font-serif",
            showPlaceholder ? "text-gray-400" : "text-gray-800"
          )}
          placeholder="Enter a single word..."
          maxLength={30}
        />
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
        <p className="text-sm text-muted-foreground">
          Enter a single word to inspire your poem
        </p>
        <div className="space-x-2">
          <Button
            variant="outline"
            onClick={handleUseExample}
            disabled={isGenerating}
            className="bg-white hover:bg-gray-50 transition-colors"
          >
            Random Word
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="bg-primary hover:bg-primary/90 transition-colors"
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Crafting...
              </>
            ) : (
              'Generate Poem'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WordInput;
