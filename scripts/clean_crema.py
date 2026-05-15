import os
import librosa
import soundfile as sf
import noisereduce as nr

input_path = "./data/crema-d"
output_path = "./data/cleaned-crema-d"

os.makedirs(output_path, exist_ok=True)

for file_name in os.listdir(input_path):

    if file_name.endswith(".wav"):

        input_file = os.path.join(
            input_path,
            file_name
        )

        output_file = os.path.join(
            output_path,
            file_name
        )

        try:

            audio, sample_rate = librosa.load(
                input_file,
                sr=None
            )

            # Trim silence
            audio, _ = librosa.effects.trim(
                audio,
                top_db=20
            )

            # Normalize audio
            audio = librosa.util.normalize(audio)

            # Reduce noise
            audio = nr.reduce_noise(
                y=audio,
                sr=sample_rate
            )

            # Save cleaned audio
            sf.write(
                output_file,
                audio,
                sample_rate
            )

            print("Cleaned:", file_name)

        except Exception as e:

            print("Error:", file_name)
            print(e)