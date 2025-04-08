
import React, { useState } from 'react';
import TextInput from './TextInput';
import PoemDisplay from './PoemDisplay';
import { generatePoemWithFallback } from '@/utils/markovChain';
import { useToast } from '@/components/ui/use-toast';

const PoemGenerator = () => {
  const [poem, setPoem] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async (seedText: string) => {
    if (seedText.length < 20) {
      toast({
        title: "Seed text too short",
        description: "Please provide at least 20 characters of seed text.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate processing time to show loading state
    // (the algorithm is very fast but we want to show the loading state)
    setTimeout(() => {
      try {
        const generatedPoem = generatePoemWithFallback(seedText);
        setPoem(generatedPoem);
        
        if (generatedPoem.length === 1 && generatedPoem[0].includes("Not enough")) {
          toast({
            title: "Limited poem quality",
            description: "Your seed text may be too short or repetitive for optimal results.",
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
        setPoem(["Failed to generate poem. Please try with different seed text."]);
      } finally {
        setIsGenerating(false);
      }
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto px-4">
      <TextInput 
        onGenerate={handleGenerate} 
        isGenerating={isGenerating} 
      />
      <PoemDisplay 
        poem={poem} 
        isLoading={isGenerating} 
      />
    </div>
  );
};

export default PoemGenerator;
