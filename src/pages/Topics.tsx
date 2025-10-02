import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';
import { topicsData } from '../data/topics';

export function Topics() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTopics = topicsData.filter(topic =>
    topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Grade 7 <span className="gradient-text">Vocabulary Topics</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Pilih topik dan mulai belajar kosakata bahasa Inggris dengan audio pronunciation, contoh kalimat, dan latihan interaktif
          </p>

          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTopics.map((topic) => (
            <Link
              key={topic.slug}
              to={`/topics/${topic.slug}`}
              className="topic-card group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${topic.color}`}>
                  <topic.icon className="text-white" size={32} />
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                  {topic.wordCount} words
                </span>
              </div>

              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white group-hover:gradient-text transition-all">
                {topic.name}
              </h3>

              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 leading-relaxed">
                {topic.description}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Start Learning
                </span>
                <ArrowRight className="text-primary-500 group-hover:translate-x-1 transition-transform" size={20} />
              </div>
            </Link>
          ))}
        </div>

        {filteredTopics.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No topics found matching "{searchQuery}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
