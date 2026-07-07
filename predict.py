import os
import pickle
import numpy as np
import librosa

# --- 1. CONFIGURATION ---
SAMPLE_RATE = 22050
WINDOW_DURATION = 3.5
WINDOW_OVERLAP = 0.5
RMS_SILENCE_THRESHOLD = 0.01
N_MFCC, N_CHROMA, N_MEL, N_CONTRAST = 40, 12, 40, 7

# Paths to your saved artifacts
MODEL_PATH = "./emotion_svm_model.pkl"
LABEL_ENCODER_PATH = "./label_encoder.pkl"

# Path to the file you want to test
AUDIO_FILE_PATH = "happy.wav" 

# --- 2. LOAD TRAINED MODEL ONLY ---
print("Loading SVM model and label encoder...")
with open(MODEL_PATH, "rb") as f:
    model = pickle.load(f)
with open(LABEL_ENCODER_PATH, "rb") as f:
    label_encoder = pickle.load(f)

# --- 3. AUDIO FEATURE EXTRACTION ---
def extract_features(audio, sr):
    mfcc = librosa.feature.mfcc(y=audio, sr=sr, n_mfcc=N_MFCC)
    chroma = librosa.feature.chroma_stft(y=audio, sr=sr, n_chroma=N_CHROMA)
    mel = librosa.feature.melspectrogram(y=audio, sr=sr, n_mels=N_MEL)
    mel_db = librosa.power_to_db(mel)
    contrast = librosa.feature.spectral_contrast(y=audio, sr=sr, n_bands=N_CONTRAST - 1)
    harmonic = librosa.effects.harmonic(audio)
    tonnetz = librosa.feature.tonnetz(y=harmonic, sr=sr)
    zcr = librosa.feature.zero_crossing_rate(audio)
    rms = librosa.feature.rms(y=audio)

    blocks = [mfcc, chroma, mel_db, contrast, tonnetz, zcr, rms]
    return np.concatenate([np.mean(b, axis=1) for b in blocks] + [np.std(b, axis=1) for b in blocks])

# --- 4. DIRECT PREDICTION PIPELINE ---
def predict_direct(audio_path):
    # librosa handles native wav files directly without needing external ffmpeg
    audio, sr = librosa.load(audio_path, sr=SAMPLE_RATE)
    window_size = int(WINDOW_DURATION * sr)
    hop_size = int(window_size * (1 - WINDOW_OVERLAP))
    
    if len(audio) < window_size:
        audio = np.pad(audio, (0, window_size - len(audio)))

    probability_vectors = []
    for start in range(0, max(len(audio) - window_size, 0) + 1, hop_size):
        window = audio[start:start + window_size]
        if np.sqrt(np.mean(window ** 2)) < RMS_SILENCE_THRESHOLD:
            continue
        features = extract_features(window, sr).reshape(1, -1)
        probability_vectors.append(model.predict_proba(features)[0])

    if not probability_vectors:
        return "neutral", 0.0
    
    mean_probs = np.mean(probability_vectors, axis=0)
    pred_idx = np.argmax(mean_probs)
    
    predicted_emotion = label_encoder.inverse_transform([pred_idx])[0]
    confidence = float(mean_probs[pred_idx])
    return predicted_emotion, confidence

# --- 5. RUN ---
if __name__ == "__main__":
    if not os.path.exists(AUDIO_FILE_PATH):
        print(f"❌ Cannot find file: {AUDIO_FILE_PATH}")
    else:
        emotion, confidence = predict_direct(AUDIO_FILE_PATH)
        print("\n" + "="*40)
        print(f"DIRECT PREDICTION: {emotion.upper()}")
        print(f"CONFIDENCE:        {confidence:.2%}")
        print("="*40)