
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface TextInputProps {
  onGenerate: (text: string) => void;
  isGenerating: boolean;
}

const TextInput = ({ onGenerate, isGenerating }: TextInputProps) => {
  const [text, setText] = useState<string>('');
  const [showPlaceholder, setShowPlaceholder] = useState<boolean>(true);

  const defaultText = `The sun rises over the distant mountains, casting golden rays across the valley. Birds sing their morning melodies as the world awakens to a new day. The gentle breeze carries whispers of ancient stories through the rustling leaves. Nature paints a masterpiece of colors and sounds for those who pause to notice.`;

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    setShowPlaceholder(e.target.value.length === 0);
  };

  const handleGenerate = () => {
    // Use default text if input is empty
    onGenerate(text.length > 0 ? text : defaultText);
  };

  const handleUseExample = () => {
    setText(defaultText);
    setShowPlaceholder(false);
  };

  return (
    <div className="w-full max-w-2xl">
      <div className="relative mb-2">
        <Textarea
          value={text}
          onChange={handleTextChange}
          className={cn(
            "min-h-32 p-4 text-base bg-white rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200 font-serif",
            showPlaceholder ? "text-gray-400" : "text-gray-800"
          )}
          placeholder="Enter your seed text here..."
        />
        {showPlaceholder && (
          <Button 
            variant="link" 
            className="absolute right-2 top-2 text-sm text-primary hover:text-primary/80"
            onClick={handleUseExample}
          >
            Use Example
          </Button>
        )}
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-2">
        <p className="text-sm text-muted-foreground">
          Enter text to inspire your poem (minimum 20 characters)
        </p>
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
              Generating...
            </>
          ) : (
            'Generate Poem'
          )}
        </Button>
      </div>
    </div>
  );
};

export default TextInput;
