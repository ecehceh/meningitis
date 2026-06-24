from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import traceback

app = Flask(__name__)
# Enable CORS for all routes (allows Next.js to communicate with Flask)
CORS(app)

# Load the exported model bundle
print("Loading model bundle...")
try:
    # Adjust path if running locally from backend folder vs project root
    bundle = joblib.load('model_bundle.pkl')
    model = bundle['model']
    scaler = bundle['scaler']
    encoders = bundle['encoders']
    feature_names = bundle['feature_names']
    print("[OK] Model bundle loaded successfully!")
except Exception as e:
    print(f"[ERROR] Error loading model: {e}")
    # Fallback to load from backend dir if running from there directly
    bundle = joblib.load('backend/model_bundle.pkl')
    model = bundle['model']
    scaler = bundle['scaler']
    encoders = bundle['encoders']
    feature_names = bundle['feature_names']
    print("[OK] Model bundle loaded successfully from fallback path!")

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        print(f"Received data: {data}")
        
        # 1. Convert input JSON into a DataFrame
        input_df = pd.DataFrame([data])
        
        # 2. Add missing columns with default/mode values (just in case frontend didn't send them)
        # In a real app we'd validate, but here we fill with 'Unknown' or 0 for safety
        for feat in feature_names:
            if feat not in input_df.columns:
                print(f"Warning: {feat} missing from input. Filling with 0/Unknown.")
                input_df[feat] = 0 # numeric fallback
                
        # Reorder columns to match exactly what the model was trained on
        input_df = input_df[feature_names]
        
        # 3. Label Encoding for categorical columns
        # Only iterate through features that are actually in the model's feature_names
        for col in feature_names:
            if col in encoders:
                try:
                    le = encoders[col]
                    val = str(input_df[col].iloc[0])
                    if val not in le.classes_:
                        val = le.classes_[0] 
                    input_df[col] = le.transform([val])[0]
                except Exception as e:
                    print(f"Encoding error on {col}: {e}")
                    input_df[col] = 0
                    
        # 4. Standard Scaling
        # Re-ensure column order exactly matches trained feature_names
        input_df = input_df[feature_names]
        X_scaled = scaler.transform(input_df)
        
        # 5. Prediction
        prediction_enc = model.predict(X_scaled)[0]
        prediction_label = encoders['Target'].inverse_transform([prediction_enc])[0]
        
        # 6. Probability
        probabilities = model.predict_proba(X_scaled)[0]
        
        # We assume target_classes are sorted alphabetically by LabelEncoder:
        # e.g., ['High Risk', 'Low Risk', 'Moderate Risk']
        # Let's map them dynamically to avoid hardcoding index to specific label
        classes = list(encoders['Target'].classes_)
        
        prob_dict = {}
        for idx, cls in enumerate(classes):
            prob_dict[cls] = float(probabilities[idx])
            
        confidence = prob_dict.get(prediction_label, 0)
        
        # We will surface the explicit keys for the frontend
        return jsonify({
            'success': True,
            'prediction': prediction_label,
            'confidence': round(confidence * 100, 2),
            'prob_high': round(prob_dict.get('High Risk', 0) * 100, 2),
            'prob_moderate': round(prob_dict.get('Moderate Risk', 0) * 100, 2),
            'prob_low': round(prob_dict.get('Low Risk', 0) * 100, 2)
        })
        
    except Exception as e:
        print("Error during prediction:")
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok", "message": "Meningitis API is running!"})

if __name__ == '__main__':
    # Run the server on port 5000
    app.run(host='0.0.0.0', port=5000, debug=True)
