import type { Demographic } from '../types';

/**
 * Preprocesses demographic data for model training
 */
export function preprocessData(data: any[]): any[] {
  const cleanedData = cleanData(data);
  const engineeredData = engineerFeatures(cleanedData);
  return normalizeData(engineeredData);
}

/**
 * Cleans raw demographic data by handling missing values and outliers
 */
function cleanData(data: any[]): any[] {
  return data.filter(record => {
    // Filter out incomplete records
    return (
      record.demographic &&
      typeof record.demographic.age === 'number' &&
      record.demographic.gender &&
      record.demographic.location &&
      record.demographic.educationLevel &&
      record.demographic.ethnicity &&
      record.name
    );
  });
}

/**
 * Engineers features from demographic data
 */
function engineerFeatures(data: any[]): any[] {
  return data.map(record => {
    const { demographic, name } = record;
    const ageBin = getAgeBin(demographic.age);
    const features = {
      // One-hot encode gender
      genderMale: demographic.gender === 'male' ? 1 : 0,
      genderFemale: demographic.gender === 'female' ? 1 : 0,
      genderNonBinary: demographic.gender === 'nonbinary' ? 1 : 0,
      genderOther: demographic.gender === 'other' ? 1 : 0,

      // One-hot encode region
      regionNortheast: demographic.location === 'Northeast' ? 1 : 0,
      regionMidwest: demographic.location === 'Midwest' ? 1 : 0,
      regionSouth: demographic.location === 'South' ? 1 : 0,
      regionWest: demographic.location === 'West' ? 1 : 0,

      // One-hot encode education level
      educationHighSchool: demographic.educationLevel === 'high-school' ? 1 : 0,
      educationSomeCollege: demographic.educationLevel === 'some-college' ? 1 : 0,
      educationBachelors: demographic.educationLevel === 'bachelors' ? 1 : 0,
      educationMasters: demographic.educationLevel === 'masters' ? 1 : 0,
      educationDoctorate: demographic.educationLevel === 'doctorate' ? 1 : 0,
      educationOther: demographic.educationLevel === 'other' ? 1 : 0,

      // Binned age groups
      ageGroup18To24: ageBin === '18-24' ? 1 : 0,
      ageGroup25To34: ageBin === '25-34' ? 1 : 0,
      ageGroup35To44: ageBin === '35-44' ? 1 : 0,
      ageGroup45To54: ageBin === '45-54' ? 1 : 0,
      ageGroup55To64: ageBin === '55-64' ? 1 : 0,
      ageGroup65Plus: ageBin === '65+' ? 1 : 0,

      // Simplified ethnicity groups - in production, this would be more comprehensive
      ethnicityWhite: demographic.ethnicity === 'White' ? 1 : 0,
      ethnicityBlack: demographic.ethnicity === 'Black' ? 1 : 0,
      ethnicityHispanic: demographic.ethnicity === 'Hispanic' ? 1 : 0,
      ethnicityAsian: demographic.ethnicity === 'Asian' ? 1 : 0,
      ethnicityMiddleEastern: demographic.ethnicity === 'Middle Eastern' ? 1 : 0,
      ethnicityOther: !['White', 'Black', 'Hispanic', 'Asian', 'Middle Eastern'].includes(demographic.ethnicity) ? 1 : 0,

      // Keep original values as well for some models
      age: demographic.age,
    };

    return {
      features,
      label: name,
    };
  });
}

/**
 * Normalize numeric features to a 0-1 range
 */
function normalizeData(data: any[]): any[] {
  // Find min and max for age
  const ages = data.map(record => record.features.age);
  const minAge = Math.min(...ages);
  const maxAge = Math.max(...ages);
  
  return data.map(record => {
    const normalizedFeatures = { ...record.features };
    
    // Normalize age to 0-1 range
    normalizedFeatures.age = maxAge === minAge ? 
      0.5 : // Handle edge case where all ages are the same
      (record.features.age - minAge) / (maxAge - minAge);
    
    return {
      features: normalizedFeatures,
      label: record.label,
    };
  });
}

/**
 * Bins age into standard demographic groups
 */
function getAgeBin(age: number): string {
  if (age < 18) return 'under-18';
  if (age <= 24) return '18-24';
  if (age <= 34) return '25-34';
  if (age <= 44) return '35-44';
  if (age <= 54) return '45-54';
  if (age <= 64) return '55-64';
  return '65+';
}

/**
 * Splits data into training and testing sets
 */
export function splitTrainTest(data: any[], trainRatio = 0.8): { train: any[], test: any[] } {
  // Shuffle the data
  const shuffled = [...data].sort(() => Math.random() - 0.5);
  
  const trainSize = Math.floor(data.length * trainRatio);
  const trainData = shuffled.slice(0, trainSize);
  const testData = shuffled.slice(trainSize);
  
  return { train: trainData, test: testData };
}

/**
 * Extracts features from a single demographic record for prediction
 */
export function extractFeaturesFromDemographic(demographic: Demographic): any {
  const ageBin = getAgeBin(demographic.age);
  
  return {
    // One-hot encode gender
    genderMale: demographic.gender === 'male' ? 1 : 0,
    genderFemale: demographic.gender === 'female' ? 1 : 0,
    genderNonBinary: demographic.gender === 'nonbinary' ? 1 : 0,
    genderOther: demographic.gender === 'other' ? 1 : 0,

    // One-hot encode region
    regionNortheast: demographic.location === 'Northeast' ? 1 : 0,
    regionMidwest: demographic.location === 'Midwest' ? 1 : 0,
    regionSouth: demographic.location === 'South' ? 1 : 0,
    regionWest: demographic.location === 'West' ? 1 : 0,

    // One-hot encode education level
    educationHighSchool: demographic.educationLevel === 'high-school' ? 1 : 0,
    educationSomeCollege: demographic.educationLevel === 'some-college' ? 1 : 0,
    educationBachelors: demographic.educationLevel === 'bachelors' ? 1 : 0,
    educationMasters: demographic.educationLevel === 'masters' ? 1 : 0,
    educationDoctorate: demographic.educationLevel === 'doctorate' ? 1 : 0,
    educationOther: demographic.educationLevel === 'other' ? 1 : 0,

    // Binned age groups
    ageGroup18To24: ageBin === '18-24' ? 1 : 0,
    ageGroup25To34: ageBin === '25-34' ? 1 : 0,
    ageGroup35To44: ageBin === '35-44' ? 1 : 0,
    ageGroup45To54: ageBin === '45-54' ? 1 : 0,
    ageGroup55To64: ageBin === '55-64' ? 1 : 0,
    ageGroup65Plus: ageBin === '65+' ? 1 : 0,

    // Simplified ethnicity groups
    ethnicityWhite: demographic.ethnicity === 'White' ? 1 : 0,
    ethnicityBlack: demographic.ethnicity === 'Black' ? 1 : 0,
    ethnicityHispanic: demographic.ethnicity === 'Hispanic' ? 1 : 0,
    ethnicityAsian: demographic.ethnicity === 'Asian' ? 1 : 0,
    ethnicityMiddleEastern: demographic.ethnicity === 'Middle Eastern' ? 1 : 0,
    ethnicityOther: !['White', 'Black', 'Hispanic', 'Asian', 'Middle Eastern'].includes(demographic.ethnicity) ? 1 : 0,

    // Keep original age (would be normalized in a real implementation)
    age: demographic.age / 100, // Simple normalization for demo
  };
}