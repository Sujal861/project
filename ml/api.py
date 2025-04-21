import time
import random
from typing import Dict, List, Any, Optional, Tuple
from types import Demographic, PredictionResult, ModelMetrics, DatasetStats, TrainingOptions
from .preprocessing import preprocess_data, split_train_test, extract_features_from_demographic
from .models.random_forest import RandomForestClassifier
from .models.gradient_boosting import GradientBoostingClassifier
from .models.neural_network import NeuralNetwork
from .data.sample_data import sample_name_data, extended_name_data

# Store trained models for later use
random_forest_model: Optional[RandomForestClassifier] = None
gradient_boosting_model: Optional[GradientBoostingClassifier] = None
neural_network_model: Optional[NeuralNetwork] = None

# Store training and test data
train_data: List[Dict[str, Any]] = []
test_data: List[Dict[str, Any]] = []

def train_models(options: TrainingOptions) -> ModelMetrics:
    """
    Trains ML models with the provided options
    """
    print(f'Starting model training with options: {options}')
    
    # In a real application, we would load real data here
    # For demo purposes, we'll use our sample data
    raw_data = extended_name_data if options['model_type'] == 'randomForest' else sample_name_data
    
    # Preprocess data
    processed_data = preprocess_data(raw_data)
    
    # Split into training and test sets
    train, test = split_train_test(processed_data, options['train_test_split'])
    global train_data, test_data
    train_data = train
    test_data = test
    
    accuracy = 0
    start_time = time.time()
    
    # Train the appropriate model
    global random_forest_model, gradient_boosting_model, neural_network_model
    
    if options['model_type'] == 'randomForest':
        random_forest_model = RandomForestClassifier(20, 7)
        random_forest_model.train(train_data)
        accuracy = random_forest_model.evaluate(test_data)['accuracy']
        
    elif options['model_type'] == 'gradientBoosting':
        gradient_boosting_model = GradientBoostingClassifier(15, 0.1)
        gradient_boosting_model.train(train_data)
        accuracy = gradient_boosting_model.evaluate(test_data)['accuracy']
        
    elif options['model_type'] == 'neuralNetwork':
        # Determine input size from the first sample
        input_size = len(train_data[0]['features'])
        neural_network_model = NeuralNetwork(input_size, 15, 0.05)
        neural_network_model.train(train_data, 200)
        accuracy = neural_network_model.evaluate(test_data)['accuracy']
        
    elif options['model_type'] in ['lstm', 'transformer']:
        # These would be more complex to implement in Python
        # For demo purposes, we'll use the neural network as a fallback
        print(f"{options['model_type']} not fully implemented, using Neural Network instead")
        input_size = len(train_data[0]['features'])
        neural_network_model = NeuralNetwork(input_size, 20, 0.05)
        neural_network_model.train(train_data, 300)
        accuracy = neural_network_model.evaluate(test_data)['accuracy']
        
    else:
        raise ValueError(f"Unknown model type: {options['model_type']}")
    
    end_time = time.time()
    training_time = (end_time - start_time) * 1000  # Convert to milliseconds
    
    # Generate random but realistic metrics for demo purposes
    # In a real application, these would be calculated from the model evaluation
    metrics: ModelMetrics = {
        'accuracy': accuracy,
        'precision': 0.75 + random.random() * 0.2,
        'recall': 0.7 + random.random() * 0.25,
        'f1_score': 0.72 + random.random() * 0.23,
        'confusion_matrix': [
            [random.randint(0, 50), random.randint(0, 10)],
            [random.randint(0, 15), random.randint(0, 45)]
        ],
        'bias_metrics': {
            'gender_bias': random.random() * 0.3,
            'age_bias': random.random() * 0.25,
            'location_bias': random.random() * 0.2,
            'education_bias': random.random() * 0.15,
            'ethnicity_bias': random.random() * 0.35
        }
    }
    
    print(f"Model training completed in {training_time:.2f}ms with accuracy: {accuracy:.4f}")
    
    return metrics

def predict_name(demographic: Demographic) -> PredictionResult:
    """
    Makes predictions using the trained model
    """
    start_time = time.time()
    
    # Check if any model is trained
    if not random_forest_model and not gradient_boosting_model and not neural_network_model:
        raise ValueError('No trained model available. Please train a model first.')
    
    # Extract features
    features = extract_features_from_demographic(demographic)
    
    # Make prediction using the best available model
    predictions = []
    model_used = ''
    
    if neural_network_model:
        predictions = neural_network_model.predict(features)
        model_used = 'Neural Network'
    elif gradient_boosting_model:
        predictions = gradient_boosting_model.predict(features)
        model_used = 'Gradient Boosting'
    elif random_forest_model:
        predictions = random_forest_model.predict(features)
        model_used = 'Random Forest'
    else:
        raise ValueError('No trained model available')
    
    end_time = time.time()
    processing_time = (end_time - start_time) * 1000  # Convert to milliseconds
    
    # Calculate an overall confidence score (weighted average of top predictions)
    overall_confidence = sum(pred['confidence'] * (3 - idx) / 6 for idx, pred in enumerate(predictions))
    
    # Calculate data quality score (simplified for demo)
    data_quality = 0.7 + random.random() * 0.3
    
    return {
        'names': predictions,
        'metadata': {
            'processing_time': processing_time,
            'model_used': model_used,
            'confidence': overall_confidence,
            'data_quality': data_quality
        }
    }

def get_dataset_stats() -> DatasetStats:
    """
    Gets dataset statistics
    """
    # In a real application, this would analyze the actual dataset
    # For demo purposes, we'll generate realistic statistics
    
    total_records = len(extended_name_data)
    unique_names = len(set(item['name'] for item in extended_name_data))
    
    return {
        'total_records': total_records,
        'unique_names': unique_names,
        'missing_values': {
            'age': 0,
            'gender': 0,
            'location': random.randint(0, 3),
            'education_level': random.randint(0, 2),
            'ethnicity': random.randint(0, 4)
        },
        'age_distribution': {
            '18-24': int(total_records * 0.15),
            '25-34': int(total_records * 0.25),
            '35-44': int(total_records * 0.2),
            '45-54': int(total_records * 0.15),
            '55-64': int(total_records * 0.15),
            '65+': int(total_records * 0.1)
        },
        'gender_distribution': {
            'male': int(total_records * 0.48),
            'female': int(total_records * 0.48),
            'nonbinary': int(total_records * 0.03),
            'other': int(total_records * 0.01)
        },
        'location_distribution': {
            'Northeast': int(total_records * 0.25),
            'Midwest': int(total_records * 0.25),
            'South': int(total_records * 0.3),
            'West': int(total_records * 0.2)
        },
        'education_distribution': {
            'high-school': int(total_records * 0.3),
            'some-college': int(total_records * 0.2),
            'bachelors': int(total_records * 0.3),
            'masters': int(total_records * 0.15),
            'doctorate': int(total_records * 0.05)
        },
        'ethnicity_distribution': {
            'White': int(total_records * 0.6),
            'Black': int(total_records * 0.12),
            'Hispanic': int(total_records * 0.15),
            'Asian': int(total_records * 0.08),
            'Middle Eastern': int(total_records * 0.03),
            'Other': int(total_records * 0.02)
        }
    } 