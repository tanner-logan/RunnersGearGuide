from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import joblib

# Load the trained model and encoder
model = joblib.load("model.pkl")
encoder = joblib.load("encoder.pkl")

app = FastAPI()

# Allow all CORS origins (adjust if needed for security)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to your Wix site's URL when deployed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define the input model
class OutfitRequest(BaseModel):
    body_type: str
    color_preference: str
    activity_level: str

@app.post("/recommend")
async def recommend_outfit(request: OutfitRequest):
    try:
        input_data = [[request.body_type, request.color_preference, request.activity_level]]
        input_encoded = encoder.transform(input_data).toarray()
        recommended_outfit_id = model.predict(input_encoded)[0]
        return {"recommended_outfit_id": int(recommended_outfit_id)}
    except Exception as e:
        return {"error": str(e)}

@app.get("/")
def home():
    return {"message": "Outfit Recommendation API is running!"}
