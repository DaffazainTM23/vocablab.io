import { useParams } from 'react-router-dom';
import { MultipleChoiceGame } from '../components/games/MultipleChoiceGame';
import { MatchingGame } from '../components/games/MatchingGame';
import { ListeningGame } from '../components/games/ListeningGame';
import { TypingSprintGame } from '../components/games/TypingSprintGame';
import { SpellingBeeGame } from '../components/games/SpellingBeeGame';
import { PronunciationBattleGame } from '../components/games/PronunciationBattleGame';

export function GamePlay() {
  const { gameId } = useParams<{ gameId: string }>();

  return (
    <>
      {gameId === 'multiple-choice' && <MultipleChoiceGame />}
      {gameId === 'matching' && <MatchingGame />}
      {gameId === 'listening' && <ListeningGame />}
      {gameId === 'typing-sprint' && <TypingSprintGame />}
      {gameId === 'spelling-bee' && <SpellingBeeGame />}
      {gameId === 'pronunciation-battle' && <PronunciationBattleGame />}
      {!gameId && <div className="min-h-screen pt-24 pb-16 flex items-center justify-center"><p>Game not found</p></div>}
    </>
  );
}
