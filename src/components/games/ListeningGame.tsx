import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, Volume2, Trophy, RotateCcw, Check, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { topicsData } from '../../data/topics';
import { Vocabulary } from '../../types/database';
import { shuffleArray, getUserId, speakText } from '../../lib/utils';

export function ListeningGame() {
  const [searchParams] = useSearchParams();
  const topicSlug = searchParams.get('topic');
  const [vocabulary, setVocabulary] = useState<Vocabulary[]>([]);
  const [currentWord, setCurrentWord] = useState<Vocabulary | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const totalRounds = 10;

  const topic = topicsData.find(t => t.slug === topicSlug);

  useEffect(() => {
    loadVocabulary();
  }, [topicSlug]);

  async function loadVocabulary() {
    try {
      let query = supabase.from('vocabulary').select('*');
      if (topicSlug) {
        const { data: topicData } = await supabase.from('topics').select('id').eq('slug', topicSlug).maybeSingle();
        if (topicData) query = query.eq('topic_id', topicData.id);
      }
      const { data } = await query;
      if (data && data.length > 0) {
        const shuffled = shuffleArray(data).slice(0, totalRounds);
        setVocabulary(shuffled);
        setCurrentWord(shuffled[0]);
        speakWord(shuffled[0].word);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  const speakWord = (word: string) => {
    setTimeout(() => speakText(word, 'en-US', 0.8), 500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentWord || feedback) return;

    const isCorrect = userAnswer.trim().toLowerCase() === currentWord.word.toLowerCase();
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    if (isCorrect) setScore(score + 1);

    setTimeout(() => {
      if (round < totalRounds - 1) {
        const nextRound = round + 1;
        setRound(nextRound);
        setCurrentWord(vocabulary[nextRound]);
        setUserAnswer('');
        setFeedback(null);
        speakWord(vocabulary[nextRound].word);
      } else {
        setIsFinished(true);
        saveResult();
      }
    }, 2000);
  };

  async function saveResult() {
    try {
      const userId = getUserId();
      const accuracy = (score / totalRounds) * 100;
      const { data: topicData } = await supabase.from('topics').select('id').eq('slug', topicSlug).maybeSingle();
      await supabase.from('quiz_results').insert({
        user_id: userId,
        topic_id: topicData?.id || null,
        game_type: 'listening',
        score,
        total_questions: totalRounds,
        accuracy,
        time_taken_seconds: 0
      });
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const resetGame = () => {
    setRound(0);
    setScore(0);
    setUserAnswer('');
    setFeedback(null);
    setIsFinished(false);
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
              <span className="gradient-text">Listening Challenge</span>
            </h1>
            {topic && <p className="text-gray-600 dark:text-gray-400">{topic.name}</p>}
          </div>

          {!isFinished ? (
            <div className="glass-card-light p-8">
              <div className="flex justify-between mb-6">
                <span className="font-semibold text-primary-500">Round {round + 1}/{totalRounds}</span>
                <span className="font-semibold text-gray-600 dark:text-gray-400">Score: {score}</span>
              </div>

              <div className="text-center mb-8">
                <button
                  onClick={() => currentWord && speakWord(currentWord.word)}
                  className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-primary hover:scale-110 transition-transform"
                >
                  <Volume2 className="text-white" size={48} />
                </button>
                <p className="mt-4 text-gray-600 dark:text-gray-400">Click to hear the word</p>
              </div>

              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  disabled={feedback !== null}
                  placeholder="Type what you hear..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-primary-500 mb-4"
                  autoFocus
                />

                {feedback && (
                  <div className={`p-4 rounded-xl mb-4 ${
                    feedback === 'correct'
                      ? 'bg-secondary-100 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-300'
                      : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      {feedback === 'correct' ? <Check size={20} /> : <X size={20} />}
                      <span className="font-semibold">
                        {feedback === 'correct' ? 'Correct!' : 'Incorrect'}
                      </span>
                    </div>
                    <p>The word was: <strong>{currentWord?.word}</strong></p>
                    <p className="text-sm mt-1 italic">"{currentWord?.example_en}"</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!userAnswer.trim() || feedback !== null}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Answer
                </button>
              </form>
            </div>
          ) : (
            <div className="glass-card-light p-8 text-center">
              <Trophy className="w-20 h-20 mx-auto mb-4 text-primary-500" />
              <h3 className="text-3xl font-bold mb-4 gradient-text">Challenge Complete!</h3>
              <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">{score}/{totalRounds}</div>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                Accuracy: {Math.round((score / totalRounds) * 100)}%
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
