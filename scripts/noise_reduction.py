#for removing the noise from the audio files(unecessary background noise)

import librosa
import librosa.display
import matplotlib.pyplot as plt
import noisereduce as nr
import soundfile as sf

audio_path = "./data/raw-dataset/Actor_01/03-01-01-01-01-01-01.wav"
audio, sample_rate = librosa.load(audio_path,sr=16000)

clean_audio = nr.reduce_noise(y=audio,sr=sample_rate)
sf.write("./data/cleaned-dataset/noise_reduced.wav",clean_audio,sample_rate)

print("Original Samples:", len(audio))
print("Cleaned Samples:", len(clean_audio))

plt.figure(figsize=(12,4))  #for original sample
librosa.display.waveshow(audio,sr=sample_rate)
plt.title("Original Audio")
plt.xlabel("Time")
plt.ylabel("Amplitude")
plt.show()

plt.figure(figsize=(12,4))  #for noise reduced sample
librosa.display.waveshow(clean_audio,sr=sample_rate)
plt.title("Noise Reduced Audio")
plt.xlabel("Time")
plt.ylabel("Amplitude")
plt.show()