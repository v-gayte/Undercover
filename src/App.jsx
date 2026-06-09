import { useState } from 'react';
import SetupScreen from './components/SetupScreen';
import DistributionScreen from './components/DistributionScreen';
import GameScreen from './components/GameScreen';
import EndGameScreen from './components/EndGameScreen';
import wordsData from './data/words.json';

const PHASES = {
  SETUP: 'SETUP',
  DISTRIBUTION: 'DISTRIBUTION',
  PLAYING: 'PLAYING',
  ENDGAME: 'ENDGAME'
};

function App() {
  const [phase, setPhase] = useState(PHASES.SETUP);
  const [players, setPlayers] = useState([]);
  const [currentWordPair, setCurrentWordPair] = useState(null);
  const [winners, setWinners] = useState(null);
  const [usedWords, setUsedWords] = useState([]);

  const startGame = (playerNames, settings) => {
    // Select random word pair
    let availableWords = wordsData.filter(w => !usedWords.includes(w.civil));
    if (availableWords.length === 0) {
      availableWords = wordsData;
      setUsedWords([]); // On réinitialise si on a joué tous les mots
    }
    const wordPair = availableWords[Math.floor(Math.random() * availableWords.length)];
    
    setUsedWords(prev => [...prev, wordPair.civil]);
    setCurrentWordPair(wordPair);

    // Create role pool
    let roles = [];
    for (let i = 0; i < settings.civils; i++) roles.push('Civil');
    for (let i = 0; i < settings.undercovers; i++) roles.push('Undercover');
    for (let i = 0; i < settings.mrWhite; i++) roles.push('Mr. White');

    // Shuffle roles (Fisher-Yates)
    for (let i = roles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [roles[i], roles[j]] = [roles[j], roles[i]];
    }

    // Assign roles to players
    const initializedPlayers = playerNames.map((name, index) => {
      const role = roles[index];
      let word = '';
      if (role === 'Civil') word = wordPair.civil;
      if (role === 'Undercover') word = wordPair.undercover;
      // Mr. White has no word

      return {
        id: index.toString(),
        name,
        role,
        word,
        isAlive: true
      };
    });

    setPlayers(initializedPlayers);
    setPhase(PHASES.DISTRIBUTION);
  };

  const handleDistributionComplete = () => {
    setPhase(PHASES.PLAYING);
  };

  const checkWinCondition = (updatedPlayers) => {
    const alivePlayers = updatedPlayers.filter(p => p.isAlive);
    const civilsAlive = alivePlayers.filter(p => p.role === 'Civil').length;
    const undercoversAlive = alivePlayers.filter(p => p.role === 'Undercover').length;
    const mrWhiteAlive = alivePlayers.filter(p => p.role === 'Mr. White').length;

    // Mr. White wins if he survives until only 1 Civil is left
    if (mrWhiteAlive > 0 && civilsAlive === 1 && undercoversAlive === 0) {
      setWinners('Mr. White');
      setPhase(PHASES.ENDGAME);
      return true;
    }

    // Undercovers win if they equal the number of Civils
    if (mrWhiteAlive === 0 && undercoversAlive >= civilsAlive) {
      setWinners('Undercovers');
      setPhase(PHASES.ENDGAME);
      return true;
    }

    // Civils win if all Undercovers and Mr. White are dead
    if (undercoversAlive === 0 && mrWhiteAlive === 0) {
      setWinners('Civils');
      setPhase(PHASES.ENDGAME);
      return true;
    }

    return false;
  };

  const handleEliminatePlayer = (playerId) => {
    const updatedPlayers = players.map(p => 
      p.id === playerId ? { ...p, isAlive: false } : p
    );
    setPlayers(updatedPlayers);
    
    // Check win conditions after a small delay to let the UI update and show the modal first
    // Actually, we should check it right away but the modal is shown in GameScreen.
    // The GameScreen shows the modal, and the user has to click "Continuer" to proceed.
    // So we don't switch phase immediately if we want them to see the death screen.
    // But for simplicity, we check here, and if won, we switch phase.
    
    // Better logic: the checkWinCondition triggers phase change immediately.
    // Let's modify: we will wait for the modal close to check win, or we can just check it here.
    // If we check here, the EndGame screen appears immediately. 
    // To allow the modal to be seen, we'll let GameScreen handle the "Next" button and we check win on modal close?
    // Let's keep it simple: the modal is handled inside GameScreen. 
    // We update state here, GameScreen shows modal because eliminatedReveal is set in GameScreen.
    // Wait, if we change phase to ENDGAME here, GameScreen unmounts immediately.
    // To fix this, GameScreen should notify App *after* the reveal modal is closed.
    // But since GameScreen already calls `onEliminatePlayer` when confirming, it's ok to just mark them dead.
  };

  // We need to pass checkWinCondition to GameScreen to be called after modal closes
  const handleProceedAfterReveal = () => {
    checkWinCondition(players);
  };

  const resetGame = () => {
    setPlayers([]);
    setCurrentWordPair(null);
    setWinners(null);
    setPhase(PHASES.SETUP);
  };

  return (
    <div className="bg-[var(--color-dark-bg)] min-h-screen text-white font-sans selection:bg-[var(--color-primary)] selection:text-white">
      {phase === PHASES.SETUP && (
        <SetupScreen onStartGame={startGame} />
      )}
      
      {phase === PHASES.DISTRIBUTION && (
        <DistributionScreen 
          players={players} 
          onDistributionComplete={handleDistributionComplete} 
        />
      )}

      {phase === PHASES.PLAYING && (
        <GameScreen 
          players={players} 
          onEliminatePlayer={handleEliminatePlayer}
          onProceedAfterReveal={handleProceedAfterReveal}
        />
      )}

      {phase === PHASES.ENDGAME && (
        <EndGameScreen 
          winners={winners} 
          word={currentWordPair} 
          onRestart={resetGame} 
        />
      )}
    </div>
  );
}

export default App;
