import { Trophy, RotateCcw } from 'lucide-react';

const EndGameScreen = ({ winners, word, onRestart }) => {
  const getWinnerMessage = () => {
    switch (winners) {
      case 'Civils':
        return 'Les Civils ont gagné !';
      case 'Undercovers':
        return 'Les Undercovers ont gagné !';
      case 'Mr. White':
        return 'Mr. White a gagné !';
      default:
        return 'Partie terminée !';
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto p-6 text-center justify-center space-y-12 animate-in fade-in zoom-in duration-500">
      <div className="space-y-6">
        <div className="w-24 h-24 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
          <Trophy size={48} className="text-yellow-500" />
        </div>
        
        <h1 className="text-4xl font-black text-white">{getWinnerMessage()}</h1>
        
        {word && (
          <div className="bg-[var(--color-dark-card)] p-6 rounded-2xl border border-gray-700 mt-8">
            <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">Le mot des Civils était</p>
            <p className="text-3xl font-bold text-white">{word.civil}</p>
            <div className="h-px bg-gray-800 my-4 w-1/2 mx-auto" />
            <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">Le mot des Undercovers était</p>
            <p className="text-xl font-semibold text-gray-300">{word.undercover}</p>
          </div>
        )}
      </div>

      <div className="pt-8">
        <button
          onClick={onRestart}
          className="w-full max-w-sm mx-auto flex items-center justify-center space-x-2 bg-white text-black font-bold py-4 rounded-2xl hover:bg-gray-200 transition-colors"
        >
          <RotateCcw size={20} />
          <span>Rejouer</span>
        </button>
      </div>
    </div>
  );
};

export default EndGameScreen;
