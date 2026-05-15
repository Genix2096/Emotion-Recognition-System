import numpy as np
import librosa
import noisereduce as nr
from tensorflow.keras.models import load_model

model = load_model("ml/emotion_model.keras")

emotion_labels = [
    "angry",
    "disgust",
    "fearful",
    "happy",
    "neutral",
    "sad",
    "surprised"
]

audio_path = "angry.wav"
audio, sample_rate = librosa.load(audio_path,sr=None)

audio,_ = librosa.effects.trim(audio,top_db=20)
audio = librosa.util.normalize(audio)
audio = nr.reduce_noise(y=audio,sr=sample_rate)

mfccs = librosa.feature.mfcc(
    y=audio,
    sr=sample_rate,
    n_mfcc=40
)
mfccs = mfccs.astype('float32')

mfccs = (
    mfccs - np.mean(mfccs)
) / (
    np.std(mfccs) + 1e-8
)   
max_pad_length = 173

if mfccs.shape[1] < max_pad_length:
    pad_width = max_pad_length - mfccs.shape[1]
    mfccs = np.pad(
        mfccs,
        pad_width=((0, 0), (0, pad_width)),
        mode='constant'
    )
else:
    mfccs = mfccs[:, :max_pad_length]

mfccs = mfccs.reshape(1, 40, 173, 1)
prediction = model.predict(mfccs)
predicted_index = np.argmax(prediction)
predicted_emotion = emotion_labels[predicted_index]

print("\nPredicted Emotion:", predicted_emotion)
print("\nPrediction Probabilities:\n")

for i, emotion in enumerate(emotion_labels):
    probability = prediction[0][i] * 100
    print(f"{emotion}: {probability:.2f}%")