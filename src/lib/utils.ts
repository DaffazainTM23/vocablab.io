export function getUserId(): string {
  let userId = localStorage.getItem('vocablab_user_id');

  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    localStorage.setItem('vocablab_user_id', userId);
  }

  return userId;
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function calculateStreak(lastPracticeDate: string | null): number {
  if (!lastPracticeDate) return 0;

  const last = new Date(lastPracticeDate);
  const today = new Date();
  const diffTime = today.getTime() - last.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays > 1) return 0;

  return parseInt(localStorage.getItem('vocablab_streak') || '0');
}

export function updateStreak(lastPracticeDate: string | null): number {
  const today = new Date().toISOString().split('T')[0];
  const currentStreak = calculateStreak(lastPracticeDate);

  if (lastPracticeDate === today) {
    return currentStreak;
  }

  const newStreak = lastPracticeDate &&
    new Date(lastPracticeDate).toISOString().split('T')[0] ===
    new Date(Date.now() - 86400000).toISOString().split('T')[0]
    ? currentStreak + 1
    : 1;

  localStorage.setItem('vocablab_streak', newStreak.toString());
  return newStreak;
}

export function cn(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function speakText(text: string, lang: string = 'en-US', rate: number = 1): void {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = rate;
    window.speechSynthesis.speak(utterance);
  }
}

export function stopSpeaking(): void {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
