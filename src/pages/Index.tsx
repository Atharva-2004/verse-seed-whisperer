
import React from 'react';
import PoemGenerator from '@/components/PoemGenerator';

const Index = () => {
  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-gray-800 mb-4">
            Verse Seed Whisperer
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Generate beautiful quatrains from a single seed word using fuzzy logic and rhyme matching.
            No external LLM APIs, just soft computing creativity.
          </p>
        </header>

        <main>
          <PoemGenerator />
        </main>

        <footer className="mt-16 text-center text-sm text-gray-500">
          <p>A soft computing project for poem generation</p>
          <p className="mt-2 flex justify-center space-x-2">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-mono">
              fuzzy-logic
            </span>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-mono">
              rhyme-detection
            </span>
            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-mono">
              quatrain-generator
            </span>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
