import pickle
import os
import numpy as np
import librosa

# ── Configuration ──────────────────────────────────────────────────────────────
SAMPLE_RATE             = 22050
WINDOW_DURATION         = 3.5
WINDOW_OVERLAP          = 0.5
RMS_SILENCE_THRESHOLD   = 0.01
N_MFCC, N_CHROMA, N_MEL, N_CONTRAST = 40, 12, 40, 7

# Resolve .pkl paths relative to the project root (one level up from /backend)
_ROOT = os.path.join(os.path.dirname(__file__), "..")
MODEL_PATH         = os.path.join(_ROOT, "emotion_svm_model.pkl")
LABEL_ENCODER_PATH = os.path.join(_ROOT, "label_encoder.pkl")

# ── Load artifacts at import time ──────────────────────────────────────────────
print("⏳  Loading SVM model …")
with open(MODEL_PATH, "rb") as f:
    _model = pickle.load(f)

print("⏳  Loading label encoder …")
with open(LABEL_ENCODER_PATH, "rb") as f:
    _label_encoder = pickle.load(f)

print("✅  Model artifacts loaded successfully.")


# ── Feature extraction ─────────────────────────────────────────────────────────
def _extract_features(audio: np.ndarray, sr: int) -> np.ndarray:
    """Return a fixed-length feature vector for one audio window."""
    mfcc     = librosa.feature.mfcc(y=audio, sr=sr, n_mfcc=N_MFCC)
    chroma   = librosa.feature.chroma_stft(y=audio, sr=sr, n_chroma=N_CHROMA)
    mel      = librosa.feature.melspectrogram(y=audio, sr=sr, n_mels=N_MEL)
    mel_db   = librosa.power_to_db(mel)
    contrast = librosa.feature.spectral_contrast(y=audio, sr=sr, n_bands=N_CONTRAST - 1)
    harmonic = librosa.effects.harmonic(audio)
    tonnetz  = librosa.feature.tonnetz(y=harmonic, sr=sr)
    zcr      = librosa.feature.zero_crossing_rate(audio)
    rms      = librosa.feature.rms(y=audio)

    blocks = [mfcc, chroma, mel_db, contrast, tonnetz, zcr, rms]
    return np.concatenate(
        [np.mean(b, axis=1) for b in blocks] +
        [np.std(b,  axis=1) for b in blocks]
    )


# ── Public API ─────────────────────────────────────────────────────────────────
def predict(audio_path: str) -> tuple[str, float]:
    """
    Run the sliding-window emotion prediction pipeline on a WAV file.

    Parameters
    ----------
    audio_path : str
        Absolute or relative path to a .wav file.

    Returns
    -------
    (emotion, confidence) : (str, float)
        emotion    – upper-case emotion label, e.g. ``"HAPPY"``
        confidence – float in [0.0, 1.0]
    """
    audio, sr = librosa.load(audio_path, sr=SAMPLE_RATE)

    window_size = int(WINDOW_DURATION * sr)
    hop_size    = int(window_size * (1 - WINDOW_OVERLAP))

    # Pad short clips ─────────────────────────────────────────────────────────
    if len(audio) < window_size:
        audio = np.pad(audio, (0, window_size - len(audio)))

    # Sliding-window inference ────────────────────────────────────────────────
    probability_vectors = []
    for start in range(0, max(len(audio) - window_size, 0) + 1, hop_size):
        window = audio[start : start + window_size]
        # Skip silent windows
        if np.sqrt(np.mean(window ** 2)) < RMS_SILENCE_THRESHOLD:
            continue
        features = _extract_features(window, sr).reshape(1, -1)
        probability_vectors.append(_model.predict_proba(features)[0])

    if not probability_vectors:
        return "NEUTRAL", 0.0

    mean_probs      = np.mean(probability_vectors, axis=0)
    pred_idx        = int(np.argmax(mean_probs))
    emotion_raw     = _label_encoder.inverse_transform([pred_idx])[0]
    confidence      = float(mean_probs[pred_idx])

    return str(emotion_raw).upper(), confidence
