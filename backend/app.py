from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib
import os

app = FastAPI(title="STDPredict Backend API")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the model
# NOTE: The model must be generated first by running model/train.py
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'model.pkl')
try:
    if os.path.exists(MODEL_PATH):
        model = joblib.load(MODEL_PATH)
    else:
        model = None
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

class StudentData(BaseModel):
    gpa: float
    attendance: float
    study_hours: float
    assignment_rate: float
    backlogs: int
    participation: str
    sleep_hours: float
    stress_level: str
    extracurricular: str

@app.post("/predict")
def predict_performance(data: StudentData):
    if model is None:
        raise HTTPException(status_code=500, detail="Model is not trained/loaded. Run train.py first.")
    
    # Convert input to DataFrame
    input_data = pd.DataFrame([data.model_dump()])
    
    try:
        # Get prediction and probabilities
        prediction = model.predict(input_data)[0]
        probabilities = model.predict_proba(input_data)[0]
        
        # Determine the probability of the predicted class
        classes = list(model.classes_)
        pred_idx = classes.index(prediction)
        score = round(probabilities[pred_idx] * 100, 2)
        
        # Generate personalized suggestions based on inputs
        suggestions = []
        if data.attendance < 75:
            suggestions.append("Improve your attendance to stay on track.")
        if data.study_hours < 3:
            suggestions.append("Consider increasing daily study hours.")
        if data.assignment_rate < 70:
            suggestions.append("Complete more assignments for a better grasp of the material.")
        if data.stress_level == "High":
            suggestions.append("Manage stress with regular breaks and consider talking to a counselor.")
        if data.sleep_hours < 7:
            suggestions.append("Aim for at least 7-8 hours of sleep for better focus.")
        if data.backlogs > 0:
            suggestions.append("Prioritize clearing your backlogs as soon as possible.")
            
        if not suggestions:
            suggestions.append("Keep up the great work! You are on the right track.")
            
        return {
            "prediction": prediction,
            "score": score,
            "category": prediction, # 'Good', 'Average', 'At Risk'
            "suggestions": suggestions
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def read_root():
    return {"message": "Welcome to STDPredict Backend API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5010)
