
import React from 'react';

interface PoemDisplayProps {
  poem: string[];
  isLoading: boolean;
}

const PoemDisplay = ({ poem, isLoading }: PoemDisplayProps) => {
  return (
    <div className="w-full max-w-2xl mt-8">
      <div className="p-6 bg-poem paper-texture rounded-lg shadow-md border border-gray-200">
        <div className="flex justify-center mb-4">
          <div className="h-px w-16 bg-gray-300"></div>
        </div>
        
        {isLoading ? (
          <div className="py-8 flex flex-col items-center justify-center min-h-[200px]">
            <div className="w-8 h-8 border-t-2 border-primary border-solid rounded-full animate-spin mb-4"></div>
            <p className="text-muted-foreground">Crafting your poem...</p>
          </div>
        ) : poem.length > 0 ? (
          <div className="poem-text animate-fade-in text-gray-800 space-y-4">
            {poem.map((line, index) => (
              <p key={index} className="text-center">{line}</p>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground italic py-8">
            Your poem will appear here
          </div>
        )}
        
        <div className="flex justify-center mt-4">
          <div className="h-px w-16 bg-gray-300"></div>
        </div>
      </div>
    </div>
  );
};

export default PoemDisplay;
