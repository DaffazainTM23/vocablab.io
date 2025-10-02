import { useState } from 'react';
import { Check, X, RotateCcw } from 'lucide-react';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

const quizQuestions: QuizQuestion[] = [
  {
    question: 'What is the Indonesian meaning of "Mother"?',
    options: ['Ayah', 'Ibu', 'Kakek', 'Nenek'],
    correctAnswer: 1
  },
  {
    question: 'Which word means "Buku" in English?',
    options: ['Pen', 'Book', 'Desk', 'Chair'],
    correctAnswer: 1
  },
  {
    question: 'What is "Merah" in English?',
    options: ['Blue', 'Green', 'Red', 'Yellow'],
    correctAnswer: 2
  },
  {
    question: 'The English word for "Kucing" is:',
    options: ['Dog', 'Cat', 'Bird', 'Fish'],
    correctAnswer: 1
  },
  {
    question: 'What does "Breakfast" mean?',
    options: ['Makan Malam', 'Sarapan', 'Makan Siang', 'Snack'],
    correctAnswer: 1
  }
];

export function QuickQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);

  const handleAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answerIndex);
    const isCorrect = answerIndex === quizQuestions[currentQuestion].correctAnswer;
    setAnswers([...answers, isCorrect]);

    if (isCorrect) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        setIsFinished(true);
      }
    }, 1500);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setIsFinished(false);
    setAnswers([]);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Test <span className="gradient-text">Cepat</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Uji pengetahuan kosakatamu dengan 5 soal pilihan ganda
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {!isFinished ? (
            <div className="glass-card-light p-8">
              <div className="flex justify-between items-center mb-6">
                <span className="text-sm font-semibold text-primary-500">
                  Question {currentQuestion + 1} of {quizQuestions.length}
                </span>
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                  Score: {score}
                </span>
              </div>

              <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
                {quizQuestions[currentQuestion].question}
              </h3>

              <div className="space-y-3">
                {quizQuestions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={selectedAnswer !== null}
                    className={`w-full text-left p-4 rounded-xl font-medium transition-all ${
                      selectedAnswer === null
                        ? 'bg-gray-100 dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 text-gray-900 dark:text-white'
                        : selectedAnswer === index
                        ? index === quizQuestions[currentQuestion].correctAnswer
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-2 border-green-500'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-2 border-red-500'
                        : index === quizQuestions[currentQuestion].correctAnswer
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-2 border-green-500'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white opacity-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option}</span>
                      {selectedAnswer !== null && (
                        <>
                          {index === quizQuestions[currentQuestion].correctAnswer && (
                            <Check className="text-green-500" size={20} />
                          )}
                          {selectedAnswer === index &&
                            index !== quizQuestions[currentQuestion].correctAnswer && (
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
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-primary mb-4">
                  <span className="text-3xl font-bold text-white">{score}</span>
                </div>
                <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                  Quiz Completed!
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  You scored {score} out of {quizQuestions.length}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                  Accuracy: {Math.round((score / quizQuestions.length) * 100)}%
                </p>
              </div>

              <button
                onClick={resetQuiz}
                className="btn-primary inline-flex items-center gap-2"
              >
                <RotateCcw size={20} />
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
