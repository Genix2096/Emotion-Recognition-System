#cleaning the dataset by trimming, normalizing and reducing the noise from the audio files

import os
import librosa
import soundfile as sf
import noisereduce as nr

raw_dataset_path = "./data/raw-dataset"
cleaned_dataset_path = "./data/cleaned-dataset"

actor_folders = os.listdir(raw_dataset_path)

for actor in actor_folders:
    actor_input_path = os.path.join(raw_dataset_path, actor)
    actor_output_path = os.path.join(cleaned_dataset_path, actor)

    os.makedirs(actor_output_path, exist_ok=True)

    files = os.listdir(actor_input_path)

    for file in files:
        if file.endswith(".wav"):
            input_file_path = os.path.join(
                actor_input_path,
                file
            )

            output_file_path = os.path.join(
                actor_output_path,
                file
            )

            try:
                audio, sample_rate = librosa.load(input_file_path,sr=16000)

                audio,_ = librosa.effects.trim(audio) #trimming the audi

                audio = librosa.util.normalize(audio)   #normalizing the audio

                audio = nr.reduce_noise(y=audio,sr=sample_rate) #reducing the noise from the audio

                sf.write(output_file_path, audio, sample_rate)  #saving the cleaned audio file

            except Exception as e:
                print("Error processing File",file)
                print(e)