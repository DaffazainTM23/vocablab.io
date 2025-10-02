export interface Topic {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  order_index: number;
  created_at: string;
}

export interface Vocabulary {
  id: string;
  topic_id: string;
  word: string;
  ipa: string;
  audio_uk_url: string | null;
  audio_us_url: string | null;
  meaning_id: string;
  example_en: string;
  part_of_speech: string;
  tags: string[];
  difficulty_level: number;
  created_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  topic_id: string;
  words_learned: number;
  total_words: number;
  accuracy: number;
  time_spent_minutes: number;
  streak_days: number;
  last_practice_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface QuizResult {
  id: string;
  user_id: string;
  topic_id: string | null;
  game_type: string;
  score: number;
  total_questions: number;
  accuracy: number;
  time_taken_seconds: number;
  completed_at: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  criteria: Record<string, any>;
  created_at: string;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
  badge?: Badge;
}

export type GameType = 'multiple_choice' | 'matching' | 'listening' | 'typing_sprint' | 'spelling_bee' | 'pronunciation_battle';

export type AudioAccent = 'uk' | 'us';
