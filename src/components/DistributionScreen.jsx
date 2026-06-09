import { useState } from 'react';
import { ArrowRight, ShieldQuestion } from 'lucide-react';

const DistributionScreen = ({ players, onDistributionComplete }) => {
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [showRole, setShowRole] = useState(false);
  const [hasSeenRole, setHasSeenRole] = useState(false);

  const currentPlayer = players[currentPlayerIndex];
  const isLastPlayer = currentPlayerIndex === players.length - 1;

  const handleNextPlayer = () => {
    if (isLastPlayer) {
      onDistributionComplete();
    } else {
      setCurrentPlayerIndex(prev => prev + 1);
      setShowRole(false);
      setHasSeenRole(false);
    }
  };

  const handleToggleRole = () => {
    setShowRole(!showRole);
    setHasSeenRole(true);
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto p-6">
      <div className="flex-1 flex flex-col items-center justify-center space-y-8">
        
        <div className="text-center space-y-4">
          <p className="text-gray-400 font-medium uppercase tracking-widest text-sm">Tour de</p>
          <h2 className="text-5xl font-bold text-white">{currentPlayer.name}</h2>
          <p className="text-[var(--color-danger)] text-sm font-medium mt-4">
            Les autres, ne regardez pas !
          </p>
        </div>

        <div className="w-full max-w-sm mt-12">
          <button
            onPointerDown={() => { setShowRole(true); setHasSeenRole(true); }}
            onPointerUp={() => setShowRole(false)}
            onPointerLeave={() => setShowRole(false)}
            onTouchStart={() => { setShowRole(true); setHasSeenRole(true); }}
            onTouchEnd={() => setShowRole(false)}
            onContextMenu={(e) => e.preventDefault()}
            onClick={handleToggleRole}
            className={`w-full aspect-square rounded-3xl flex flex-col items-center justify-center space-y-6 transition-all duration-300 select-none touch-none ${
              showRole 
                ? 'bg-white text-black scale-105 shadow-[0_0_40px_rgba(255,255,255,0.3)]' 
                : 'bg-[var(--color-dark-card)] border-2 border-gray-700 text-white hover:border-gray-500'
            }`}
          >
            {showRole ? (
              <>
                <div className="text-center px-4">
                  {currentPlayer.role === 'Mr. White' ? (
                    <>
                      <p className="text-xl font-bold text-gray-500 mb-2">Vous êtes</p>
                      <h3 className="text-4xl font-black uppercase text-[var(--color-danger)]">Mr. White</h3>
                      <p className="mt-4 text-sm font-medium">Vous n'avez pas de mot. Fondez-vous dans la masse.</p>
                    </>
                  ) : (
                    <>
                      <p className="text-xl font-bold text-gray-500 mb-2">Votre mot est</p>
                      <h3 className="text-4xl font-black uppercase">{currentPlayer.word}</h3>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <ShieldQuestion size={64} className="text-gray-500" />
                <span className="text-xl font-bold">Maintenez pour voir</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="p-6">
        <button
          onClick={handleNextPlayer}
          disabled={!hasSeenRole}
          className="w-full flex items-center justify-center space-x-2 bg-[var(--color-primary)] text-white font-bold py-4 rounded-2xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[var(--color-primary-hover)] transition-colors"
        >
          <span>{isLastPlayer ? 'Commencer la partie' : 'Joueur suivant'}</span>
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default DistributionScreen;
