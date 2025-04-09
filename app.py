
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import nltk
import numpy as np
import random
import re
from nltk.corpus import cmudict
import os

# Download necessary NLTK data
try:
    nltk.data.find('corpora/cmudict')
except LookupError:
    nltk.download('cmudict')

app = Flask(__name__, static_folder='dist')
CORS(app)  # Enable CORS for all routes

# Load CMU dictionary for rhyme detection
cmu_dict = cmudict.dict()

# Utility functions for soft computing poem generation
def get_last_syllable(word):
    """Get the last syllable of a word using CMU dictionary"""
    if word.lower() in cmu_dict:
        pronunciations = cmu_dict[word.lower()][0]
        # Find the last vowel sound and everything after it
        vowel_indices = [i for i, phone in enumerate(pronunciations) if any(c.isdigit() for c in phone)]
        if vowel_indices:
            last_vowel_idx = vowel_indices[-1]
            return pronunciations[last_vowel_idx:]
    return None

def words_rhyme(word1, word2, fuzzy_threshold=0.7):
    """Check if two words rhyme with fuzzy matching"""
    if word1.lower() == word2.lower():
        return False  # Same word doesn't count as rhyme
    
    syl1 = get_last_syllable(word1)
    syl2 = get_last_syllable(word2)
    
    if not syl1 or not syl2:
        return False
    
    # Exact match
    if syl1 == syl2:
        return 1.0
    
    # Fuzzy match - count matching phonemes
    matching_phonemes = sum(1 for a, b in zip(syl1, syl2) if a == b)
    max_length = max(len(syl1), len(syl2))
    similarity = matching_phonemes / max_length if max_length > 0 else 0
    
    return similarity >= fuzzy_threshold

def get_thematic_vocabulary(seed_word, word_list=None):
    """Generate thematic vocabulary related to the seed word"""
    # For now using a simple approach with predefined themes
    # In a full implementation, you might use word embeddings or a knowledge graph
    themes = {
        "love": ["heart", "passion", "embrace", "desire", "affection", "care", "kiss", "romance", "warmth", "devotion"],
        "nature": ["tree", "flower", "river", "mountain", "sky", "earth", "breeze", "sun", "moon", "star"],
        "time": ["clock", "moment", "hour", "day", "year", "past", "future", "present", "memory", "eternity"],
        "joy": ["happy", "smile", "laugh", "delight", "pleasure", "bliss", "cheer", "grin", "play", "dance"],
        "sorrow": ["tear", "pain", "grief", "cry", "mourn", "loss", "ache", "despair", "sadness", "woe"],
        "life": ["birth", "death", "journey", "path", "breath", "soul", "spirit", "existence", "living", "growing"],
        "hope": ["dream", "wish", "future", "aspire", "believe", "faith", "light", "promise", "horizon", "dawn"],
        "wisdom": ["knowledge", "learn", "think", "mind", "sage", "insight", "reason", "thought", "truth", "understand"]
    }
    
    # Default vocabulary if no match with themes
    default_vocab = ["time", "day", "heart", "life", "way", "world", "light", "mind", "hand", "eye", 
                    "night", "dream", "soul", "sky", "star", "flower", "path", "sea", "tree", "sun"]
    
    # Find the closest theme
    for theme, words in themes.items():
        if seed_word.lower() in words or seed_word.lower() == theme:
            return words + [theme] + default_vocab
    
    # If no theme matches, return default vocabulary + the seed word
    return [seed_word] + default_vocab

def generate_line(vocabulary, seed_word=None, line_length=(5, 10), end_word=None):
    """Generate a single line of poetry with optional constraints"""
    min_words, max_words = line_length
    num_words = random.randint(min_words, max_words)
    
    # Start with seed word if provided
    if seed_word and random.random() < 0.7:  # 70% chance to use seed word
        line = [seed_word]
        num_words -= 1
    else:
        line = [random.choice(vocabulary)]
    
    # If end_word is specified, we'll use it at the end
    if end_word:
        for _ in range(num_words - 1):
            line.append(random.choice(vocabulary))
        line.append(end_word)
    else:
        for _ in range(num_words - 1):
            line.append(random.choice(vocabulary))
    
    return " ".join(line)

def find_rhyming_word(word, vocabulary, fuzzy_threshold=0.7):
    """Find a word that rhymes with the given word from the vocabulary"""
    rhyming_words = []
    
    for vocab_word in vocabulary:
        similarity = words_rhyme(word, vocab_word, fuzzy_threshold)
        if similarity:
            rhyming_words.append((vocab_word, similarity))
    
    # Sort by similarity score
    rhyming_words.sort(key=lambda x: x[1], reverse=True)
    
    if rhyming_words:
        # Choose one of the top rhyming words with some randomness
        top_n = min(5, len(rhyming_words))
        return random.choice(rhyming_words[:top_n])[0]
    
    return random.choice(vocabulary)  # Fallback if no rhymes found

def generate_poem_with_rhyme_scheme(seed_word, rhyme_scheme="ABAB"):
    """Generate a quatrain with the specified rhyme scheme"""
    vocabulary = get_thematic_vocabulary(seed_word)
    
    # For ABAB rhyme scheme:
    # 1. Generate first line
    # 2. Extract its last word and find a rhyming word for the third line
    # 3. Generate second line
    # 4. Extract its last word and find a rhyming word for the fourth line
    
    poem_lines = []
    rhyme_words = {}
    
    for i, scheme_char in enumerate(rhyme_scheme):
        if scheme_char in rhyme_words:
            # Use existing rhyme
            end_word = find_rhyming_word(rhyme_words[scheme_char], vocabulary)
            line = generate_line(vocabulary, seed_word if i == 0 else None, end_word=end_word)
        else:
            # Create new rhyme
            line = generate_line(vocabulary, seed_word if i == 0 else None)
            last_word = line.split()[-1].strip(".,;:!?")
            rhyme_words[scheme_char] = last_word
        
        poem_lines.append(line)
    
    return poem_lines

@app.route('/api/generate-poem', methods=['POST'])
def generate_poem():
    data = request.get_json()
    word = data.get('word', '')
    
    if len(word) < 3:
        return jsonify({
            'success': False,
            'message': 'Input word must be at least 3 characters long',
            'poem': []
        }), 400
    
    try:
        poem = generate_poem_with_rhyme_scheme(word)
        return jsonify({
            'success': True,
            'poem': poem,
            'inputWord': word
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error generating poem: {str(e)}',
            'poem': []
        }), 500

# Serve the static files from the React build
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
