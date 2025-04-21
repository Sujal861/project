import random
from typing import Dict, List, Any, Tuple
from types import Demographic

def preprocess_data(data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Preprocesses demographic data for model training
    """
    cleaned_data = clean_data(data)
    engineered_data = engineer_features(cleaned_data)
    return normalize_data(engineered_data)

def clean_data(data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Cleans raw demographic data by handling missing values and outliers
    """
    return [
        record for record in data
        if (
            'demographic' in record and
            isinstance(record['demographic'].get('age'), (int, float)) and
            record['demographic'].get('gender') and
            record['demographic'].get('location') and
            record['demographic'].get('educationLevel') and
            record['demographic'].get('ethnicity') and
            record.get('name')
        )
    ]

def engineer_features(data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Engineers features from demographic data
    """
    return [
        {
            'features': {
                # One-hot encode gender
                'genderMale': 1 if record['demographic']['gender'] == 'male' else 0,
                'genderFemale': 1 if record['demographic']['gender'] == 'female' else 0,
                'genderNonBinary': 1 if record['demographic']['gender'] == 'nonbinary' else 0,
                'genderOther': 1 if record['demographic']['gender'] == 'other' else 0,

                # One-hot encode region
                'regionNortheast': 1 if record['demographic']['location'] == 'Northeast' else 0,
                'regionMidwest': 1 if record['demographic']['location'] == 'Midwest' else 0,
                'regionSouth': 1 if record['demographic']['location'] == 'South' else 0,
                'regionWest': 1 if record['demographic']['location'] == 'West' else 0,

                # One-hot encode education level
                'educationHighSchool': 1 if record['demographic']['educationLevel'] == 'high-school' else 0,
                'educationSomeCollege': 1 if record['demographic']['educationLevel'] == 'some-college' else 0,
                'educationBachelors': 1 if record['demographic']['educationLevel'] == 'bachelors' else 0,
                'educationMasters': 1 if record['demographic']['educationLevel'] == 'masters' else 0,
                'educationDoctorate': 1 if record['demographic']['educationLevel'] == 'doctorate' else 0,
                'educationOther': 1 if record['demographic']['educationLevel'] == 'other' else 0,

                # Binned age groups
                'ageGroup18To24': 1 if get_age_bin(record['demographic']['age']) == '18-24' else 0,
                'ageGroup25To34': 1 if get_age_bin(record['demographic']['age']) == '25-34' else 0,
                'ageGroup35To44': 1 if get_age_bin(record['demographic']['age']) == '35-44' else 0,
                'ageGroup45To54': 1 if get_age_bin(record['demographic']['age']) == '45-54' else 0,
                'ageGroup55To64': 1 if get_age_bin(record['demographic']['age']) == '55-64' else 0,
                'ageGroup65Plus': 1 if get_age_bin(record['demographic']['age']) == '65+' else 0,

                # Simplified ethnicity groups - in production, this would be more comprehensive
                'ethnicityWhite': 1 if record['demographic']['ethnicity'] == 'White' else 0,
                'ethnicityBlack': 1 if record['demographic']['ethnicity'] == 'Black' else 0,
                'ethnicityHispanic': 1 if record['demographic']['ethnicity'] == 'Hispanic' else 0,
                'ethnicityAsian': 1 if record['demographic']['ethnicity'] == 'Asian' else 0,
                'ethnicityMiddleEastern': 1 if record['demographic']['ethnicity'] == 'Middle Eastern' else 0,
                'ethnicityOther': 1 if record['demographic']['ethnicity'] not in ['White', 'Black', 'Hispanic', 'Asian', 'Middle Eastern'] else 0,

                # Keep original values as well for some models
                'age': record['demographic']['age'],
            },
            'label': record['name'],
        }
        for record in data
    ]

def normalize_data(data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Normalize numeric features to a 0-1 range
    """
    # Find min and max for age
    ages = [record['features']['age'] for record in data]
    min_age = min(ages)
    max_age = max(ages)
    
    return [
        {
            'features': {
                **record['features'],
                # Normalize age to 0-1 range
                'age': 0.5 if max_age == min_age else (record['features']['age'] - min_age) / (max_age - min_age)
            },
            'label': record['label'],
        }
        for record in data
    ]

def get_age_bin(age: int) -> str:
    """
    Bins age into standard demographic groups
    """
    if age < 18:
        return 'under-18'
    elif age <= 24:
        return '18-24'
    elif age <= 34:
        return '25-34'
    elif age <= 44:
        return '35-44'
    elif age <= 54:
        return '45-54'
    elif age <= 64:
        return '55-64'
    else:
        return '65+'

def split_train_test(data: List[Dict[str, Any]], train_ratio: float = 0.8) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]]]:
    """
    Splits data into training and testing sets
    """
    # Shuffle the data
    shuffled = data.copy()
    random.shuffle(shuffled)
    
    train_size = int(len(data) * train_ratio)
    train_data = shuffled[:train_size]
    test_data = shuffled[train_size:]
    
    return train_data, test_data

