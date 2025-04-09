
# Verse Seed Whisperer

A poem generation application using soft computing concepts, specifically fuzzy logic for rhyme matching.

## Features

- Generate quatrains (4-line poems) from a single seed word
- Implements ABAB rhyme scheme using fuzzy logic
- Highlights the seed word when it appears in the generated poem
- Uses NLTK for phonetic analysis and rhyme detection

## Technology Stack

- **Backend**: Flask, Python, NLTK
- **Frontend**: React, TypeScript, Tailwind CSS
- **Soft Computing Concepts**: Fuzzy matching, probabilistic text generation

## Setup Instructions

1. Install Python dependencies:
   ```
   pip install -r requirements.txt
   ```

2. Install frontend dependencies:
   ```
   npm install
   ```

3. Run the Flask backend:
   ```
   python app.py
   ```

4. In a separate terminal, start the frontend development server:
   ```
   npm run dev
   ```

5. Open your browser and navigate to http://localhost:8080

## How It Works

1. The user enters a seed word in the input field
2. The system generates thematic vocabulary related to the seed word
3. Using fuzzy logic and phonetic matching, the system creates lines that follow an ABAB rhyme scheme
4. The resulting quatrain is displayed with the seed word highlighted if it appears in the poem

## Project Structure

- `/app.py` - Flask backend with poem generation logic
- `/src/` - React frontend application
  - `/components/` - React components for the UI
  - `/pages/` - Page-level components
  - `/utils/` - Utility functions

## Future Enhancements

- Add more complex rhyme schemes (AABB, ABBA, etc.)
- Implement syllable counting for meter
- Integrate with a word embedding model for better thematic coherence
- Allow users to save and share generated poems
