#trimming the dataset to remove silence

import librosa
import librosa.display
import matplotlib.pyplot as plt

audio_path = "./data/raw-dataset/Actor_01/03-01-01-01-01-01-01.wav"
audio, sample_rate = librosa.load(audio_path,sr=16000)

trimmed_audio, index = librosa.effects.trim(audio) #trimming the audio

print("Original Samples:", len(audio))
print("Trimmed Samples:", len(trimmed_audio))

original_duration = len(audio) / sample_rate
trimmed_duration = len(trimmed_audio) / sample_rate
print("\nOriginal Duration:", original_duration)
print("Trimmed Duration:", trimmed_duration)

plt.figure(figsize=(12,4))  #for original sample
librosa.display.waveshow(audio,sr=sample_rate)
plt.title("Original Audio")
plt.xlabel("Time")
plt.ylabel("Amplitude")
plt.show()

plt.figure(figsize=(12,4))  #for trimmed sample
librosa.display.waveshow(trimmed_audio,sr=sample_rate)
plt.title("Trimmed Audio")
plt.xlabel("Time")
plt.ylabel("Amplitude")
plt.show()