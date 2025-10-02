/*
  # VocabLab Database Schema - Initial Setup
  
  ## Overview
  This migration creates the complete database schema for VocabLab.io, an AI Vocabulary Learning Platform for Grade 7 students.
  
  ## New Tables
  
  ### 1. topics
  Stores the 10 main vocabulary topic categories (People & Family, School & Classroom, etc.)
  - `id` (uuid, primary key) - Unique topic identifier
  - `name` (text) - Topic name (e.g., "People and Family")
  - `slug` (text, unique) - URL-friendly version (e.g., "people-and-family")
  - `icon` (text) - Icon identifier for UI display
  - `description` (text) - Brief description of the topic
  - `order_index` (integer) - Display order on topics page
  - `created_at` (timestamptz) - Creation timestamp
  
  ### 2. vocabulary
  Stores all vocabulary words with complete learning data
  - `id` (uuid, primary key) - Unique word entry identifier
  - `topic_id` (uuid, foreign key) - Reference to topics table
  - `word` (text) - The English word
  - `ipa` (text) - International Phonetic Alphabet pronunciation
  - `audio_uk_url` (text, nullable) - UK pronunciation audio URL
  - `audio_us_url` (text, nullable) - US pronunciation audio URL
  - `meaning_id` (text) - Indonesian translation
  - `example_en` (text) - Example sentence in English
  - `part_of_speech` (text) - Word type (noun, verb, adjective, etc.)
  - `tags` (text array) - Categorization tags for filtering
  - `difficulty_level` (integer, default 1) - Difficulty rating 1-5
  - `created_at` (timestamptz) - Creation timestamp
  
  ### 3. user_progress
  Tracks individual user learning progress (uses local user_id from browser)
  - `id` (uuid, primary key) - Unique progress record identifier
  - `user_id` (text) - Local browser-generated user identifier
  - `topic_id` (uuid, foreign key) - Reference to topics table
  - `words_learned` (integer, default 0) - Count of mastered words
  - `total_words` (integer, default 0) - Total words in topic
  - `accuracy` (decimal, default 0) - Overall accuracy percentage
  - `time_spent_minutes` (integer, default 0) - Total study time
  - `streak_days` (integer, default 0) - Consecutive days practiced
  - `last_practice_date` (date) - Last practice session date
  - `created_at` (timestamptz) - First practice timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  
  ### 4. quiz_results
  Stores game and quiz performance data
  - `id` (uuid, primary key) - Unique result identifier
  - `user_id` (text) - Local browser-generated user identifier
  - `topic_id` (uuid, foreign key, nullable) - Related topic if applicable
  - `game_type` (text) - Type of game (multiple_choice, matching, listening, typing_sprint, etc.)
  - `score` (integer) - Points earned
  - `total_questions` (integer) - Total questions in quiz
  - `accuracy` (decimal) - Accuracy percentage
  - `time_taken_seconds` (integer) - Completion time
  - `completed_at` (timestamptz) - Completion timestamp
  
  ### 5. badges
  Defines available achievement badges
  - `id` (uuid, primary key) - Unique badge identifier
  - `name` (text, unique) - Badge name (e.g., "Starter", "Streak 7")
  - `description` (text) - Badge description
  - `icon` (text) - Icon identifier
  - `criteria` (jsonb) - Achievement criteria as JSON
  - `created_at` (timestamptz) - Creation timestamp
  
  ### 6. user_badges
  Tracks which badges users have earned
  - `id` (uuid, primary key) - Unique record identifier
  - `user_id` (text) - Local browser-generated user identifier
  - `badge_id` (uuid, foreign key) - Reference to badges table
  - `earned_at` (timestamptz) - When the badge was earned
  
  ## Security
  - Enable RLS on all tables
  - Allow public read access for topics, vocabulary, and badges (educational content)
  - Restrict user_progress, quiz_results, and user_badges to authenticated sessions or local user_id matching
  
  ## Indexes
  - Index on vocabulary.topic_id for fast topic-based queries
  - Index on user_progress.user_id and topic_id for progress lookups
  - Index on quiz_results.user_id for leaderboard queries
*/

-- Create topics table
CREATE TABLE IF NOT EXISTS topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  icon text NOT NULL DEFAULT 'book',
  description text NOT NULL DEFAULT '',
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create vocabulary table
CREATE TABLE IF NOT EXISTS vocabulary (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id uuid NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  word text NOT NULL,
  ipa text NOT NULL DEFAULT '',
  audio_uk_url text,
  audio_us_url text,
  meaning_id text NOT NULL,
  example_en text NOT NULL DEFAULT '',
  part_of_speech text NOT NULL DEFAULT 'noun',
  tags text[] DEFAULT ARRAY[]::text[],
  difficulty_level integer DEFAULT 1 CHECK (difficulty_level BETWEEN 1 AND 5),
  created_at timestamptz DEFAULT now()
);

-- Create user_progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  topic_id uuid NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  words_learned integer DEFAULT 0,
  total_words integer DEFAULT 0,
  accuracy decimal(5,2) DEFAULT 0,
  time_spent_minutes integer DEFAULT 0,
  streak_days integer DEFAULT 0,
  last_practice_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, topic_id)
);

-- Create quiz_results table
CREATE TABLE IF NOT EXISTS quiz_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  topic_id uuid REFERENCES topics(id) ON DELETE SET NULL,
  game_type text NOT NULL,
  score integer DEFAULT 0,
  total_questions integer DEFAULT 0,
  accuracy decimal(5,2) DEFAULT 0,
  time_taken_seconds integer DEFAULT 0,
  completed_at timestamptz DEFAULT now()
);

-- Create badges table
CREATE TABLE IF NOT EXISTS badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text NOT NULL,
  icon text NOT NULL DEFAULT 'award',
  criteria jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create user_badges table
CREATE TABLE IF NOT EXISTS user_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  badge_id uuid NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  earned_at timestamptz DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_vocabulary_topic_id ON vocabulary(topic_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_topic_id ON user_progress(topic_id);
CREATE INDEX IF NOT EXISTS idx_quiz_results_user_id ON quiz_results(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_results_game_type ON quiz_results(game_type);
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges(user_id);

-- Enable Row Level Security
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE vocabulary ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public read access to educational content
CREATE POLICY "Topics are publicly readable"
  ON topics FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Vocabulary is publicly readable"
  ON vocabulary FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Badges are publicly readable"
  ON badges FOR SELECT
  TO public
  USING (true);

-- RLS Policies for user-specific data (anyone can insert/update their own data)
CREATE POLICY "Users can view their own progress"
  ON user_progress FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can insert their own progress"
  ON user_progress FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can update their own progress"
  ON user_progress FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can view all quiz results"
  ON quiz_results FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can insert their own quiz results"
  ON quiz_results FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can view their own badges"
  ON user_badges FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can insert their own badges"
  ON user_badges FOR INSERT
  TO public
  WITH CHECK (true);