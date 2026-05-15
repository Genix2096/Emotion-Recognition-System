import numpy as np
from sklearn.model_selection import train_test_split
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import (
    Conv2D,
    MaxPooling2D,
    GlobalAveragePooling2D,
    Dense,
    Dropout,
    BatchNormalization,
    Input
)
from tensorflow.keras.callbacks import EarlyStopping

x = np.load("ml/preprocessed/x.npy")
y = np.load("ml/preprocessed/y.npy")

x = x.astype("float32")

for i in range(x.shape[0]):
    x[i] = (x[i] - np.mean(x[i])) / (np.std(x[i]) + 1e-8)

x = x[..., np.newaxis]
print("X shape:", x.shape)
print("y shape:", y.shape)

X_train, X_test, y_train, y_test = train_test_split(
    x,
    y,
    test_size=0.2,
    random_state=42
)

print("Training samples:", X_train.shape[0])
print("Testing samples:", X_test.shape[0])

model = Sequential([

    Input(shape=(40, 173, 1)),
    Conv2D(
        32,
        kernel_size=(3, 3),
        activation='relu',
        padding='same'
    ),
    BatchNormalization(),
    MaxPooling2D(pool_size=(2, 2)),
    Dropout(0.3),

    Conv2D(
        64,
        kernel_size=(3, 3),
        activation='relu',
        padding='same'
    ),
    BatchNormalization(),
    MaxPooling2D(pool_size=(2, 2)),
    Dropout(0.3),

    Conv2D(
        128,
        kernel_size=(3, 3),
        activation='relu',
        padding='same'
    ),
    BatchNormalization(),
    MaxPooling2D(pool_size=(2, 2)),
    Dropout(0.3),
    GlobalAveragePooling2D(),

    Dense(128,activation='relu'),

    Dropout(0.4),

    Dense(7,activation='softmax')
])

model.compile(
    optimizer='adam',
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)
model.summary()

early_stop = EarlyStopping(
    monitor='val_loss',
    patience=20,
    restore_best_weights=True
)

history = model.fit(
    X_train,
    y_train,
    epochs=100,
    batch_size=32,
    validation_data=(X_test, y_test),
    callbacks=[early_stop]
)

loss, accuracy = model.evaluate(
    X_test,
    y_test
)

print("\nTest Accuracy:", accuracy)
model.save("ml/emotion_model.keras")
print("\nModel saved as emotion_model.keras")