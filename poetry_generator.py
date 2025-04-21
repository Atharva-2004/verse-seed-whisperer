# poetry_generator.py
import pandas as pd
import re
import random
import pickle
from collections import defaultdict
import nltk
from nltk.corpus import cmudict
import difflib

# Download CMU Pronouncing Dictionary
nltk.download('cmudict')
pronouncing_dict = cmudict.dict()

MODEL_FILE = "markov_model.pkl"

# Clean text (remove extra spaces)
def clean_text(text):
    text = re.sub(r'\s+', ' ', text).strip()
    return text

# Build Markov model from the poems dataset
def build_markov_model(poems):
    model = defaultdict(list)
    for poem in poems:
        words = clean_text(poem).split()
        for i in range(len(words) - 1):
            model[words[i]].append(words[i + 1])
    return dict(model)

# Save the Markov model to file
def save_model(model):
    with open(MODEL_FILE, 'wb') as f:
        pickle.dump(model, f)

# Load the saved model from file
def load_model():
    try:
        with open(MODEL_FILE, 'rb') as f:
            return pickle.load(f)
    except:
        return None

# Train the model and save it from the dataset
def train_and_save_model(csv_path='PoetryFoundationData.csv'):
    df = pd.read_csv(csv_path)
    poems = df['Poem'].dropna().tolist()
    model = build_markov_model(poems)
    save_model(model)
    return model

# Get rhyming words using CMU Pronouncing Dictionary
def get_rhymes(word):
    word = word.lower()
    if word not in pronouncing_dict:
        return set()
    
    rhymes = set()
    target_prons = pronouncing_dict[word]
    rhyme_sounds = [p[-2:] for p in target_prons if len(p) >= 2]

    for w, prons in pronouncing_dict.items():
        for p in prons:
            if len(p) >= 2 and p[-2:] in rhyme_sounds:
                rhymes.add(w)
    return rhymes

# Fuzzy matching for rhymes
def fuzzy_match_rhyme(word, candidates, threshold=0.6):
    matches = difflib.get_close_matches(word.lower(), [w.lower() for w in candidates], n=5, cutoff=threshold)
    return matches

# Generate a single line of poetry
def generate_line(model, word=None, max_words=10, rhyme_word=None, rhyme_scheme=None):
    if not model:
        return "Model not trained."
    
    # Start with a random word (not necessarily the seed word)
    current_word = random.choice(list(model.keys()))
    line = [current_word]

    for _ in range(max_words - 2):  # Leave space for final word
        next_words = model.get(current_word)
        if not next_words:
            break
        current_word = random.choice(next_words)
        line.append(current_word)

    # Optionally insert the seed word somewhere randomly (not always at start)
    if word and word not in line:
        insert_pos = random.randint(1, len(line) - 1)
        line.insert(insert_pos, word)

    # Now, ensure the final word matches the rhyme scheme
    next_options = model.get(current_word, [])
    final_word = current_word  # fallback
    
    if rhyme_word:
        # Get rhymes for the rhyme word
        rhymes = get_rhymes(rhyme_word)
        rhyming_words = [w for w in next_options if w.lower() in rhymes]
        
        # If no exact rhyme, try fuzzy matching
        if not rhyming_words:
            fuzzy_rhymes = fuzzy_match_rhyme(rhyme_word, next_options)
            if fuzzy_rhymes:
                final_word = random.choice(fuzzy_rhymes)
            elif next_options:
                final_word = random.choice(next_options)
        else:
            final_word = random.choice(rhyming_words)
    else:
        if next_options:
            final_word = random.choice(next_options)

    line.append(final_word)

    # Apply rhyme scheme if any
    if rhyme_scheme:
        # You could adjust the generation based on the rhyme scheme here, 
        # e.g., ensuring the last word of every line follows the expected rhyme scheme.
        pass

    return ' '.join(line)
