from typing import Dict, List, Union, Literal, TypedDict, Optional

# Define string literals for constrained string types
GenderType = Literal['male', 'female', 'nonbinary', 'other']
EducationLevelType = Literal['high-school', 'some-college', 'bachelors', 'masters', 'doctorate', 'other']
ModelType = Literal['randomForest', 'gradientBoosting', 'neuralNetwork', 'lstm', 'transformer']

class Demographic(TypedDict):
    age: int
    gender: GenderType
    location: str
    education_level: EducationLevelType
    ethnicity: str

class NamePrediction(TypedDict):
    name: str
    confidence: float
    rank: int

class PredictionMetadata(TypedDict):
    processing_time: float
    model_used: str
    confidence: float
    data_quality: float

class PredictionResult(TypedDict):
    names: List[NamePrediction]
    metadata: PredictionMetadata

class DatasetStats(TypedDict):
    total_records: int
    unique_names: int
    missing_values: Dict[str, int]
    age_distribution: Dict[str, int]
    gender_distribution: Dict[str, int]
    location_distribution: Dict[str, int]
    education_distribution: Dict[str, int]
    ethnicity_distribution: Dict[str, int]

class BiasMetrics(TypedDict):
    gender_bias: float
    age_bias: float
    location_bias: float
    education_bias: float
    ethnicity_bias: float

class ModelMetrics(TypedDict):
    accuracy: float
    precision: float
    recall: float
    f1_score: float
    confusion_matrix: List[List[int]]
    bias_metrics: BiasMetrics

class FeatureEngineering(TypedDict):
    one_hot_encoding: bool
    age_binning: bool
    geographic_clustering: bool
    cultural_markers: bool

class TrainingOptions(TypedDict):
    model_type: ModelType
    train_test_split: float
    feature_engineering: FeatureEngineering
    hyperparameters: Dict[str, Union[float, str, bool]] 