def extract_features_from_demographic(demographic: Demographic) -> Dict[str, float]:
    """
    Extracts features from a single demographic record for prediction
    """
    age_bin = get_age_bin(demographic['age'])
    
    return {
        # One-hot encode gender
        'genderMale': 1 if demographic['gender'] == 'male' else 0,
        'genderFemale': 1 if demographic['gender'] == 'female' else 0,
        'genderNonBinary': 1 if demographic['gender'] == 'nonbinary' else 0,
        'genderOther': 1 if demographic['gender'] == 'other' else 0,

        # One-hot encode region
        'regionNortheast': 1 if demographic['location'] == 'Northeast' else 0,
        'regionMidwest': 1 if demographic['location'] == 'Midwest' else 0,
        'regionSouth': 1 if demographic['location'] == 'South' else 0,
        'regionWest': 1 if demographic['location'] == 'West' else 0,

        # One-hot encode education level
        'educationHighSchool': 1 if demographic['education_level'] == 'high-school' else 0,
        'educationSomeCollege': 1 if demographic['education_level'] == 'some-college' else 0,
        'educationBachelors': 1 if demographic['education_level'] == 'bachelors' else 0,
        'educationMasters': 1 if demographic['education_level'] == 'masters' else 0,
        'educationDoctorate': 1 if demographic['education_level'] == 'doctorate' else 0,
        'educationOther': 1 if demographic['education_level'] == 'other' else 0,

        # Binned age groups
        'ageGroup18To24': 1 if age_bin == '18-24' else 0,
        'ageGroup25To34': 1 if age_bin == '25-34' else 0,
        'ageGroup35To44': 1 if age_bin == '35-44' else 0,
        'ageGroup45To54': 1 if age_bin == '45-54' else 0,
        'ageGroup55To64': 1 if age_bin == '55-64' else 0,
        'ageGroup65Plus': 1 if age_bin == '65+' else 0,

        # Simplified ethnicity groups
        'ethnicityWhite': 1 if demographic['ethnicity'] == 'White' else 0,
        'ethnicityBlack': 1 if demographic['ethnicity'] == 'Black' else 0,
        'ethnicityHispanic': 1 if demographic['ethnicity'] == 'Hispanic' else 0,
        'ethnicityAsian': 1 if demographic['ethnicity'] == 'Asian' else 0,
        'ethnicityMiddleEastern': 1 if demographic['ethnicity'] == 'Middle Eastern' else 0,
        'ethnicityOther': 1 if demographic['ethnicity'] not in ['White', 'Black', 'Hispanic', 'Asian', 'Middle Eastern'] else 0,

        # Keep original age (would be normalized in a real implementation)
        'age': demographic['age'] / 100,  # Simple normalization for demo
    } 