import React from 'react';

function MobileHeader({ user, rank, onLogout }) {
  return (
    <header className="md:hidden flex justify-between items-center w-full px-margin-mobile h-16 bg-surface/70 backdrop-blur-xl border-b border-outline-variant/30 shadow-[0_0_15px_rgba(20,241,149,0.1)] fixed top-0 z-50">
      <div className="font-label-mono text-label-mono text-primary-container tracking-[0.2em] uppercase">
        SYSTEM
      </div>
      <div className="flex items-center gap-4">
        <span className="font-label-mono text-[10px] text-secondary px-2.5 py-1 rounded bg-secondary/10 border border-secondary/30">
          {rank}
        </span>
        <button 
          onClick={onLogout}
          className="material-symbols-outlined text-primary cursor-pointer hover:bg-primary/10 transition-colors duration-300 rounded-full p-1"
          title="Logout"
        >
          logout
        </button>
      </div>
    </header>
  );
}

export default MobileHeader;
