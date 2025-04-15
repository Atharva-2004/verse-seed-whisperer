# poetry_generator.py
import pandas as pd
import re
import random
import pickle
from collections import defaultdict

MODEL_FILE = "markov_model.pkl"

def clean_text(text):
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def build_markov_model(poems):
    model = defaultdict(list)
    for poem in poems:
        words = clean_text(poem).split()
        for i in range(len(words) - 1):
            model[words[i]].append(words[i + 1])
    return dict(model)

def save_model(model):
    with open(MODEL_FILE, 'wb') as f:
        pickle.dump(model, f)

def load_model():
    try:
        with open(MODEL_FILE, 'rb') as f:
            return pickle.load(f)
    except:
        return None

def train_and_save_model(csv_path='PoetryFoundationData.csv'):
    df = pd.read_csv(csv_path)
    poems = df['Poem'].dropna().tolist()
    model = build_markov_model(poems)
    save_model(model)
    return model

def generate_line(model,word, max_words=10):
    if not model:
        return "Model not trained."
    line = [word]
    for _ in range(max_words - 1):
        next_words = model.get(word)
        if not next_words:
            break
        word = random.choice(next_words)
        line.append(word)
    return ' '.join(line)
