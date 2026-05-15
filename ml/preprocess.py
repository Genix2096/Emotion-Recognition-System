import os
import numpy as np
import pandas as pd
import librosa
from sklearn.preprocessing import LabelEncoder

csv_path = "./data/csv/labels.csv"
df = pd.read_csv(csv_path)

x = []
y = []

def extract_features(file_path):

    audio, sample_rate = librosa.load(file_path,sr=None)
    audio, _ = librosa.effects.trim(audio,top_db=20)
    audio = librosa.util.normalize(audio)
    mfccs = librosa.feature.mfcc(y=audio,sr=sample_rate,n_mfcc=40)

    mfccs = mfccs.astype("float32")
    mfccs = (
        mfccs - np.mean(mfccs)) / (np.std(mfccs) + 1e-8)

    max_pad_length = 173
    if mfccs.shape[1] < max_pad_length:
        pad_width = (
            max_pad_length
            - mfccs.shape[1]
        )
        mfccs = np.pad(
            mfccs,
            pad_width=((0, 0), (0, pad_width)),
            mode='constant'
        )

    else:
        mfccs = mfccs[:, :max_pad_length]

    return mfccs

for index, row in df.iterrows():
    file_path = row['filepath']
    emotion = row['emotion']

    try:
        features = extract_features(file_path)
        x.append(features)
        y.append(emotion)
        print("Processed: ",file_path)
    except Exception as e:
        print("Error processing: ",file_path)
        print(e)

x = np.array(x)
y = np.array(y)

encoder = LabelEncoder()
y = encoder.fit_transform(y)

os.makedirs("ml/preprocessed",exist_ok=True)
np.save("ml/preprocessed/x.npy",x)
np.save("ml/preprocessed/y.npy",y)

label_mapping = dict(
    zip(
        encoder.classes_,
        encoder.transform(encoder.classes_)
    )
)

print("\nLabel Mapping:")
print(label_mapping)

print("\nFeature Extraction Completed")
print("X shape:", x.shape)
print("y shape:", y.shape)