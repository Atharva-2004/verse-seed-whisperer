import pandas as pd
import re
import numpy as np
import pickle
import tensorflow as tf
from tensorflow.keras.models import Sequential, load_model as keras_load_model
from tensorflow.keras.layers import Embedding, LSTM, Dense
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences

# Constants
MODEL_PATH = 'lstm_poetry_model.h5'
TOKENIZER_PATH = 'lstm_tokenizer.pkl'
MAX_VOCAB_SIZE = 5000
MAX_SEQUENCE_LEN = 30
MAX_LINES = 5000
BATCH_SIZE = 256
EPOCHS = 10

# --- Utility Functions ---

def clean_text(text):
    text = re.sub(r"([.,!?;:\"\'])", r" \1 ", text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip().lower()

def load_data(csv_path='PoetryFoundationData.csv'):
    df = pd.read_csv(csv_path)
    poems = df['Poem'].dropna().tolist()
    cleaned_lines = []
    for poem in poems:
        lines = poem.strip().split('\n')
        for line in lines:
            if line.strip():
                cleaned_lines.append(clean_text(line))
    return cleaned_lines[:MAX_LINES]

def prepare_sequences(corpus, tokenizer=None):
    if tokenizer is None:
        tokenizer = Tokenizer(oov_token='<OOV>', num_words=MAX_VOCAB_SIZE)
        tokenizer.fit_on_texts(corpus)

    input_sequences = []
    for line in corpus:
        token_list = tokenizer.texts_to_sequences([line])[0][:MAX_SEQUENCE_LEN]
        for i in range(1, len(token_list)):
            n_gram_seq = token_list[:i + 1]
            input_sequences.append(n_gram_seq)

    max_sequence_len = max(len(seq) for seq in input_sequences)
    input_sequences = pad_sequences(input_sequences, maxlen=max_sequence_len, padding='pre')

    xs, labels = input_sequences[:, :-1], input_sequences[:, -1]
    return xs, labels, tokenizer, max_sequence_len

def build_model(vocab_size, max_sequence_len):
    model = Sequential()
    model.add(Embedding(input_dim=vocab_size, output_dim=100, input_length=max_sequence_len - 1))
    model.add(LSTM(150, return_sequences=True))
    model.add(LSTM(100))
    model.add(Dense(vocab_size, activation='softmax'))
    model.compile(loss='sparse_categorical_crossentropy', optimizer='adam', metrics=['accuracy'])
    return model

def train_and_save(csv_path='PoetryFoundationData.csv'):
    corpus = load_data(csv_path)
    xs, ys, tokenizer, max_seq_len = prepare_sequences(corpus)
    vocab_size = min(MAX_VOCAB_SIZE, len(tokenizer.word_index) + 1)
    model = build_model(vocab_size, max_seq_len)

    model.fit(xs, ys, epochs=EPOCHS, verbose=1, batch_size=BATCH_SIZE)
    model.save(MODEL_PATH)
    with open(TOKENIZER_PATH, 'wb') as f:
        pickle.dump(tokenizer, f)

    print("✅ Model and tokenizer saved!")

def load_model():
    with open(TOKENIZER_PATH, 'rb') as f:
        tokenizer = pickle.load(f)
    model = keras_load_model(MODEL_PATH)
    return model, tokenizer

def sample_with_temperature(preds, temperature=1.0):
    preds = np.asarray(preds).astype('float64')
    preds = np.log(preds + 1e-10) / temperature
    exp_preds = np.exp(preds)
    preds = exp_preds / np.sum(exp_preds)
    probas = np.random.multinomial(1, preds, 1)
    return np.argmax(probas)

def generate_poem(seed_text, model, tokenizer, num_lines=4, max_words=15, temperature=1.0):
    output = []
    max_seq_len = model.input_shape[1]

    for _ in range(num_lines):
        line = seed_text.strip()
        for _ in range(max_words):
            token_list = tokenizer.texts_to_sequences([line])[0]
            token_list = pad_sequences([token_list], maxlen=max_seq_len, padding='pre')

            predicted_probs = model.predict(token_list, verbose=0)[0]
            predicted_index = sample_with_temperature(predicted_probs, temperature)

            output_word = tokenizer.index_word.get(predicted_index, '')
            if not output_word:
                break
            line += ' ' + output_word
            if output_word in ['.', ',', '!', '?']:
                break
        output.append(line.capitalize())
        seed_text = output[-1]  # Use last line as new seed
    return output

# --- Run Training ---
if __name__ == '__main__':
    train_and_save()
