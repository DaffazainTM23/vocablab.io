import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, Trophy, RotateCcw } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { topicsData } from '../../data/topics';
import { Vocabulary } from '../../types/database';
import { shuffleArray, getUserId } from '../../lib/utils';

interface MatchPair {
  id: string;
  word: string;
  meaning: string;
  matched: boolean;
}

export function MatchingGame() {
  const [searchParams] = useSearchParams();
  const topicSlug = searchParams.get('topic');
  const [pairs, setPairs] = useState<MatchPair[]>([]);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [selectedMeaning, setSelectedMeaning] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState(0);

  const topic = topicsData.find(t => t.slug === topicSlug);

  useEffect(() => {
    loadVocabulary();
  }, [topicSlug]);

  useEffect(() => {
    if (!isFinished && pairs.length > 0) {
      const interval = setInterval(() => setTimer(t => t + 1), 1000);
      return () => clearInterval(interval);
    }
  }, [isFinished, pairs]);

  async function loadVocabulary() {
    try {
      let query = supabase.from('vocabulary').select('*');

      if (topicSlug) {
        const { data: topicData } = await supabase
          .from('topics')
          .select('id')
          .eq('slug', topicSlug)
          .maybeSingle();
        if (topicData) query = query.eq('topic_id', topicData.id);
      }

      const { data } = await query;
      if (data && data.length > 0) {
        const selected = shuffleArray(data).slice(0, 8);
        const matchPairs: MatchPair[] = selected.map(v => ({
          id: v.id,
          word: v.word,
          meaning: v.meaning_id,
          matched: false
        }));
        setPairs(matchPairs);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleWordClick = (id: string) => {
    if (pairs.find(p => p.id === id)?.matched) return;
    setSelectedWord(id);
    if (selectedMeaning) checkMatch(id, selectedMeaning);
  };

  const handleMeaningClick = (id: string) => {
    if (pairs.find(p => p.id === id)?.matched) return;
    setSelectedMeaning(id);
    if (selectedWord) checkMatch(selectedWord, id);
  };

  const checkMatch = (wordId: string, meaningId: string) => {
    if (wordId === meaningId) {
      setPairs(pairs.map(p => p.id === wordId ? { ...p, matched: true } : p));
      setScore(score + 1);
      setSelectedWord(null);
      setSelectedMeaning(null);

      if (pairs.filter(p => !p.matched).length === 1) {
        setIsFinished(true);
        saveResult();
      }
    } else {
      setMistakes(mistakes + 1);
      setTimeout(() => {
        setSelectedWord(null);
        setSelectedMeaning(null);
      }, 500);
    }
  };

  async function saveResult() {
    try {
      const userId = getUserId();
      const accuracy = (score / (score + mistakes)) * 100;
      const { data: topicData } = await supabase.from('topics').select('id').eq('slug', topicSlug).maybeSingle();
      await supabase.from('quiz_results').insert({
        user_id: userId,
        topic_id: topicData?.id || null,
        game_type: 'matching',
        score,
        total_questions: pairs.length,
        accuracy,
        time_taken_seconds: timer
      });
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const resetGame = () => {
    setSelectedWord(null);
    setSelectedMeaning(null);
    setScore(0);
    setMistakes(0);
    setIsFinished(false);
    setTimer(0);
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

        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              <span className="gradient-text">Word Match Arena</span>
            </h1>
            {topic && <p className="text-gray-600 dark:text-gray-400">{topic.name}</p>}
          </div>

          {!isFinished ? (
            <>
              <div className="flex justify-between mb-6 glass-card-light p-4">
                <span className="font-semibold text-primary-500">Matches: {score}/8</span>
                <span className="font-semibold text-gray-600 dark:text-gray-400">Time: {timer}s</span>
                <span className="font-semibold text-red-500">Mistakes: {mistakes}</span>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-bold text-lg mb-4">English Words</h3>
                  {shuffleArray([...pairs]).map(pair => (
                    <button
                      key={`word-${pair.id}`}
                      onClick={() => handleWordClick(pair.id)}
                      disabled={pair.matched}
                      className={`w-full p-4 rounded-xl font-semibold transition-all ${
                        pair.matched
                          ? 'bg-secondary-200 dark:bg-secondary-900/50 opacity-50'
                          : selectedWord === pair.id
                          ? 'bg-primary-500 text-white scale-105'
                          : 'bg-white dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-primary-900/20'
                      }`}
                    >
                      {pair.word}
                    </button>
                  ))}
                </div>

                <div className="space-y-3">
                  <h3 className="font-bold text-lg mb-4">Indonesian Meanings</h3>
                  {shuffleArray([...pairs]).map(pair => (
                    <button
                      key={`meaning-${pair.id}`}
                      onClick={() => handleMeaningClick(pair.id)}
                      disabled={pair.matched}
                      className={`w-full p-4 rounded-xl font-semibold transition-all ${
                        pair.matched
                          ? 'bg-secondary-200 dark:bg-secondary-900/50 opacity-50'
                          : selectedMeaning === pair.id
                          ? 'bg-primary-500 text-white scale-105'
                          : 'bg-white dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-primary-900/20'
                      }`}
                    >
                      {pair.meaning}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="glass-card-light p-8 text-center">
              <Trophy className="w-20 h-20 mx-auto mb-4 text-primary-500" />
              <h3 className="text-3xl font-bold mb-4 gradient-text">Perfect Match!</h3>
              <div className="space-y-2 mb-6">
                <p className="text-lg">Time: {timer} seconds</p>
                <p className="text-lg">Mistakes: {mistakes}</p>
                <p className="text-lg">Accuracy: {Math.round((score / (score + mistakes)) * 100)}%</p>
              </div>
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
