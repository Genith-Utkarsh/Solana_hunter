import React from 'react';

function MobileNav({ currentView, setView }) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-20 pb-safe bg-surface-container-highest/90 backdrop-blur-lg border-t border-primary/20 shadow-[0_-4px_20px_rgba(0,0,0,0.5)] rounded-t-xl">
      <button 
        onClick={() => setView('roadmap')}
        className={`flex flex-col items-center justify-center transition-all ${
          currentView === 'roadmap' 
            ? 'text-primary-container scale-110' 
            : 'text-on-surface-variant opacity-60 hover:opacity-100'
        }`}
      >
        <span className="material-symbols-outlined mb-1">map</span>
        <span className="font-label-mono text-[10px]">Roadmap</span>
      </button>

      <button 
        onClick={() => setView('inventory')}
        className={`flex flex-col items-center justify-center transition-all ${
          currentView === 'inventory' 
            ? 'text-primary-container scale-110' 
            : 'text-on-surface-variant opacity-60 hover:opacity-100'
        }`}
      >
        <span className="material-symbols-outlined mb-1">inventory_2</span>
        <span className="font-label-mono text-[10px]">Inventory</span>
      </button>

      <button 
        onClick={() => setView('custom-quests')}
        className={`flex flex-col items-center justify-center transition-all ${
          currentView === 'custom-quests' 
            ? 'text-primary-container scale-110' 
            : 'text-on-surface-variant opacity-60 hover:opacity-100'
        }`}
      >
        <span className="material-symbols-outlined mb-1">assignment</span>
        <span className="font-label-mono text-[10px]">Quests</span>
      </button>

      <button 
        onClick={() => setView('rankings')}
        className={`flex flex-col items-center justify-center transition-all ${
          currentView === 'rankings' 
            ? 'text-primary-container scale-110' 
            : 'text-on-surface-variant opacity-60 hover:opacity-100'
        }`}
      >
        <span className="material-symbols-outlined mb-1">leaderboard</span>
        <span className="font-label-mono text-[10px]">Rankings</span>
      </button>
    </nav>
  );
}

export default MobileNav;
