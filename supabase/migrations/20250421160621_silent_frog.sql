/*
  # Initial schema for name prediction system

  1. New Tables
    - `demographics`
      - `id` (uuid, primary key)
      - `age` (integer)
      - `gender` (text)
      - `location` (text)
      - `education_level` (text)
      - `ethnicity` (text)
      - `created_at` (timestamp)
    
    - `names`
      - `id` (uuid, primary key)
      - `name` (text)
      - `demographic_id` (uuid, foreign key)
      - `confidence_score` (float)
      - `created_at` (timestamp)
    
    - `model_metrics`
      - `id` (uuid, primary key)
      - `model_type` (text)
      - `accuracy` (float)
      - `precision` (float)
      - `recall` (float)
      - `f1_score` (float)
      - `bias_metrics` (jsonb)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Demographics table
CREATE TABLE demographics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  age integer NOT NULL,
  gender text NOT NULL,
  location text NOT NULL,
  education_level text NOT NULL,
  ethnicity text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE demographics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read demographics"
  ON demographics
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert demographics"
  ON demographics
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Names table
CREATE TABLE names (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  demographic_id uuid REFERENCES demographics(id) ON DELETE CASCADE,
  confidence_score float NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE names ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read names"
  ON names
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert names"
  ON names
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Model metrics table
CREATE TABLE model_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  model_type text NOT NULL,
  accuracy float NOT NULL,
  precision float NOT NULL,
  recall float NOT NULL,
  f1_score float NOT NULL,
  bias_metrics jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE model_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read model metrics"
  ON model_metrics
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert model metrics"
  ON model_metrics
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX idx_demographics_created_at ON demographics(created_at);
CREATE INDEX idx_names_demographic_id ON names(demographic_id);
CREATE INDEX idx_names_created_at ON names(created_at);
CREATE INDEX idx_model_metrics_created_at ON model_metrics(created_at);
CREATE INDEX idx_model_metrics_model_type ON model_metrics(model_type);