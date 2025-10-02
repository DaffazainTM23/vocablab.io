import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, Check, X, RotateCcw, Trophy } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { topicsData } from '../../data/topics';
import { Vocabulary } from '../../types/database';
import { shuffleArray, getUserId } from '../../lib/utils';

export function MultipleChoiceGame() {
  const [searchParams] = useSearchParams();
  const topicSlug = searchParams.get('topic');

  const [vocabulary, setVocabulary] = useState<Vocabulary[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [loading, setLoading] = useState(true);

  const topic = topicsData.find(t => t.slug === topicSlug);

  useEffect(() => {
    loadVocabulary();
  }, [topicSlug]);

  async function loadVocabulary() {
    try {
      let query = supabase.from('vocabulary').select('*');

      if (topicSlug) {
        const { data: topicData } = await supabase
          .from('topics')
          .select('id')
          .eq('slug', topicSlug)
          .maybeSingle();

        if (topicData) {
          query = query.eq('topic_id', topicData.id);
        }
      }

      const { data, error } = await query;
      if (error) throw error;

      if (data && data.length > 0) {
        setVocabulary(data);
        generateQuestions(data);
      }
    } catch (error) {
      console.error('Error loading vocabulary:', error);
    } finally {
      setLoading(false);
    }
  }

  function generateQuestions(vocabList: Vocabulary[]) {
    const shuffled = shuffleArray(vocabList).slice(0, 10);
    const quizQuestions = shuffled.map(word => {
      const wrongAnswers = vocabList
        .filter(w => w.id !== word.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(w => w.meaning_id);

      const allOptions = shuffleArray([word.meaning_id, ...wrongAnswers]);

      return {
        word: word.word,
        correctAnswer: allOptions.indexOf(word.meaning_id),
        options: allOptions,
        example: word.example_en
      };
    });

    setQuestions(quizQuestions);
  }

  const handleAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answerIndex);
    const isCorrect = answerIndex === questions[currentQuestion].correctAnswer;

    if (isCorrect) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        setIsFinished(true);
        saveResult();
      }
    }, 1500);
  };

  async function saveResult() {
    try {
      const userId = getUserId();
      const accuracy = (score / questions.length) * 100;

      const { data: topicData } = await supabase
        .from('topics')
        .select('id')
        .eq('slug', topicSlug)
        .maybeSingle();

      await supabase.from('quiz_results').insert({
        user_id: userId,
        topic_id: topicData?.id || null,
        game_type: 'multiple_choice',
        score,
        total_questions: questions.length,
        accuracy,
        time_taken_seconds: 0
      });
    } catch (error) {
      console.error('Error saving result:', error);
    }
  }

  const resetGame = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setIsFinished(false);
    if (vocabulary.length > 0) {
      generateQuestions(vocabulary);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading game...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/games" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-500 mb-6">
            <ArrowLeft size={20} />
            Back to Games
          </Link>
          <div className="glass-card-light p-12 text-center">
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
              No vocabulary available for this game.
            </p>
            <Link to="/topics" className="btn-primary inline-block">
              Browse Topics
            </Link>
          </div>
        </div>
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
              <span className="gradient-text">Multiple Choice Quiz</span>
            </h1>
            {topic && (
              <p className="text-gray-600 dark:text-gray-400">
                {topic.name}
              </p>
            )}
          </div>

          {!isFinished ? (
            <div className="glass-card-light p-8">
              <div className="flex justify-between items-center mb-6">
                <span className="text-sm font-semibold text-primary-500">
                  Question {currentQuestion + 1} of {questions.length}
                </span>
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                  Score: {score}
                </span>
              </div>

              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                  {questions[currentQuestion].word}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                  "{questions[currentQuestion].example}"
                </p>
              </div>

              <div className="space-y-3">
                {questions[currentQuestion].options.map((option: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={selectedAnswer !== null}
                    className={`w-full text-left p-4 rounded-xl font-medium transition-all ${
                      selectedAnswer === null
                        ? 'bg-gray-100 dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 text-gray-900 dark:text-white border-2 border-transparent'
                        : selectedAnswer === index
                        ? index === questions[currentQuestion].correctAnswer
                          ? 'bg-secondary-100 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-300 border-2 border-secondary-500'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-2 border-red-500'
                        : index === questions[currentQuestion].correctAnswer
                        ? 'bg-secondary-100 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-300 border-2 border-secondary-500'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white opacity-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option}</span>
                      {selectedAnswer !== null && (
                        <>
                          {index === questions[currentQuestion].correctAnswer && (
                            <Check className="text-secondary-500" size={20} />
                          )}
                          {selectedAnswer === index &&
                            index !== questions[currentQuestion].correctAnswer && (
                              <X className="text-red-500" size={20} />
                            )}
                        </>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="glass-card-light p-8 text-center">
              <Trophy className="w-20 h-20 mx-auto mb-4 text-primary-500" />
              <h3 className="text-3xl font-bold mb-4 gradient-text">
                Quiz Complete!
              </h3>
              <div className="mb-6">
                <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
                  {score}/{questions.length}
                </div>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Accuracy: {Math.round((score / questions.length) * 100)}%
                </p>
              </div>

              <div className="flex gap-4 justify-center">
                <button onClick={resetGame} className="btn-primary inline-flex items-center gap-2">
                  <RotateCcw size={20} />
                  Play Again
                </button>
                <Link to="/games" className="btn-secondary inline-flex items-center gap-2">
                  Choose Another Game
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
