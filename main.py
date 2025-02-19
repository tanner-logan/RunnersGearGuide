# main.py
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.responses import JSONResponse
from sklearn.preprocessing import OneHotEncoder
from tensorflow import keras
import numpy as np
import joblib

# Load the model and encoder
model = keras.models.load_model('outfit_recommendation_model.h5')
encoder = joblib.load('encoder.pkl')

app = FastAPI()

# Define a request model for the API
class OutfitRequest(BaseModel):
    body_type: str
    color_preference: str
    activity_level: str

@app.post('/recommend_outfit/')
async def recommend_outfit(request: OutfitRequest):
    # Preprocess the input data
    input_data = np.array([[request.body_type, request.color_preference, request.activity_level]])
    input_encoded = encoder.transform(input_data).toarray()

    # Make a prediction
    prediction = model.predict(input_encoded)
    recommended_outfit_id = np.argmax(prediction)

    # Return the recommended outfit ID
    return {'recommended_outfit_id': int(recommended_outfit_id)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host='127.0.0.1', port=8000)
