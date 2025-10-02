import { useState, useEffect } from 'react';
import { Mic, Volume2, Trophy, RotateCcw, Play } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface PronunciationBattleGameProps {
  topicId?: string;
}

interface Word {
  id: string;
  word: string;
  ipa: string;
  meaning_id: string;
}

export function PronunciationBattleGame({ topicId }: PronunciationBattleGameProps) {
  const [words, setWords] = useState<Word[]>([]);
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [totalRounds] = useState(10);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState<'perfect' | 'good' | 'tryagain' | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [loading, setLoading] = useState(true);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    fetchWords();
    initializeSpeechRecognition();
  }, [topicId]);

  const initializeSpeechRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event: any) => {
        const speechResult = event.results[0][0].transcript;
        setTranscript(speechResult);
        checkPronunciation(speechResult);
        setIsListening(false);
      };

      recognitionInstance.onerror = () => {
        setIsListening(false);
        alert('Speech recognition error. Please try again or check microphone permissions.');
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  };

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
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    if (!recognition) {
      alert('Speech recognition is not supported in your browser. Please use Chrome or Edge.');
      return;
    }

    setTranscript('');
    setIsListening(true);
    setFeedback(null);
    setShowResult(false);

    try {
      recognition.start();
    } catch (error) {
      console.error('Error starting recognition:', error);
      setIsListening(false);
    }
  };

  const checkPronunciation = (spokenText: string) => {
    if (!currentWord) return;

    const spoken = spokenText.toLowerCase().trim();
    const correct = currentWord.word.toLowerCase().trim();

    const similarity = calculateSimilarity(spoken, correct);

    let result: 'perfect' | 'good' | 'tryagain';
    let points = 0;

    if (similarity >= 0.9) {
      result = 'perfect';
      points = 10;
    } else if (similarity >= 0.7) {
      result = 'good';
      points = 7;
    } else {
      result = 'tryagain';
      points = 0;
    }

    setFeedback(result);
    setScore(score + points);
    setShowResult(true);
  };

  const calculateSimilarity = (str1: string, str2: string): number => {
    if (str1 === str2) return 1;

    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) return 1;

    const editDistance = getEditDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  };

  const getEditDistance = (str1: string, str2: string): number => {
    const matrix: number[][] = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  };

  const nextWord = () => {
    if (round >= totalRounds) {
      setGameOver(true);
      return;
    }

    setCurrentWord(words[round]);
    setRound(round + 1);
    setTranscript('');
    setFeedback(null);
    setShowResult(false);
  };

  const resetGame = () => {
    setScore(0);
    setRound(1);
    setTranscript('');
    setFeedback(null);
    setShowResult(false);
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
        <h2 className="text-3xl font-black gradient-text">Pronunciation Battle Complete!</h2>
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl">
            <div className="text-4xl font-black text-blue-600 dark:text-blue-400">{score}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Points</div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl">
            <div className="text-4xl font-black text-purple-600 dark:text-purple-400">
              {Math.round((score / (totalRounds * 10)) * 100)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Accuracy</div>
          </div>
        </div>
        <button onClick={resetGame} className="btn-primary flex items-center gap-2 mx-auto">
          <RotateCcw size={20} />
          Battle Again
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
          Score: <span className="gradient-text text-lg">{score}</span> pts
        </div>
      </div>

      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-luxury transition-all duration-300"
          style={{ width: `${(round / totalRounds) * 100}%` }}
        />
      </div>

      <div className="glass-card-light p-8 space-y-6">
        <div className="text-center space-y-4">
          <p className="text-sm text-purple-600 dark:text-purple-400 font-semibold">
            Listen and pronounce the word correctly
          </p>

          {currentWord && (
            <>
              <button
                onClick={speakWord}
                className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-blue text-white font-bold rounded-xl hover:scale-105 transition-all"
              >
                <Volume2 size={24} />
                Listen to Word
              </button>

              <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl border-2 border-purple-300 dark:border-purple-700">
                <p className="text-4xl font-black gradient-text mb-2">{currentWord.word}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{currentWord.ipa}</p>
                <p className="text-gray-700 dark:text-gray-300">{currentWord.meaning_id}</p>
              </div>
            </>
          )}

          <button
            onClick={startListening}
            disabled={isListening || showResult}
            className={`inline-flex items-center gap-3 px-8 py-4 font-bold text-lg rounded-2xl transition-all ${
              isListening
                ? 'bg-red-500 text-white animate-pulse'
                : showResult
                ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-luxury text-white hover:scale-105 shadow-xl'
            }`}
          >
            <Mic size={28} />
            {isListening ? 'Listening...' : 'Start Pronunciation'}
          </button>

          {transcript && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
              <p className="text-sm text-gray-600 dark:text-gray-400">You said:</p>
              <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{transcript}</p>
            </div>
          )}

          {showResult && feedback && (
            <div className={`p-6 rounded-xl border-2 ${
              feedback === 'perfect'
                ? 'bg-green-50 dark:bg-green-900/20 border-green-500'
                : feedback === 'good'
                ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500'
                : 'bg-red-50 dark:bg-red-900/20 border-red-500'
            }`}>
              <p className="text-2xl font-black mb-2">
                {feedback === 'perfect' && <span className="text-green-600 dark:text-green-400">🎉 Perfect! +10 pts</span>}
                {feedback === 'good' && <span className="text-yellow-600 dark:text-yellow-400">👍 Good! +7 pts</span>}
                {feedback === 'tryagain' && <span className="text-red-600 dark:text-red-400">❌ Try Again +0 pts</span>}
              </p>
              <button
                onClick={nextWord}
                className="mt-4 px-6 py-3 bg-gradient-luxury text-white font-bold rounded-xl hover:scale-105 transition-all flex items-center gap-2 mx-auto"
              >
                <Play size={20} />
                {round < totalRounds ? 'Next Word' : 'Finish Battle'}
              </button>
            </div>
          )}
        </div>

        {!recognition && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl border-2 border-yellow-500">
            <p className="text-sm text-yellow-800 dark:text-yellow-300">
              ⚠️ Speech recognition requires Chrome or Edge browser with microphone permissions.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
