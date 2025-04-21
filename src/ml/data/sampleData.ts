import type { Demographic } from '../../types';

// Sample demographic data for demonstration purposes
export const sampleDemographicData: Demographic[] = [
  { age: 25, gender: 'male', location: 'Northeast', educationLevel: 'bachelors', ethnicity: 'White' },
  { age: 32, gender: 'female', location: 'Midwest', educationLevel: 'masters', ethnicity: 'Black' },
  { age: 45, gender: 'male', location: 'South', educationLevel: 'high-school', ethnicity: 'Hispanic' },
  { age: 67, gender: 'female', location: 'West', educationLevel: 'doctorate', ethnicity: 'Asian' },
  { age: 29, gender: 'nonbinary', location: 'Northeast', educationLevel: 'bachelors', ethnicity: 'Middle Eastern' },
  { age: 52, gender: 'female', location: 'Midwest', educationLevel: 'bachelors', ethnicity: 'White' },
  { age: 38, gender: 'male', location: 'South', educationLevel: 'some-college', ethnicity: 'Black' },
  { age: 41, gender: 'female', location: 'West', educationLevel: 'masters', ethnicity: 'Asian' },
  { age: 19, gender: 'male', location: 'Northeast', educationLevel: 'some-college', ethnicity: 'Hispanic' },
  { age: 73, gender: 'female', location: 'South', educationLevel: 'high-school', ethnicity: 'White' },
];

// Sample name data matched with demographics for training
export const sampleNameData = [
  { demographic: sampleDemographicData[0], name: 'Michael' },
  { demographic: sampleDemographicData[1], name: 'Michelle' },
  { demographic: sampleDemographicData[2], name: 'Robert' },
  { demographic: sampleDemographicData[3], name: 'Elizabeth' },
  { demographic: sampleDemographicData[4], name: 'Taylor' },
  { demographic: sampleDemographicData[5], name: 'Karen' },
  { demographic: sampleDemographicData[6], name: 'James' },
  { demographic: sampleDemographicData[7], name: 'Jennifer' },
  { demographic: sampleDemographicData[8], name: 'Carlos' },
  { demographic: sampleDemographicData[9], name: 'Betty' },
];

// Extended dataset for more diversity in training
export const extendedNameData = [
  ...sampleNameData,
  { demographic: { age: 28, gender: 'male', location: 'West', educationLevel: 'bachelors', ethnicity: 'Asian' }, name: 'David' },
  { demographic: { age: 35, gender: 'female', location: 'Northeast', educationLevel: 'masters', ethnicity: 'Black' }, name: 'Latisha' },
  { demographic: { age: 42, gender: 'male', location: 'South', educationLevel: 'some-college', ethnicity: 'Hispanic' }, name: 'Miguel' },
  { demographic: { age: 31, gender: 'female', location: 'Midwest', educationLevel: 'bachelors', ethnicity: 'White' }, name: 'Sarah' },
  { demographic: { age: 27, gender: 'nonbinary', location: 'West', educationLevel: 'masters', ethnicity: 'Middle Eastern' }, name: 'Sam' },
  { demographic: { age: 55, gender: 'male', location: 'Northeast', educationLevel: 'doctorate', ethnicity: 'White' }, name: 'Richard' },
  { demographic: { age: 48, gender: 'female', location: 'South', educationLevel: 'bachelors', ethnicity: 'Black' }, name: 'Keisha' },
  { demographic: { age: 33, gender: 'male', location: 'Midwest', educationLevel: 'high-school', ethnicity: 'Hispanic' }, name: 'Jose' },
  { demographic: { age: 40, gender: 'female', location: 'West', educationLevel: 'some-college', ethnicity: 'Asian' }, name: 'Kim' },
  { demographic: { age: 22, gender: 'male', location: 'Northeast', educationLevel: 'some-college', ethnicity: 'Middle Eastern' }, name: 'Ali' },
];

// Voting record data (for optional use)
export const sampleVotingRecords = [
  { name: 'Michael', votingHistory: ['2016', '2020'], partyAffiliation: 'Democrat' },
  { name: 'Michelle', votingHistory: ['2016', '2018', '2020'], partyAffiliation: 'Democrat' },
  { name: 'Robert', votingHistory: ['2016', '2020'], partyAffiliation: 'Republican' },
  { name: 'Elizabeth', votingHistory: ['2016', '2018', '2020'], partyAffiliation: 'Democrat' },
  { name: 'Taylor', votingHistory: ['2020'], partyAffiliation: 'Independent' },
  { name: 'Karen', votingHistory: ['2016', '2018', '2020'], partyAffiliation: 'Republican' },
  { name: 'James', votingHistory: ['2016', '2020'], partyAffiliation: 'Republican' },
  { name: 'Jennifer', votingHistory: ['2016', '2018', '2020'], partyAffiliation: 'Democrat' },
  { name: 'Carlos', votingHistory: ['2020'], partyAffiliation: 'Democrat' },
  { name: 'Betty', votingHistory: ['2016', '2018', '2020'], partyAffiliation: 'Republican' },
];