import { useState } from 'react';
import { Skull, AlertTriangle, X } from 'lucide-react';

const GameScreen = ({ players, onEliminatePlayer, onProceedAfterReveal }) => {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [eliminatedReveal, setEliminatedReveal] = useState(null);

  const alivePlayers = players.filter(p => p.isAlive);

  const handleEliminateClick = (player) => {
    setSelectedPlayer(player);
  };

  const confirmElimination = () => {
    if (selectedPlayer) {
      setEliminatedReveal(selectedPlayer);
      onEliminatePlayer(selectedPlayer.id);
      setSelectedPlayer(null);
    }
  };

  const closeReveal = () => {
    setEliminatedReveal(null);
    if (onProceedAfterReveal) {
      onProceedAfterReveal();
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto p-6 relative">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-2xl font-bold text-white">Plateau de Jeu</h2>
        <p className="text-gray-400 text-sm">Discutez, votez et éliminez un joueur</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-2 gap-4 pb-24">
          {alivePlayers.map(player => (
            <button
              key={player.id}
              onClick={() => handleEliminateClick(player)}
              className="bg-[var(--color-dark-card)] border border-gray-700 hover:border-[var(--color-danger)] p-6 rounded-2xl flex flex-col items-center justify-center space-y-3 transition-colors group"
            >
              <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-[var(--color-danger)] group-hover:text-white transition-colors">
                <span className="font-bold text-lg">{player.name.charAt(0).toUpperCase()}</span>
              </div>
              <span className="font-semibold text-white">{player.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Confirmation Modal */}
      {selectedPlayer && (
        <div className="absolute inset-0 z-10 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-[var(--color-dark-card)] p-6 rounded-3xl w-full border border-gray-700 space-y-6">
            <div className="text-center">
              <AlertTriangle size={48} className="mx-auto text-yellow-500 mb-4" />
              <h3 className="text-xl font-bold text-white">Éliminer {selectedPlayer.name} ?</h3>
              <p className="text-gray-400 mt-2 text-sm">Cette action est irréversible.</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setSelectedPlayer(null)}
                className="flex-1 py-3 rounded-xl font-bold bg-gray-800 text-white hover:bg-gray-700 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={confirmElimination}
                className="flex-1 py-3 rounded-xl font-bold bg-[var(--color-danger)] text-white hover:bg-[var(--color-danger-hover)] transition-colors"
              >
                Éliminer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reveal Modal */}
      {eliminatedReveal && (
        <div className="absolute inset-0 z-20 bg-black/95 backdrop-blur-md flex items-center justify-center p-6">
          <div className="text-center w-full max-w-sm space-y-8 animate-in fade-in zoom-in duration-300">
            <Skull size={64} className="mx-auto text-[var(--color-danger)]" />
            <div className="space-y-2">
              <h3 className="text-3xl font-bold text-white">{eliminatedReveal.name} est mort(e).</h3>
              <p className="text-xl text-gray-400">Son rôle était :</p>
            </div>
            
            <div className="bg-[var(--color-dark-card)] py-6 rounded-2xl border border-gray-700">
              <p className={`text-4xl font-black uppercase ${eliminatedReveal.role === 'Mr. White' ? 'text-[var(--color-danger)]' : 'text-white'}`}>
                {eliminatedReveal.role}
              </p>
            </div>

            {eliminatedReveal.role === 'Mr. White' && (
              <div className="bg-yellow-500/10 border border-yellow-500/50 p-4 rounded-xl text-yellow-400">
                <p className="font-bold mb-1">Dernière chance !</p>
                <p className="text-sm">Si Mr. White devine le mot des Civils, il vole la victoire !</p>
              </div>
            )}

            <button
              onClick={closeReveal}
              className="w-full py-4 rounded-2xl font-bold bg-white text-black hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
            >
              <span>Continuer</span>
              <X size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameScreen;
