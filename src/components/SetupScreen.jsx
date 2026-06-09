import { useState } from 'react';
import { UserPlus, Play, Trash2, Users } from 'lucide-react';

const SetupScreen = ({ onStartGame }) => {
  const [players, setPlayers] = useState([]);
  const [newPlayerName, setNewPlayerName] = useState('');
  
  const [settings, setSettings] = useState({
    civils: 0,
    undercovers: 0,
    mrWhite: 0
  });

  const updateSettingsForPlayers = (total) => {
    if (total < 3) {
      setSettings({ civils: total, undercovers: 0, mrWhite: 0 });
      return;
    }
    let mrWhiteCount = total >= 5 ? 1 : 0;
    let undercoverCount = Math.floor(total / 3);
    let civilCount = total - undercoverCount - mrWhiteCount;
    setSettings({
      civils: civilCount,
      undercovers: undercoverCount,
      mrWhite: mrWhiteCount
    });
  };

  const handleAddPlayer = (e) => {
    e.preventDefault();
    if (newPlayerName.trim() && !players.includes(newPlayerName.trim())) {
      const newPlayers = [...players, newPlayerName.trim()];
      setPlayers(newPlayers);
      updateSettingsForPlayers(newPlayers.length);
      setNewPlayerName('');
    }
  };

  const handleRemovePlayer = (name) => {
    const newPlayers = players.filter(p => p !== name);
    setPlayers(newPlayers);
    updateSettingsForPlayers(newPlayers.length);
  };

  const updateSetting = (role, delta) => {
    setSettings(prev => ({
      ...prev,
      [role]: Math.max(0, prev[role] + delta)
    }));
  };

  const totalRoles = settings.civils + settings.undercovers + settings.mrWhite;
  const isValid = players.length >= 3 && totalRoles === players.length;

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">Undercover</h1>
        <p className="text-gray-400 text-sm">Ajoutez des joueurs pour commencer</p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 pb-24">
        {/* Player Input */}
        <form onSubmit={handleAddPlayer} className="flex space-x-2">
          <input
            type="text"
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            placeholder="Nom du joueur..."
            className="flex-1 bg-[var(--color-dark-card)] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-primary)] transition-colors"
          />
          <button
            type="submit"
            disabled={!newPlayerName.trim()}
            className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white p-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <UserPlus size={24} />
          </button>
        </form>

        {/* Player List */}
        {players.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center space-x-2">
              <Users size={16} />
              <span>Joueurs ({players.length})</span>
            </h2>
            <div className="space-y-2">
              {players.map((player, index) => (
                <div key={index} className="flex justify-between items-center bg-[var(--color-dark-card)] p-3 rounded-xl border border-gray-800">
                  <span className="font-medium">{player}</span>
                  <button onClick={() => handleRemovePlayer(player)} className="text-gray-500 hover:text-[var(--color-danger)] p-1">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Roles Settings */}
        {players.length >= 3 && (
          <div className="space-y-4 bg-[var(--color-dark-card)] p-4 rounded-2xl border border-gray-800">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Répartition</h2>
              <span className={`text-sm font-bold ${totalRoles !== players.length ? 'text-[var(--color-danger)]' : 'text-green-500'}`}>
                {totalRoles} / {players.length}
              </span>
            </div>

            <RoleControl label="Civils" value={settings.civils} onChange={(d) => updateSetting('civils', d)} />
            <RoleControl label="Undercovers" value={settings.undercovers} onChange={(d) => updateSetting('undercovers', d)} />
            <RoleControl label="Mr. White" value={settings.mrWhite} onChange={(d) => updateSetting('mrWhite', d)} />
            
            {totalRoles !== players.length && (
              <p className="text-[var(--color-danger)] text-xs text-center mt-2">
                Le total des rôles doit être égal au nombre de joueurs.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Start Button Fixed at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[var(--color-dark-bg)] via-[var(--color-dark-bg)] to-transparent">
        <button
          onClick={() => onStartGame(players, settings)}
          disabled={!isValid}
          className="w-full max-w-md mx-auto flex items-center justify-center space-x-2 bg-white text-black font-bold py-4 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200"
        >
          <Play fill="currentColor" size={20} />
          <span>Lancer la partie</span>
        </button>
      </div>
    </div>
  );
};

const RoleControl = ({ label, value, onChange }) => (
  <div className="flex justify-between items-center">
    <span className="font-medium text-gray-300">{label}</span>
    <div className="flex items-center space-x-4">
      <button onClick={() => onChange(-1)} className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700">-</button>
      <span className="w-4 text-center font-bold">{value}</span>
      <button onClick={() => onChange(1)} className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700">+</button>
    </div>
  </div>
);

export default SetupScreen;
