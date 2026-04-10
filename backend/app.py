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

@app.post("/insight")
def generate_insight(data: StudentData):
    """
    Generate a rule-based AI insight for the student based on their input data.
    Returns structured insight with key issues, explanations, and suggestions.
    """
    key_issues = []
    why_it_matters = []
    suggestions = []

    # --- Attendance Analysis ---
    if data.attendance < 60:
        key_issues.append("Critically low attendance ({:.0f}%)".format(data.attendance))
        why_it_matters.append(
            "Attendance below 60% means you are missing a majority of core lectures, "
            "which severely limits your ability to grasp foundational concepts and participate in evaluations."
        )
        suggestions.append(
            "Make attendance your top priority. Even attending 75%+ of classes can significantly "
            "improve your understanding and eligibility for exams."
        )
    elif data.attendance < 75:
        key_issues.append("Below-optimal attendance ({:.0f}%)".format(data.attendance))
        why_it_matters.append(
            "Your attendance is below the generally required 75% threshold. Missing classes creates "
            "knowledge gaps that are hard to fill through self-study alone."
        )
        suggestions.append(
            "Aim to attend at least 80% of all classes. Set daily reminders and identify what is causing "
            "you to miss sessions — whether it is scheduling, motivation, or health."
        )

    # --- Study Hours Analysis ---
    if data.study_hours < 2:
        key_issues.append("Very low daily study hours ({:.1f} hrs/day)".format(data.study_hours))
        why_it_matters.append(
            "Studying less than 2 hours a day is insufficient for retaining academic content, "
            "especially when covering multiple subjects simultaneously."
        )
        suggestions.append(
            "Start with a structured 2-hour study block daily and gradually increase to 4+ hours. "
            "Use the Pomodoro technique: 25 minutes of focused study, 5-minute break."
        )
    elif data.study_hours < 4:
        key_issues.append("Insufficient study time ({:.1f} hrs/day)".format(data.study_hours))
        why_it_matters.append(
            "Research shows that consistent students typically study 4–6 hours daily. "
            "Your current study time may not be enough to keep up with coursework demands."
        )
        suggestions.append(
            "Increase your study hours incrementally. Focus on high-priority subjects first "
            "and use active recall methods instead of passive reading."
        )

    # --- GPA / Academic Score ---
    if data.gpa < 2.5:
        key_issues.append("Low GPA / academic score ({:.2f})".format(data.gpa))
        why_it_matters.append(
            "A GPA below 2.5 is a strong indicator of academic difficulty. "
            "It may reflect gaps in understanding, poor exam preparation, or inconsistent effort."
        )
        suggestions.append(
            "Speak with your academic advisor about a recovery plan. Focus on fewer subjects "
            "at a time and seek tutoring or peer study groups for difficult topics."
        )
    elif data.gpa < 3.0:
        key_issues.append("Below average GPA ({:.2f})".format(data.gpa))
        why_it_matters.append(
            "A GPA in the 2.5–3.0 range suggests you are performing below your potential. "
            "Small improvements in consistency can have a big impact on your overall score."
        )
        suggestions.append(
            "Review your weakest subjects and allocate extra time to them. "
            "Practice past exam papers regularly to strengthen exam performance."
        )

    # --- Assignment Completion Rate ---
    if data.assignment_rate < 50:
        key_issues.append("Very low assignment completion rate ({:.0f}%)".format(data.assignment_rate))
        why_it_matters.append(
            "Assignments reinforce classroom learning and contribute directly to your grade. "
            "Completing less than half of them signals significant disengagement."
        )
        suggestions.append(
            "Start treating assignments as non-negotiable. Break large tasks into smaller steps "
            "and set personal deadlines 2 days before the actual due date."
        )
    elif data.assignment_rate < 75:
        key_issues.append("Incomplete assignment submissions ({:.0f}%)".format(data.assignment_rate))
        why_it_matters.append(
            "Missing assignments not only affects your grade but also reduces your understanding "
            "of the subject matter, making exams harder to prepare for."
        )
        suggestions.append(
            "Track all assignment due dates in a planner or app. Even submitting incomplete "
            "work is better than missing it entirely — partial credit adds up."
        )

    # --- Backlogs ---
    if data.backlogs >= 3:
        key_issues.append("High number of backlogs ({} subjects)".format(data.backlogs))
        why_it_matters.append(
            "Having 3 or more backlogs creates cumulative pressure. "
            "Each uncleared backlog adds to your future workload and can affect your ability to progress."
        )
        suggestions.append(
            "Create a dedicated backlog clearance schedule. Focus on one backlog at a time, "
            "starting with the oldest or the most credit-heavy subject."
        )
    elif data.backlogs > 0:
        key_issues.append("{} uncleared backlog(s)".format(data.backlogs))
        why_it_matters.append(
            "Even a single backlog can hold back your academic progression and reputation. "
            "Addressing it early prevents compounding problems later."
        )
        suggestions.append(
            "Dedicate 30–45 minutes daily specifically to clearing your backlog. "
            "Use previous exam papers and faculty support to guide your revision."
        )

    # --- Stress Level ---
    if data.stress_level == "High":
        key_issues.append("High stress level")
        why_it_matters.append(
            "Chronic high stress directly impairs memory consolidation, focus, and cognitive performance. "
            "It can create a negative cycle where poor results lead to more stress."
        )
        suggestions.append(
            "Incorporate at least 20 minutes of physical activity daily. "
            "Practice mindfulness or deep breathing before study sessions. "
            "Consider speaking with a campus counselor if stress feels unmanageable."
        )
    elif data.stress_level == "Medium":
        suggestions.append(
            "Your stress level is moderate. Maintaining a balance between work and relaxation "
            "will help you sustain your performance over the semester."
        )

    # --- Sleep Hours ---
    if data.sleep_hours < 5:
        key_issues.append("Severely insufficient sleep ({:.1f} hrs/day)".format(data.sleep_hours))
        why_it_matters.append(
            "Sleeping less than 5 hours severely impairs memory formation, attention span, "
            "and emotional regulation — all of which are critical for academic success."
        )
        suggestions.append(
            "Prioritize sleep as a non-negotiable. Aim for 7–8 hours. "
            "Avoid screens 30 minutes before bed and set a consistent sleep schedule."
        )
    elif data.sleep_hours < 7:
        key_issues.append("Insufficient sleep ({:.1f} hrs/day)".format(data.sleep_hours))
        why_it_matters.append(
            "Getting 5–7 hours of sleep leaves you functioning below your cognitive peak. "
            "Sleep deprivation accumulates and degrades academic performance over time."
        )
        suggestions.append(
            "Try to get at least 7 hours of sleep nightly. Avoid late-night cramming — "
            "students who sleep well before exams consistently outperform those who don't."
        )
    elif data.sleep_hours > 9:
        key_issues.append("Possibly oversleeping ({:.1f} hrs/day)".format(data.sleep_hours))
        why_it_matters.append(
            "Sleeping more than 9 hours regularly can reduce your productive hours "
            "and may indicate low energy, depression, or poor sleep quality."
        )
        suggestions.append(
            "Aim for 7–8 hours of quality sleep. If you feel fatigued despite sleeping long, "
            "consider speaking to a doctor about sleep quality or potential health issues."
        )

    # --- Participation ---
    if data.participation == "No":
        key_issues.append("Low class participation")
        why_it_matters.append(
            "Actively participating in class improves comprehension, memory retention, "
            "and helps you clarify doubts in real-time before they become exam problems."
        )
        suggestions.append(
            "Start small — ask at least one question per class. Participation builds confidence "
            "and puts you on your professor's radar in a positive way."
        )

    # --- Extracurricular ---
    if data.extracurricular == "No" and data.stress_level == "High":
        suggestions.append(
            "Even with high stress, consider joining one low-commitment extracurricular activity. "
            "Creative or social outlets are proven stress relievers that enhance overall well-being."
        )

    # --- Generate overall summary ---
    if not key_issues:
        summary = (
            "You are performing well across all key academic and behavioral dimensions! "
            "Keep maintaining your current habits, stay consistent, and you are on track for excellent results."
        )
        key_issues = ["No critical weaknesses detected"]
        why_it_matters = [
            "Your attendance, study habits, sleep, and stress levels are all within healthy ranges. "
            "This balance is the foundation of sustained academic success."
        ]
        suggestions = [
            "Continue your current routine. Consider pushing your GPA higher by exploring advanced "
            "resources, peer teaching, or academic competitions to stay challenged and motivated."
        ]
    else:
        count = len(key_issues)
        if count >= 4:
            summary = (
                "Your profile shows multiple areas that need immediate attention. "
                "Don't be discouraged — identifying these issues is the first step to turning things around. "
                "With focused effort on even 1–2 of these areas, you can see meaningful improvement."
            )
        elif count >= 2:
            summary = (
                "You have a few areas that are pulling your performance down. "
                "The good news is that these are all within your control. "
                "Small, consistent changes in your daily routine can make a significant difference."
            )
        else:
            summary = (
                "You are mostly on track, with one specific area to work on. "
                "Addressing this gap will give your academic performance a solid boost."
            )

    return {
        "summary": summary,
        "key_issues": key_issues,
        "why_it_matters": why_it_matters,
        "actionable_suggestions": suggestions
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5010)
