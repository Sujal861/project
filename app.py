from flask import Flask, render_template, request, jsonify
from ml.predictor import NamePredictor
from datetime import datetime
import json

app = Flask(__name__)
predictor = NamePredictor()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        
        # Extract demographic data
        demographic = {
            'age': int(data.get('age', 35)),
            'gender': data.get('gender', 'male'),
            'location': data.get('location', 'Northeast'),
            'education_level': data.get('educationLevel', 'bachelors'),
            'ethnicity': data.get('ethnicity', 'White')
        }
        
        # Get predictions
        start_time = datetime.now()
        predictions = predictor.predict(demographic)
        processing_time = (datetime.now() - start_time).total_seconds() * 1000
        
        # Format response
        response = {
            'names': [
                {
                    'name': pred['name'],
                    'confidence': pred['confidence'],
                    'rank': idx + 1
                }
                for idx, pred in enumerate(predictions[:5])
            ],
            'metadata': {
                'processingTime': processing_time,
                'modelUsed': 'NamePredictionModel-v1',
                'confidence': sum(p['confidence'] for p in predictions[:5]) / 5,
                'dataQuality': 0.85  # This would be calculated based on your data quality metrics
            }
        }
        
        return jsonify(response)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True) 