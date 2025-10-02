import { useState, useEffect } from 'react';
import { Volume2, Check, X, Trophy, RotateCcw } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface SpellingBeeGameProps {
  topicId?: string;
}

interface Word {
  id: string;
  word: string;
  ipa: string;
  meaning_id: string;
}

export function SpellingBeeGame({ topicId }: SpellingBeeGameProps) {
  const [words, setWords] = useState<Word[]>([]);
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [totalRounds] = useState(10);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWords();
  }, [topicId]);

  const fetchWords = async () => {
    setLoading(true);
    try {
      let query = supabase.from('vocabulary').select('id, word, ipa, meaning_id');

      if (topicId) {
        const { data: topicData } = await supabase
          .from('topics')
          .select('id')
          .eq('slug', topicId)
          .single();

        if (topicData) {
          query = query.eq('topic_id', topicData.id);
        }
      }

      const { data, error } = await query.limit(50);
      if (error) throw error;

      if (data && data.length > 0) {
        const shuffled = data.sort(() => Math.random() - 0.5);
        setWords(shuffled);
        setCurrentWord(shuffled[0]);
        setRound(1);
      }
    } catch (error) {
      console.error('Error fetching words:', error);
    } finally {
      setLoading(false);
    }
  };

  const speakWord = () => {
    if (!currentWord) return;
    const utterance = new SpeechSynthesisUtterance(currentWord.word);
    utterance.lang = 'en-US';
    utterance.rate = 0.7;
    window.speechSynthesis.speak(utterance);
  };

  const checkSpelling = () => {
    if (!currentWord) return;

    const correct = userInput.trim().toLowerCase() === currentWord.word.toLowerCase();
    setFeedback(correct ? 'correct' : 'wrong');
    setShowAnswer(true);

    if (correct) {
      setScore(score + 1);
    }
  };

  const nextWord = () => {
    if (round >= totalRounds) {
      setGameOver(true);
      return;
    }

    setCurrentWord(words[round]);
    setRound(round + 1);
    setUserInput('');
    setFeedback(null);
    setShowAnswer(false);
  };

  const resetGame = () => {
    setScore(0);
    setRound(1);
    setUserInput('');
    setFeedback(null);
    setShowAnswer(false);
    setGameOver(false);
    setCurrentWord(words[0]);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading words...</p>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="glass-card-light p-8 text-center space-y-6">
        <Trophy className="w-20 h-20 text-yellow-400 mx-auto" />
        <h2 className="text-3xl font-black gradient-text">Spelling Bee Complete!</h2>
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl">
            <div className="text-4xl font-black text-blue-600 dark:text-blue-400">{score}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Correct</div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl">
            <div className="text-4xl font-black text-purple-600 dark:text-purple-400">
              {Math.round((score / totalRounds) * 100)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Score</div>
          </div>
        </div>
        <button onClick={resetGame} className="btn-primary flex items-center gap-2 mx-auto">
          <RotateCcw size={20} />
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-sm font-bold text-gray-600 dark:text-gray-400">
          Round {round} of {totalRounds}
        </div>
        <div className="text-sm font-bold">
          Score: <span className="gradient-text text-lg">{score}</span>
        </div>
      </div>

      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-luxury transition-all duration-300"
          style={{ width: `${(round / totalRounds) * 100}%` }}
        />
      </div>

      <div className="glass-card-light p-8 space-y-6">
        <div className="text-center">
          <p className="text-sm text-purple-600 dark:text-purple-400 font-semibold mb-4">
            Listen carefully and spell the word
          </p>

          <button
            onClick={speakWord}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-luxury text-white font-bold text-lg rounded-2xl hover:scale-105 transition-all shadow-xl mb-6"
          >
            <Volume2 size={28} />
            Play Word
          </button>

          {currentWord && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              Hint: {currentWord.ipa}
            </p>
          )}

          {showAnswer && currentWord && (
            <div className={`mt-4 p-4 rounded-xl ${
              feedback === 'correct'
                ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-500'
                : 'bg-red-50 dark:bg-red-900/20 border-2 border-red-500'
            }`}>
              <p className="text-lg font-bold mb-2">
                {feedback === 'correct' ? (
                  <span className="text-green-600 dark:text-green-400 flex items-center justify-center gap-2">
                    <Check size={24} /> Correct!
                  </span>
                ) : (
                  <span className="text-red-600 dark:text-red-400 flex items-center justify-center gap-2">
                    <X size={24} /> Incorrect
                  </span>
                )}
              </p>
              <p className="text-2xl font-black gradient-text mb-2">{currentWord.word}</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Meaning: {currentWord.meaning_id}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && userInput && !showAnswer) {
                checkSpelling();
              }
            }}
            placeholder="Type the word here..."
            disabled={showAnswer}
            className="w-full px-6 py-4 text-center text-2xl font-bold rounded-xl border-2 border-purple-300 dark:border-purple-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          {!showAnswer ? (
            <button
              onClick={checkSpelling}
              disabled={!userInput.trim()}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                userInput.trim()
                  ? 'bg-gradient-purple text-white hover:scale-105'
                  : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              Check Spelling
            </button>
          ) : (
            <button
              onClick={nextWord}
              className="w-full py-4 bg-gradient-luxury text-white font-bold text-lg rounded-xl hover:scale-105 transition-all"
            >
              {round < totalRounds ? 'Next Word' : 'Finish Game'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
