from flask import Flask, render_template, request, jsonify
from ml.api import train_models, predict_name, get_dataset_stats
from types import Demographic, TrainingOptions

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/predict', methods=['POST'])
def predict():
    data = request.json
    demographic: Demographic = {
        'age': data['age'],
        'gender': data['gender'],
        'location': data['location'],
        'education_level': data['education_level'],
        'ethnicity': data['ethnicity']
    }
    result = predict_name(demographic)
    return jsonify(result)

@app.route('/api/train', methods=['POST'])
def train():
    data = request.json
    options: TrainingOptions = {
        'model_type': data['model_type'],
        'train_test_split': data['train_test_split'],
        'feature_engineering': data['feature_engineering'],
        'hyperparameters': data['hyperparameters']
    }
    metrics = train_models(options)
    return jsonify(metrics)

@app.route('/api/dataset/stats')
def dataset_stats():
    stats = get_dataset_stats()
    return jsonify(stats)

if __name__ == '__main__':
    app.run(debug=True) 