from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import nltk
import numpy as np
import random
import re
import os
from nltk.corpus import cmudict, wordnet as wn
from poetry_generator import load_model as load_markov_model, generate_line as markov_generate_line
from trigram_poetry_generator import load_model as load_markov_trigram_model, generate_line as markov_trigram_generate_line


# Download necessary NLTK data
try:
    nltk.data.find('corpora/cmudict')
except LookupError:
    nltk.download('cmudict')

try:
    nltk.data.find('corpora/wordnet')
except LookupError:
    nltk.download('wordnet')

app = Flask(__name__, static_folder='dist')
CORS(app)  # Enable CORS for all routes

# Load CMU dictionary for rhyme detection
cmu_dict = cmudict.dict()

# --------------------------------------------
# Utility Functions
# --------------------------------------------

def get_last_syllable(word):
    """Get the last syllable of a word using CMU dictionary"""
    if word.lower() in cmu_dict:
        pronunciations = cmu_dict[word.lower()][0]
        vowel_indices = [i for i, phone in enumerate(pronunciations) if any(c.isdigit() for c in phone)]
        if vowel_indices:
            last_vowel_idx = vowel_indices[-1]
            return pronunciations[last_vowel_idx:]
    return None

def words_rhyme(word1, word2, fuzzy_threshold=0.7):
    """Check if two words rhyme"""
    if word1.lower() == word2.lower():
        return False
    syl1 = get_last_syllable(word1)
    syl2 = get_last_syllable(word2)
    if not syl1 or not syl2:
        return False
    if syl1 == syl2:
        return 1.0
    matching_phonemes = sum(1 for a, b in zip(syl1, syl2) if a == b)
    max_length = max(len(syl1), len(syl2))
    similarity = matching_phonemes / max_length if max_length > 0 else 0
    return similarity >= fuzzy_threshold

def get_thematic_vocabulary(seed_word, word_list=None):
    """Get a list of related poetic vocabulary words"""
    if not word_list:
        word_list = [
            "love", "nature", "sky", "heart", "soul", "peace", "joy", "pain", "storm",
            "light", "dark", "time", "dream", "hope", "fire", "ice", "life", "death"
        ]
    
    synsets = wn.synsets(seed_word)
    if not synsets:
        return word_list

    related_words = set()
    for syn in synsets:
        for lemma in syn.lemmas():
            related_words.add(lemma.name().lower())
        for hyper in syn.hypernyms():
            related_words.update(lemma.name().lower() for lemma in hyper.lemmas())
        for hypo in syn.hyponyms():
            related_words.update(lemma.name().lower() for lemma in hypo.lemmas())

    final_vocab = [word for word in related_words if word.isalpha() and len(word) > 2]
    if not final_vocab:
        return word_list
    return list(set(final_vocab + ["heart", "sky", "dream", "soul", "light", "dark", "storm"]))

def generate_line(vocabulary, seed_word=None, line_length=(5, 10), end_word=None):
    min_words, max_words = line_length
    num_words = random.randint(min_words, max_words)

    line = [seed_word] if seed_word and random.random() < 0.7 else [random.choice(vocabulary)]
    num_words -= 1

    if end_word:
        for _ in range(num_words - 1):
            line.append(random.choice(vocabulary))
        line.append(end_word)
    else:
        for _ in range(num_words):
            line.append(random.choice(vocabulary))
    
    return " ".join(line)

def find_rhyming_word(word, vocabulary, fuzzy_threshold=0.7):
    rhyming_words = []
    for vocab_word in vocabulary:
        similarity = words_rhyme(word, vocab_word, fuzzy_threshold)
        if similarity:
            rhyming_words.append((vocab_word, similarity))
    
    rhyming_words.sort(key=lambda x: x[1], reverse=True)
    if rhyming_words:
        top_n = min(5, len(rhyming_words))
        return random.choice(rhyming_words[:top_n])[0]
    
    return random.choice(vocabulary)

def generate_poem_with_rhyme_scheme(seed_word, rhyme_scheme="ABAB"):
    vocabulary = get_thematic_vocabulary(seed_word)
    poem_lines = []
    rhyme_words = {}

    for i, scheme_char in enumerate(rhyme_scheme):
        if scheme_char in rhyme_words:
            end_word = find_rhyming_word(rhyme_words[scheme_char], vocabulary)
            line = generate_line(vocabulary, seed_word if i == 0 else None, end_word=end_word)
        else:
            line = generate_line(vocabulary, seed_word if i == 0 else None)
            last_word = line.split()[-1].strip(".,;:!?")
            rhyme_words[scheme_char] = last_word
        poem_lines.append(line)

    return poem_lines


markov_model = load_markov_model()
markov_trigram_model = load_markov_trigram_model()

# --------------------------------------------
# API Route
# --------------------------------------------

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


@app.route('/api/generate-markov-poem', methods=['POST'])
def generate_markov_poem():
    data = request.get_json()
    word = data.get('word')
    try:
        print("loaded markov single order model: ",type(markov_model),"length: ",len(markov_model) if markov_model else "none")
        poem = [markov_generate_line(markov_model,word) for _ in range(4)]
        return jsonify({
            'success': True,
            'poem': poem
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error generating poem with Markov: {str(e)}',
            'poem': []
        }), 500
    

@app.route('/api/generate-markov-trigram-poem', methods=['POST'])
def generate_markov_trigram_poem():
    data = request.get_json()
    word = data.get('word')
    try:
        print("Loaded trigram model:", type(markov_trigram_model), "Length:", len(markov_trigram_model) if markov_trigram_model else "None")
        poem = [markov_trigram_generate_line(markov_trigram_model,word) for _ in range(4)]
        return jsonify({
            'success': True,
            'poem': poem
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error generating poem with Markov: {str(e)}',
            'poem': []
        }), 500
    

# --------------------------------------------
# Serve React Frontend
# --------------------------------------------

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

# --------------------------------------------
# Main
# --------------------------------------------

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
