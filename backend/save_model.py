import pandas as pd
import joblib
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.utils.class_weight import compute_sample_weight

def train_and_export_model():
    print("Membaca data: meningitis.csv...")
    df = pd.read_csv('meningitis.csv')
    
    # 1. Cleaning
    if "Diagnosis" in df.columns:
        df = df[df["Diagnosis"] != "Unknown"]

    irrelevant = [c for c in ['Patient_ID', 'patient_id'] if c in df.columns]
    df.drop(columns=irrelevant, inplace=True)
    df.drop_duplicates(inplace=True)
    
    # 2. Fitur & Target
    features = [
        "Gender", "Age", "WBC_Count", "Protein_Level", 
        "Glucose_Level", "Pathogen_Present", "Hemoglobin", "WBC_Blood_Count"
    ]
    target = "Risk_Level"
    
    available_features = [f for f in features if f in df.columns]
    df = df[available_features + [target]].dropna()

    # Encoders dict
    encoders = {}
    
    print("Melakukan Label Encoding...")
    # Target Encoding
    outcome_le = LabelEncoder()
    df['Target_enc'] = outcome_le.fit_transform(df[target])
    encoders['Target'] = outcome_le
    
    # Feature Encoding
    cat_cols = [c for c in available_features if df[c].dtype == 'object']
    for col in cat_cols:
        le = LabelEncoder()
        df[col] = le.fit_transform(df[col].astype(str))
        encoders[col] = le
        
    X = df[available_features]
    y = df['Target_enc']
    
    # StandardScaler
    print("Melakukan Standard Scaling...")
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # Model Training
    print("Melatih model Gradient Boosting dengan class_weight='balanced'...")
    sample_weights = compute_sample_weight('balanced', y)
    model = GradientBoostingClassifier(n_estimators=100, random_state=42)
    model.fit(X_scaled, y, sample_weight=sample_weights)
    
    # Export bundle
    bundle = {
        'model': model,
        'scaler': scaler,
        'encoders': encoders,
        'feature_names': list(X.columns)
    }
    
    joblib.dump(bundle, 'backend/model_bundle.pkl')
    print("✅ Model, Pipeline Scaler & Encoders berhasil diekspor ke 'backend/model_bundle.pkl'!")

if __name__ == '__main__':
    train_and_export_model()
