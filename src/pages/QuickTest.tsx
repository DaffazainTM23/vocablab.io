import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, RefreshCw, Trophy, Clock, Target, ArrowRight, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { topicsData } from '../data/topics';

interface Question {
  id: string;
  question: string;
  correctAnswer: string;
  options: string[];
  word: string;
}

export function QuickTest() {
  const [stage, setStage] = useState<'setup' | 'playing' | 'results'>('setup');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [questionCount, setQuestionCount] = useState<5 | 10 | 15>(10);
  const [questionType, setQuestionType] = useState<'en-id' | 'id-en'>('en-id');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<{ question: string; userAnswer: string; correctAnswer: string; isCorrect: boolean }[]>([]);
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(0);

  const startTest = async () => {
    try {
      let query = supabase.from('vocabulary').select('*');

      if (selectedTopic !== 'all') {
        const { data: topicData } = await supabase
          .from('topics')
          .select('id')
          .eq('slug', selectedTopic)
          .single();

        if (topicData) {
          query = query.eq('topic_id', topicData.id);
        }
      }

      const { data: vocabulary } = await query;

      if (!vocabulary || vocabulary.length < questionCount) {
        alert('Not enough vocabulary words for this topic. Please try another topic or reduce question count.');
        return;
      }

      const shuffled = [...vocabulary].sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, questionCount);

      const generatedQuestions: Question[] = selected.map((vocab) => {
        const correctAnswer = questionType === 'en-id' ? vocab.meaning_id : vocab.word;
        const question = questionType === 'en-id' ? vocab.word : vocab.meaning_id;

        const wrongOptions = shuffled
          .filter(v => v.id !== vocab.id)
          .map(v => questionType === 'en-id' ? v.meaning_id : v.word)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);

        const allOptions = [correctAnswer, ...wrongOptions].sort(() => Math.random() - 0.5);

        return {
          id: vocab.id,
          question,
          correctAnswer,
          options: allOptions,
          word: vocab.word
        };
      });

      setQuestions(generatedQuestions);
      setCurrentQuestionIndex(0);
      setScore(0);
      setAnswers([]);
      setSelectedAnswer(null);
      setStartTime(Date.now());
      setStage('playing');
    } catch (error) {
      console.error('Error starting test:', error);
      alert('Failed to start test. Please try again.');
    }
  };

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const nextQuestion = () => {
    if (!selectedAnswer) return;

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

    if (isCorrect) {
      setScore(score + 1);
    }

    setAnswers([
      ...answers,
      {
        question: currentQuestion.question,
        userAnswer: selectedAnswer,
        correctAnswer: currentQuestion.correctAnswer,
        isCorrect
      }
    ]);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      setEndTime(Date.now());
      setStage('results');
    }
  };

  const resetTest = () => {
    setStage('setup');
    setCurrentQuestionIndex(0);
    setScore(0);
    setAnswers([]);
    setSelectedAnswer(null);
  };

  const currentQuestion = questions[currentQuestionIndex];
  const timeSpent = endTime && startTime ? Math.floor((endTime - startTime) / 1000) : 0;
  const percentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {stage === 'setup' && (
          <div className="space-y-8">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-6 py-2 bg-white/10 backdrop-blur-md rounded-full border border-purple-300 dark:border-purple-700 mb-6">
                <Trophy className="text-yellow-400" size={24} />
                <h1 className="text-2xl font-black gradient-text">QUICK VOCABULARY TEST</h1>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Test your vocabulary knowledge with randomized questions
              </p>
            </div>

            <div className="glass-card-light p-8 space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                  Select Topic
                </label>
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-purple-300 dark:border-purple-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-semibold"
                >
                  <option value="all">All Topics (Mixed)</option>
                  {topicsData.map((topic) => (
                    <option key={topic.slug} value={topic.slug}>
                      {topic.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                  Number of Questions
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[5, 10, 15].map((count) => (
                    <button
                      key={count}
                      onClick={() => setQuestionCount(count as 5 | 10 | 15)}
                      className={`py-3 rounded-xl font-bold text-lg transition-all ${
                        questionCount === count
                          ? 'bg-gradient-luxury text-white scale-105 shadow-xl'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-purple-300 dark:border-purple-700 hover:scale-105'
                      }`}
                    >
                      {count} Questions
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                  Question Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setQuestionType('en-id')}
                    className={`py-3 rounded-xl font-bold transition-all ${
                      questionType === 'en-id'
                        ? 'bg-gradient-purple text-white scale-105 shadow-xl'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-purple-300 dark:border-purple-700 hover:scale-105'
                    }`}
                  >
                    English → Indonesian
                  </button>
                  <button
                    onClick={() => setQuestionType('id-en')}
                    className={`py-3 rounded-xl font-bold transition-all ${
                      questionType === 'id-en'
                        ? 'bg-gradient-purple text-white scale-105 shadow-xl'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-purple-300 dark:border-purple-700 hover:scale-105'
                    }`}
                  >
                    Indonesian → English
                  </button>
                </div>
              </div>

              <button
                onClick={startTest}
                className="w-full btn-primary text-xl py-4 flex items-center justify-center gap-3"
              >
                <Play size={24} />
                Start Test
              </button>
            </div>
          </div>
        )}

        {stage === 'playing' && currentQuestion && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Link
                to="/"
                className="text-purple-600 dark:text-purple-400 hover:underline font-semibold"
              >
                ← Exit Test
              </Link>
              <div className="text-sm font-bold text-gray-600 dark:text-gray-400">
                Question {currentQuestionIndex + 1} of {questions.length}
              </div>
            </div>

            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-luxury transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              />
            </div>

            <div className="glass-card-light p-8">
              <div className="text-center mb-8">
                <p className="text-sm font-semibold text-purple-600 dark:text-purple-400 mb-2">
                  {questionType === 'en-id' ? 'Translate to Indonesian' : 'Translate to English'}
                </p>
                <h2 className="text-4xl md:text-5xl font-black gradient-text">
                  {currentQuestion.question}
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    className={`p-4 rounded-xl text-left font-semibold text-lg transition-all ${
                      selectedAnswer === option
                        ? 'bg-gradient-purple text-white scale-105 shadow-xl'
                        : 'bg-white dark:bg-gray-800 border-2 border-purple-300 dark:border-purple-700 hover:scale-102 hover:border-purple-500'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <button
                onClick={nextQuestion}
                disabled={!selectedAnswer}
                className={`w-full mt-6 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                  selectedAnswer
                    ? 'bg-gradient-luxury text-white hover:scale-105'
                    : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed'
                }`}
              >
                {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Test'}
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        )}

        {stage === 'results' && (
          <div className="space-y-6">
            <div className="glass-card-light p-8 text-center">
              <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-4" />
              <h2 className="text-3xl font-black gradient-text mb-2">Test Complete!</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Here are your results</p>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl">
                  <Target className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                  <div className="text-3xl font-black text-blue-600 dark:text-blue-400">{score}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Correct</div>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl">
                  <Trophy className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                  <div className="text-3xl font-black text-purple-600 dark:text-purple-400">{percentage}%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Score</div>
                </div>

                <div className="bg-pink-50 dark:bg-pink-900/20 p-6 rounded-xl">
                  <Clock className="w-8 h-8 text-pink-600 dark:text-pink-400 mx-auto mb-2" />
                  <div className="text-3xl font-black text-pink-600 dark:text-pink-400">{timeSpent}s</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Time</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={resetTest}
                  className="flex-1 btn-primary flex items-center justify-center gap-2"
                >
                  <RefreshCw size={20} />
                  Try Again
                </button>
                <Link
                  to="/topics"
                  className="flex-1 px-6 py-3 bg-white dark:bg-gray-800 border-2 border-purple-300 dark:border-purple-700 text-gray-900 dark:text-white font-semibold rounded-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
                >
                  <ArrowLeft size={20} />
                  Back to Topics
                </Link>
              </div>
            </div>

            <div className="glass-card-light p-8">
              <h3 className="text-2xl font-black mb-6 gradient-text">Review Answers</h3>
              <div className="space-y-3">
                {answers.map((answer, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border-2 ${
                      answer.isCorrect
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-500'
                        : 'bg-red-50 dark:bg-red-900/20 border-red-500'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 dark:text-white mb-1">
                          Q{index + 1}: {answer.question}
                        </p>
                        <p className="text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Your answer: </span>
                          <span className={answer.isCorrect ? 'text-green-600 dark:text-green-400 font-semibold' : 'text-red-600 dark:text-red-400 font-semibold'}>
                            {answer.userAnswer}
                          </span>
                        </p>
                        {!answer.isCorrect && (
                          <p className="text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Correct answer: </span>
                            <span className="text-green-600 dark:text-green-400 font-semibold">
                              {answer.correctAnswer}
                            </span>
                          </p>
                        )}
                      </div>
                      <div className={`text-2xl ${answer.isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                        {answer.isCorrect ? '✓' : '✗'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
