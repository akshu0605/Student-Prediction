# 📊 STDPredict – Student Performance Prediction System

## 🚀 Overview

**STDPredict** is a machine learning-powered web application that predicts student performance based on academic, behavioral, and personal factors.
It provides insights such as **Pass/Fail status, risk level, and improvement suggestions** to help students improve their outcomes.

---

## 🎯 Features

* 📥 User input form for student data
* 🤖 Machine Learning-based prediction
* 📊 Performance classification (Good / Average / At Risk)
* 🎨 Clean and responsive UI
* ⚡ Real-time prediction via API
* 💡 Personalized improvement suggestions

---

## 🧠 Prediction Capabilities

The system can predict:

* Pass / Fail
* Risk Level (Low / Medium / High)
* Performance Category (Good / Average / At Risk)

---

## 📊 Input Parameters

The model uses the following inputs:

### Academic:

* GPA / Percentage
* Attendance (%)
* Assignment Completion Rate

### Behavioral:

* Study Hours per Day
* Participation (Yes/No)
* Number of Backlogs

### Personal:

* Sleep Hours
* Stress Level (Low/Medium/High)
* Extra-Curricular Activities (Yes/No)

---

## ⚙️ Tech Stack

### Frontend:

* React / HTML / CSS / JavaScript

### Backend:

* Python (Flask or FastAPI)

### Machine Learning:

* Scikit-learn
* Pandas
* NumPy

---

## 🧠 Machine Learning Model

* Model Used: Logistic Regression / Random Forest
* Dataset: Synthetic or real student dataset
* Steps:

  1. Data preprocessing (encoding + scaling)
  2. Train-test split
  3. Model training
  4. Evaluation
  5. Model saved using `pickle` or `joblib`

---

## 🔗 API Endpoint

### POST `/predict`

#### Request:

```json
{
  "gpa": 8.5,
  "attendance": 85,
  "study_hours": 4,
  "assignments": 90,
  "backlogs": 0,
  "participation": "Yes",
  "sleep_hours": 7,
  "stress": "Medium",
  "extra_curricular": "Yes"
}
```

#### Response:

```json
{
  "prediction": "Safe",
  "score": 82,
  "category": "Good"
}
```

---

## 🎨 UI Flow

1. Landing Page
2. "Get Started" Button
3. Input Form
4. Prediction Processing
5. Result Display

---

## 🖥️ Project Structure

```
stdpredict/
│
├── frontend/        # UI code
├── backend/         # API + server
├── model/           # Trained ML model
├── dataset/         # Dataset (optional)
└── README.md
```

---

## ⚡ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/stdpredict.git
cd stdpredict
```

### 2. Backend Setup

```bash
cd backend
pip install -r requirements.txt
python app.py
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

## 💡 Future Enhancements

* 📈 Advanced ML models for better accuracy
* 📊 Dashboard with analytics
* 🔐 User authentication system
* ☁️ Deployment on cloud (AWS / Vercel / Render)

---

## 🤝 Contributing

Contributions are welcome! Feel free to fork this repo and submit a pull request.

---

## 📜 License

This project is for educational purposes.

---

## 👨‍💻 Author

Developed by **Akshit Jaswal**
