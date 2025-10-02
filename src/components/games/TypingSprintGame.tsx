import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, Trophy, RotateCcw, Zap } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { topicsData } from '../../data/topics';
import { Vocabulary } from '../../types/database';
import { shuffleArray, getUserId } from '../../lib/utils';

export function TypingSprintGame() {
  const [searchParams] = useSearchParams();
  const topicSlug = searchParams.get('topic');
  const [vocabulary, setVocabulary] = useState<Vocabulary[]>([]);
  const [currentWord, setCurrentWord] = useState<Vocabulary | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState(0);

  const topic = topicsData.find(t => t.slug === topicSlug);

  useEffect(() => {
    loadVocabulary();
  }, [topicSlug]);

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && isPlaying) {
      finishGame();
    }
  }, [timeLeft, isPlaying]);

  async function loadVocabulary() {
    try {
      let query = supabase.from('vocabulary').select('*');
      if (topicSlug) {
        const { data: topicData } = await supabase.from('topics').select('id').eq('slug', topicSlug).maybeSingle();
        if (topicData) query = query.eq('topic_id', topicData.id);
      }
      const { data } = await query;
      if (data && data.length > 0) {
        const shuffled = shuffleArray(data);
        setVocabulary(shuffled);
        setCurrentWord(shuffled[0]);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  const startGame = () => {
    setIsPlaying(true);
    setTimeLeft(60);
    setScore(0);
    setStreak(0);
  };

  const checkAnswer = () => {
    if (!currentWord) return;

    const isCorrect = userAnswer.trim().toLowerCase() === currentWord.meaning_id.toLowerCase();

    if (isCorrect) {
      setScore(score + 1);
      setStreak(streak + 1);
      const nextWord = vocabulary[Math.floor(Math.random() * vocabulary.length)];
      setCurrentWord(nextWord);
      setUserAnswer('');
    } else {
      setStreak(0);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      checkAnswer();
    }
  };

  const finishGame = () => {
    setIsPlaying(false);
    setIsFinished(true);
    saveResult();
  };

  async function saveResult() {
    try {
      const userId = getUserId();
      const { data: topicData } = await supabase.from('topics').select('id').eq('slug', topicSlug).maybeSingle();
      await supabase.from('quiz_results').insert({
        user_id: userId,
        topic_id: topicData?.id || null,
        game_type: 'typing_sprint',
        score,
        total_questions: score,
        accuracy: 100,
        time_taken_seconds: 60
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const resetGame = () => {
    setIsFinished(false);
    setIsPlaying(false);
    setScore(0);
    setStreak(0);
    setTimeLeft(60);
    setUserAnswer('');
    loadVocabulary();
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="inline-block w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/games" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-500 mb-6">
          <ArrowLeft size={20} />
          Back to Games
        </Link>

        <div className="max-w-2xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              <span className="gradient-text">Typing Sprint</span>
            </h1>
            {topic && <p className="text-gray-600 dark:text-gray-400">{topic.name}</p>}
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              Type the Indonesian meaning as fast as you can in 60 seconds!
            </p>
          </div>

          {!isPlaying && !isFinished && (
            <div className="glass-card-light p-8 text-center">
              <Zap className="w-20 h-20 mx-auto mb-4 text-primary-500" />
              <h3 className="text-2xl font-bold mb-4">Ready to Sprint?</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                You have 60 seconds to translate as many words as possible!
              </p>
              <button onClick={startGame} className="btn-primary text-lg px-8 py-4">
                Start Game
              </button>
            </div>
          )}

          {isPlaying && (
            <div className="glass-card-light p-8">
              <div className="flex justify-between mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-500">{timeLeft}s</div>
                  <div className="text-xs text-gray-500">Time Left</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-secondary-500">{score}</div>
                  <div className="text-xs text-gray-500">Score</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent-500">{streak}</div>
                  <div className="text-xs text-gray-500">Streak</div>
                </div>
              </div>

              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {currentWord?.word}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  /{currentWord?.ipa}/
                </div>
              </div>

              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type the Indonesian meaning..."
                className="w-full px-4 py-4 text-lg rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-primary-500 mb-4"
                autoFocus
              />

              <button
                onClick={checkAnswer}
                className="btn-primary w-full text-lg"
              >
                Submit (Enter)
              </button>

              {streak >= 5 && (
                <div className="mt-4 p-3 bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300 rounded-xl text-center font-semibold">
                  🔥 {streak}x Streak! Keep going!
                </div>
              )}
            </div>
          )}

          {isFinished && (
            <div className="glass-card-light p-8 text-center">
              <Trophy className="w-20 h-20 mx-auto mb-4 text-primary-500" />
              <h3 className="text-3xl font-bold mb-4 gradient-text">Time's Up!</h3>
              <div className="text-6xl font-bold text-gray-900 dark:text-white mb-2">{score}</div>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">Correct Translations</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
                Words per minute: {Math.round((score / 60) * 60)}
              </p>
              <div className="flex gap-4 justify-center">
                <button onClick={resetGame} className="btn-primary inline-flex items-center gap-2">
                  <RotateCcw size={20} />
                  Play Again
                </button>
                <Link to="/games" className="btn-secondary">Choose Another Game</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
