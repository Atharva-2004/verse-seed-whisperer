# trigram_poetry_generator.py
import pandas as pd
import re
import random
import pickle
from collections import defaultdict

TRIGRAM_MODEL_FILE = "markov_trigram_model.pkl"

def clean_text(text):
    text = re.sub(r'\s+', ' ', text).strip()
    return text.lower()

def build_trigram_markov_model(poems):
    model = defaultdict(list)
    for poem in poems:
        words = re.findall(r'\b\w+\b', poem.lower())  # Better tokenization
        for i in range(len(words) - 2):
            key = (words[i], words[i + 1])
            model[key].append(words[i + 2])
    return dict(model)


def save_model(model):
    with open(TRIGRAM_MODEL_FILE, 'wb') as f:
        pickle.dump(model, f)

def load_model():
    try:
        with open(TRIGRAM_MODEL_FILE, 'rb') as f:
            return pickle.load(f)
    except:
        return None

def train_and_save_model(csv_path='PoetryFoundationData.csv'):
    df = pd.read_csv(csv_path)
    poems = df['Poem'].dropna().tolist()
    model = build_trigram_markov_model(poems)
    save_model(model)
    return model

def generate_line(model, input_word, max_words=10):
    if not model:
        return "Model not trained."

    # Try to find starting bigrams that contain the input word
    possible_starts = [k for k in model.keys() if input_word.lower() in k]
    
    if not possible_starts:
        # fallback to random if no match
        start = random.choice(list(model.keys()))
    else:
        start = random.choice(possible_starts)

    w1, w2 = start
    line = [w1, w2]

    for _ in range(max_words - 2):
        next_words = model.get((w1, w2))
        if not next_words:
            break
        next_word = random.choice(next_words)
        line.append(next_word)
        w1, w2 = w2, next_word

    return ' '.join(line)
