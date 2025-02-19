import pandas as pd
from sklearn.preprocessing import OneHotEncoder
from sklearn.model_selection import train_test_split
from tensorflow import keras
import numpy as np
import joblib


# Load the data from outfits.csv
data = pd.read_csv('outfits.csv')

# One-hot encode the categorical features
encoder = OneHotEncoder()
X = encoder.fit_transform(data[['body_type', 'color_preference', 'activity_level']]).toarray()

# Assign outfit_id for predictions
data['outfit_id'] = data.index  # Each outfit gets a unique ID based on its row index

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, data['outfit_id'], test_size=0.2, random_state=42)

# Define the model architecture
model = keras.Sequential([
    keras.layers.Input(shape=(X.shape[1],)),  # Input layer based on the number of features
    keras.layers.Dense(64, activation='relu'),  # First hidden layer with 64 neurons
    keras.layers.Dense(32, activation='relu'),  # Second hidden layer with 32 neurons
    keras.layers.Dense(len(data['outfit_id'].unique()), activation='softmax')  # Output layer with softmax for multi-class classification
])

# Compile the model
model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])

# Train the model
model.fit(X_train, y_train, epochs=50, batch_size=10, validation_split=0.1)

# Evaluate the model on the test set
loss, accuracy = model.evaluate(X_test, y_test)
print(f"Test Loss: {loss}, Test Accuracy: {accuracy}")

# Save the trained model and encoder
model.save('outfit_recommendation_model.h5')  # Save the model
joblib.dump(encoder, 'encoder.pkl')  # Save the encoder
