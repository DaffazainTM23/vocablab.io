import { Link } from 'react-router-dom';
import { Brain, Zap, Ear, Keyboard, Mic, Shuffle } from 'lucide-react';

const games = [
  {
    id: 'multiple-choice',
    name: 'Multiple Choice Quiz',
    icon: Brain,
    description: 'Test your vocabulary with multiple choice questions',
    color: 'from-blue-500 to-purple-500',
    difficulty: 'Easy'
  },
  {
    id: 'matching',
    name: 'Word Match Arena',
    icon: Shuffle,
    description: 'Match words with their Indonesian meanings',
    color: 'from-purple-500 to-pink-500',
    difficulty: 'Medium'
  },
  {
    id: 'listening',
    name: 'Listening Challenge',
    icon: Ear,
    description: 'Listen to audio and type the correct word',
    color: 'from-pink-500 to-red-500',
    difficulty: 'Hard'
  },
  {
    id: 'typing-sprint',
    name: 'Typing Sprint',
    icon: Keyboard,
    description: 'Type as many correct translations in 60 seconds',
    color: 'from-orange-500 to-yellow-500',
    difficulty: 'Medium'
  },
  {
    id: 'spelling-bee',
    name: 'Spelling Bee',
    icon: Zap,
    description: 'Listen and spell the word correctly',
    color: 'from-green-500 to-teal-500',
    difficulty: 'Hard'
  },
  {
    id: 'pronunciation-battle',
    name: 'Pronunciation Battle',
    icon: Mic,
    description: 'Record your pronunciation and get scored',
    color: 'from-indigo-500 to-blue-500',
    difficulty: 'Expert'
  }
];

export function Games() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Interactive <span className="gradient-text">Games</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Belajar sambil bermain dengan berbagai game interaktif yang seru dan menantang
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <div
              key={game.id}
              className="topic-card group shimmer-glass pulse-glow relative overflow-hidden"
            >
              <div className={`absolute top-0 right-0 px-3 py-1 rounded-bl-xl bg-gradient-to-br ${game.color} text-white text-xs font-semibold`}>
                {game.difficulty}
              </div>

              <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${game.color} mb-4 mt-2`}>
                <game.icon className="text-white" size={32} />
              </div>

              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                {game.name}
              </h3>

              <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 leading-relaxed">
                {game.description}
              </p>

              <Link
                to={`/games/${game.id}`}
                className="btn-primary w-full text-center"
              >
                Play Now
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-16 glass-card-light p-8 text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            Coming Soon: Leaderboard
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Compete with other learners and see your ranking on the global leaderboard!
          </p>
          <div className="inline-flex items-center gap-2 text-primary-500 font-semibold">
            <span className="inline-block w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
            Under Development
          </div>
        </div>
      </div>
    </div>
  );
}
