#for normalizing the audio(to have a consistent amplitude acrosss all the samples)

import librosa
import librosa.display
import matplotlib.pyplot as plt
import numpy as np
import soundfile as sf

audio_path = "./data/raw-dataset/Actor_01/03-01-01-01-01-01-01.wav"
audio, sample_rate = librosa.load(audio_path,sr=16000)

normalized_audio = librosa.util.normalize(audio)

sf.write("./data/cleaned-dataset/normalized_audio.wav", normalized_audio, sample_rate)

plt.figure(figsize=(12,4)) #for original sample
librosa.display.waveshow(audio,sr=sample_rate)
plt.title("Original Audio")
plt.xlabel("Time")
plt.ylabel("Amplitude")
plt.show()

plt.figure(figsize=(12,4)) #for normalized sample
librosa.display.waveshow(normalized_audio,sr=sample_rate)
plt.title("Normalized Audio")
plt.xlabel("Time")
plt.ylabel("Amplitude")
plt.show()