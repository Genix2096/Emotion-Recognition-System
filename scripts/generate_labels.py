#labeling the dataset into a csv file so that its easier for the ML model to understand and train

import os
import pandas as pd

data = []
ravdess_path = "./data/cleaned-dataset"
crema_path = "./data/cleaned-crema-d"

ravdess_emotion_map = {
    "01": "neutral",
    "03": "happy",
    "04": "sad",
    "05": "angry",
    "06": "fearful",
    "07": "disgust",
    "08": "surprised"
}

crema_emotion_map = {
    "ANG": "angry",
    "DIS": "disgust",
    "FEA": "fearful",
    "HAP": "happy",
    "NEU": "neutral",
    "SAD": "sad"
}

for actor_folder in os.listdir(ravdess_path):
    actor_path = os.path.join(
        ravdess_path,
        actor_folder
    )
    if os.path.isdir(actor_path):
        for file_name in os.listdir(actor_path):
            if file_name.endswith(".wav"):
                parts = file_name.split("-")
                emotion_code = parts[2]
                if emotion_code in ravdess_emotion_map:
                    emotion = ravdess_emotion_map[
                        emotion_code
                    ]
                    file_path = os.path.join(
                        actor_path,
                        file_name
                    )
                    data.append([
                        file_path,
                        emotion
                    ])
                    print("Added RAVDESS:", file_path)

for file_name in os.listdir(crema_path):

    if file_name.endswith(".wav"):

        parts = file_name.split("_")

        emotion_code = parts[2]

        if emotion_code in crema_emotion_map:

            emotion = crema_emotion_map[
                emotion_code
            ]

            file_path = os.path.join(
                crema_path,
                file_name
            )

            data.append([
                file_path,
                emotion
            ])

            print(
                "Added CREMA-D:",
                file_path
            )

df = pd.DataFrame(
    data,
    columns=[
        "filepath",
        "emotion"
    ]
)

os.makedirs(
    "./data/csv",
    exist_ok=True
)

csv_path = "./data/csv/labels.csv"

df.to_csv(
    csv_path,
    index=False
)

print("\nlabels.csv created successfully!")
print("\nEmotion Counts:\n")
print(df["emotion"].value_counts())