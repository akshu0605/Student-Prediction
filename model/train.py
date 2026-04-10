import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
import joblib
import os

def generate_synthetic_data(num_samples=1000):
    np.random.seed(42)
    
    # Generate random features
    gpa = np.random.uniform(2.0, 4.0, num_samples)
    attendance = np.random.uniform(50, 100, num_samples)
    study_hours = np.random.uniform(1, 10, num_samples)
    assignment_rate = np.random.uniform(40, 100, num_samples)
    backlogs = np.random.randint(0, 5, num_samples)
    
    participation_options = ['Yes', 'No']
    participation = np.random.choice(participation_options, num_samples, p=[0.7, 0.3])
    
    sleep_hours = np.random.uniform(4, 10, num_samples)
    
    stress_options = ['Low', 'Medium', 'High']
    stress_level = np.random.choice(stress_options, num_samples, p=[0.3, 0.4, 0.3])
    
    extracurricular_options = ['Yes', 'No']
    extracurricular = np.random.choice(extracurricular_options, num_samples, p=[0.5, 0.5])

    # Basic logic to determine performance
    # Higher GPA, attendance, study_hours, assign rate -> Good
    # Higher backlogs, stress, lower sleep -> Risk
    
    performance = []
    for i in range(num_samples):
        score = 0
        score += (gpa[i] - 2.0) * 10 
        score += (attendance[i] - 50) * 0.2
        score += study_hours[i] * 1.5
        score += (assignment_rate[i] - 40) * 0.2
        score -= backlogs[i] * 5
        score += (sleep_hours[i] - 4) * 1
        
        if participation[i] == 'Yes': score += 3
        if stress_level[i] == 'High': score -= 5
        elif stress_level[i] == 'Low': score += 3
        
        if score > 35:
            performance.append('Good')
        elif score > 20:
            performance.append('Average')
        else:
            performance.append('At Risk')

    df = pd.DataFrame({
        'gpa': gpa,
        'attendance': attendance,
        'study_hours': study_hours,
        'assignment_rate': assignment_rate,
        'backlogs': backlogs,
        'participation': participation,
        'sleep_hours': sleep_hours,
        'stress_level': stress_level,
        'extracurricular': extracurricular,
        'performance': performance
    })
    
    dataset_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'dataset')
    if not os.path.exists(dataset_dir):
        os.makedirs(dataset_dir)
        
    csv_path = os.path.join(dataset_dir, 'student_data.csv')
    df.to_csv(csv_path, index=False)
    return df

def main():
    print("Generating synthetic data...")
    df = generate_synthetic_data(1500)
    
    X = df.drop('performance', axis=1)
    y = df['performance']
    
    categorical_features = ['participation', 'stress_level', 'extracurricular']
    numeric_features = ['gpa', 'attendance', 'study_hours', 'assignment_rate', 'backlogs', 'sleep_hours']
    
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), numeric_features),
            ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features)
        ])
        
    pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('classifier', RandomForestClassifier(random_state=42, n_estimators=100))
    ])
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("Training the model...")
    pipeline.fit(X_train, y_train)
    
    acc = pipeline.score(X_test, y_test)
    print(f"Model accuracy: {acc:.2f}")
    
    # Save the model
    backend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'backend')
    os.makedirs(backend_dir, exist_ok=True)
    model_path = os.path.join(backend_dir, 'model.pkl')
    joblib.dump(pipeline, model_path)
    print(f"Model saved to {model_path}")

if __name__ == "__main__":
    main()
