import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Volume2, Search, Table, Grid3x3, Play, Trophy } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { topicsData } from '../data/topics';
import { Vocabulary } from '../types/database';
import { speakText } from '../lib/utils';

export function TopicDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [vocabulary, setVocabulary] = useState<Vocabulary[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards');
  const [searchQuery, setSearchQuery] = useState('');
  const [audioAccent, setAudioAccent] = useState<'uk' | 'us'>('us');

  const topic = topicsData.find(t => t.slug === slug);

  useEffect(() => {
    if (!topic) {
      navigate('/topics');
      return;
    }

    loadVocabulary();
  }, [slug]);

  async function loadVocabulary() {
    try {
      const { data: topicData } = await supabase
        .from('topics')
        .select('id')
        .eq('slug', slug)
        .maybeSingle();

      if (!topicData) {
        setVocabulary([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('vocabulary')
        .select('*')
        .eq('topic_id', topicData.id)
        .order('word');

      if (error) throw error;

      setVocabulary(data || []);
    } catch (error) {
      console.error('Error loading vocabulary:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredVocabulary = vocabulary.filter(word =>
    word.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
    word.meaning_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const playAudio = (word: string) => {
    speakText(word, audioAccent === 'uk' ? 'en-GB' : 'en-US');
  };

  const downloadPDF = () => {
    alert('PDF download feature will be implemented soon!');
  };

  if (!topic) return null;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/topics"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-500 mb-6"
        >
          <ArrowLeft size={20} />
          Back to Topics
        </Link>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-2xl bg-gradient-to-br ${topic.color}`}>
              <topic.icon className="text-white" size={40} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                {topic.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {topic.description}
              </p>
            </div>
          </div>

          <button
            onClick={downloadPDF}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Download size={20} />
            Download PDF
          </button>
        </div>

        <div className="glass-card-light p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search vocabulary..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                <button
                  onClick={() => setAudioAccent('uk')}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    audioAccent === 'uk'
                      ? 'bg-white dark:bg-gray-700 text-primary-500 shadow'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  UK
                </button>
                <button
                  onClick={() => setAudioAccent('us')}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    audioAccent === 'us'
                      ? 'bg-white dark:bg-gray-700 text-primary-500 shadow'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  US
                </button>
              </div>

              <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                <button
                  onClick={() => setViewMode('cards')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'cards'
                      ? 'bg-white dark:bg-gray-700 text-primary-500 shadow'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <Grid3x3 size={18} />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'table'
                      ? 'bg-white dark:bg-gray-700 text-primary-500 shadow'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <Table size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading vocabulary...</p>
          </div>
        ) : filteredVocabulary.length > 0 ? (
          <>
            {viewMode === 'cards' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
                {filteredVocabulary.map((word) => (
                  <div key={word.id} className="glass-card-light p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          {word.word}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                          {word.ipa || `/${word.word.toLowerCase()}/`}
                        </p>
                      </div>
                      <button
                        onClick={() => playAudio(word.word)}
                        className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 hover:scale-110 transition-transform"
                      >
                        <Volume2 size={20} />
                      </button>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                          Meaning
                        </span>
                        <p className="text-gray-700 dark:text-gray-300">
                          {word.meaning_id}
                        </p>
                      </div>

                      {word.example_en && (
                        <div>
                          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                            Example
                          </span>
                          <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                            "{word.example_en}"
                          </p>
                        </div>
                      )}

                      <div className="flex items-center gap-2 pt-2">
                        <span className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                          {word.part_of_speech}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-card-light overflow-x-auto mb-12">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Word</th>
                      <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">IPA</th>
                      <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Meaning</th>
                      <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Example</th>
                      <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Type</th>
                      <th className="text-center p-4 font-semibold text-gray-900 dark:text-white">Audio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVocabulary.map((word) => (
                      <tr key={word.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="p-4 font-semibold text-gray-900 dark:text-white">{word.word}</td>
                        <td className="p-4 text-sm font-mono text-gray-600 dark:text-gray-400">
                          {word.ipa || `/${word.word.toLowerCase()}/`}
                        </td>
                        <td className="p-4 text-gray-700 dark:text-gray-300">{word.meaning_id}</td>
                        <td className="p-4 text-sm text-gray-600 dark:text-gray-400 italic max-w-xs truncate">
                          {word.example_en}
                        </td>
                        <td className="p-4">
                          <span className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                            {word.part_of_speech}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => playAudio(word.word)}
                            className="inline-flex items-center justify-center p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 hover:scale-110 transition-transform"
                          >
                            <Volume2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="glass-card-light p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                <Trophy className="text-yellow-500" />
                Practice Exercises
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link
                  to={`/games/multiple-choice?topic=${slug}`}
                  className="p-6 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 text-white hover:scale-105 transition-transform"
                >
                  <h3 className="font-bold text-lg mb-2">Multiple Choice</h3>
                  <p className="text-sm text-white/90">Test your vocabulary knowledge</p>
                </Link>

                <Link
                  to={`/games/matching?topic=${slug}`}
                  className="p-6 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white hover:scale-105 transition-transform"
                >
                  <h3 className="font-bold text-lg mb-2">Matching</h3>
                  <p className="text-sm text-white/90">Match words with meanings</p>
                </Link>

                <Link
                  to={`/games/listening?topic=${slug}`}
                  className="p-6 rounded-xl bg-gradient-to-br from-pink-500 to-red-500 text-white hover:scale-105 transition-transform"
                >
                  <h3 className="font-bold text-lg mb-2">Listening Challenge</h3>
                  <p className="text-sm text-white/90">Listen and type the word</p>
                </Link>

                <Link
                  to={`/games/typing-sprint?topic=${slug}`}
                  className="p-6 rounded-xl bg-gradient-to-br from-orange-500 to-yellow-500 text-white hover:scale-105 transition-transform"
                >
                  <h3 className="font-bold text-lg mb-2">Typing Sprint</h3>
                  <p className="text-sm text-white/90">60-second typing challenge</p>
                </Link>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12 glass-card-light">
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
              No vocabulary words found for this topic yet.
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Content will be added soon!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
