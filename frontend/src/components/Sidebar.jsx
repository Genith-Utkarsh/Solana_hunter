import React, { useState } from 'react';
import axios from 'axios';

function Sidebar({ user, rank, currentView, setView, onLogout, onQuestCreated }) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [sub, setSub] = useState('');
  const [phase, setPhase] = useState(0);
  const [skills, setSkills] = useState('');
  const [resources, setResources] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreateQuest = async (e) => {
    e.preventDefault();
    if (!title) {
      setError('Quest Title is required');
      return;
    }
    setError('');
    setLoading(true);

    try {
      await axios.post('/api/quests', {
        title,
        sub,
        phase: Number(phase),
        skills: skills.split(',').map(s => s.trim()).filter(Boolean),
        resources: resources.split(',').map(r => r.trim()).filter(Boolean),
      });

      // Clear form
      setTitle('');
      setSub('');
      setPhase(0);
      setSkills('');
      setResources('');
      setShowCreateModal(false);
      
      // Refresh
      if (onQuestCreated) onQuestCreated();
      setView('custom-quests'); // Redirect to quests tab to see it!
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to create quest');
    } finally {
      setLoading(false);
    }
  };

  // Avatar mapping options
  const avatarUrls = {
    'avatar-1': 'https://lh3.googleusercontent.com/aida-public/AB6AXuDEYqQLyaNdwfoPLmMEUF_Z6fz8dRy_-5_SXnQRLJvpd2jlbZbKs4RfcUUNYq5Rs3NVWFdEz-jR4cR5HKcG6LqK8RikII9u2YAgCv2etPWozKnvXhPwZRnhc7MsSZyNbMXGekX3dnNWlU_J8lI7hvrXKurW5ULaKPkOjbjEA1WaJGwapAGf-fVuu04XfumD_ZcCgy0EMdNKy6Wzx3tbon-0oe6CdDlNB8dwW-A5Ie4rXDOeBQyhd_n8xOFIf_zHs0-Hd0VPxBkv0GA',
  };

  const getAvatarUrl = (key) => {
    return avatarUrls[key] || avatarUrls['avatar-1'];
  };

  return (
    <>
      <nav className="hidden md:flex flex-col fixed left-0 top-0 h-full w-64 bg-surface-container-lowest/80 backdrop-blur-2xl border-r border-outline-variant/20 z-40">
        {/* User Status Section */}
        <div className="p-6 border-b border-outline-variant/20 flex flex-col items-center justify-center gap-4 relative scanline overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="w-20 h-20 rounded-full border-2 border-primary p-1 system-glow relative z-10 transition-transform group-hover:scale-105 duration-300">
            <img 
              alt="Hunter Avatar" 
              className="w-full h-full object-cover rounded-full filter grayscale contrast-125 group-hover:grayscale-0 transition-all duration-500" 
              src={getAvatarUrl(user.avatar)}
            />
          </div>
          
          <div className="text-center relative z-10 w-full">
            <div className="font-headline-md text-headline-md text-secondary tracking-tighter uppercase truncate px-2" title={user.username}>
              {user.username}
            </div>
            <div className="font-label-mono text-label-mono text-on-surface-variant mt-1">
              LVL. {user.level} {rank}
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 py-6 flex flex-col gap-1">
          <button 
            onClick={() => setView('roadmap')}
            className={`flex items-center gap-4 py-4 px-6 relative overflow-hidden group text-left w-full transition-all ${
              currentView === 'roadmap' 
                ? 'text-primary bg-primary/5 border-r-2 border-primary' 
                : 'text-on-surface-variant hover:text-primary hover:bg-surface-variant/20'
            }`}
          >
            <span className="material-symbols-outlined relative z-10">map</span>
            <span className="font-label-mono text-label-mono relative z-10">Roadmap</span>
          </button>

          <button 
            onClick={() => setView('inventory')}
            className={`flex items-center gap-4 py-4 px-6 relative overflow-hidden group text-left w-full transition-all ${
              currentView === 'inventory' 
                ? 'text-primary bg-primary/5 border-r-2 border-primary' 
                : 'text-on-surface-variant hover:text-primary hover:bg-surface-variant/20'
            }`}
          >
            <span className="material-symbols-outlined relative z-10">inventory_2</span>
            <span className="font-label-mono text-label-mono relative z-10">Inventory</span>
          </button>

          <button 
            onClick={() => setView('custom-quests')}
            className={`flex items-center gap-4 py-4 px-6 relative overflow-hidden group text-left w-full transition-all ${
              currentView === 'custom-quests' 
                ? 'text-primary bg-primary/5 border-r-2 border-primary' 
                : 'text-on-surface-variant hover:text-primary hover:bg-surface-variant/20'
            }`}
          >
            <span className="material-symbols-outlined relative z-10">assignment</span>
            <span className="font-label-mono text-label-mono relative z-10">Quests</span>
          </button>

          <button 
            onClick={() => setView('rankings')}
            className={`flex items-center gap-4 py-4 px-6 relative overflow-hidden group text-left w-full transition-all ${
              currentView === 'rankings' 
                ? 'text-primary bg-primary/5 border-r-2 border-primary' 
                : 'text-on-surface-variant hover:text-primary hover:bg-surface-variant/20'
            }`}
          >
            <span className="material-symbols-outlined relative z-10">leaderboard</span>
            <span className="font-label-mono text-label-mono relative z-10">Rankings</span>
          </button>

          {/* Logout Button */}
          <button 
            onClick={onLogout}
            className="flex items-center gap-4 py-4 px-6 text-on-surface-variant hover:text-error hover:bg-error-container/10 transition-all text-left w-full mt-auto"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="font-label-mono text-label-mono">Logout</span>
          </button>
        </div>

        {/* Daily Quest Creator Trigger */}
        <div className="p-6">
          <button 
            onClick={() => setShowCreateModal(true)}
            className="w-full py-3 bg-transparent border border-secondary text-secondary font-label-mono text-label-mono hover:bg-secondary/10 transition-all duration-300 uppercase tracking-widest relative overflow-hidden group"
          >
            <span className="relative z-10">ADD QUEST</span>
            <div className="absolute inset-0 bg-secondary/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </button>
        </div>
      </nav>

      {/* Initialize Custom Quest Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in-active">
          <div className="bg-[#121212] border border-[#185FA5] rounded-lg max-w-md w-full p-6 system-glow relative scanline overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#185FA5]"></div>
            
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-headline-md text-headline-md text-secondary tracking-widest uppercase flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-primary">add_box</span>
                NEW QUEST
              </h3>
              <button 
                onClick={() => { setShowCreateModal(false); setError(''); }}
                className="text-on-surface-variant hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {error && (
              <div className="bg-error-container/20 border border-error/50 text-error p-3 rounded mb-4 font-body-md text-[13px] flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">error</span>
                {error}
              </div>
            )}

            <form onSubmit={handleCreateQuest} className="space-y-4">
              <div>
                <label className="block font-label-mono text-[10px] text-on-surface-variant uppercase tracking-wider mb-1">Quest Title *</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Build escrow program"
                  className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded p-2.5 text-on-surface font-body-md text-[14px] focus:outline-none focus:border-primary transition-colors focus:ring-0"
                  required
                />
              </div>

              <div>
                <label className="block font-label-mono text-[10px] text-on-surface-variant uppercase tracking-wider mb-1">Subtopics / Description</label>
                <input 
                  type="text" 
                  value={sub} 
                  onChange={(e) => setSub(e.target.value)}
                  placeholder="e.g. PDAs, token account creation"
                  className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded p-2.5 text-on-surface font-body-md text-[14px] focus:outline-none focus:border-primary transition-colors focus:ring-0"
                />
              </div>

              <div>
                <label className="block font-label-mono text-[10px] text-on-surface-variant uppercase tracking-wider mb-1">Dungeon Rank (Phase)</label>
                <select 
                  value={phase} 
                  onChange={(e) => setPhase(Number(e.target.value))}
                  className="w-full bg-[#1c1c1c] border border-outline-variant/50 rounded p-2.5 text-on-surface font-body-md text-[14px] focus:outline-none focus:border-primary focus:ring-0"
                >
                  <option value={0}>F-Rank (Phase 1: Foundations)</option>
                  <option value={1}>E-Rank (Phase 2: Web Dev)</option>
                  <option value={2}>D-Rank (Phase 3: Web3 Fundamentals)</option>
                  <option value={3}>C-Rank (Phase 4: Solana Core)</option>
                  <option value={4}>B-Rank (Phase 5: Advanced Solana)</option>
                  <option value={5}>A-Rank (Phase 6: Job Ready)</option>
                </select>
              </div>

              <div>
                <label className="block font-label-mono text-[10px] text-on-surface-variant uppercase tracking-wider mb-1">Objectives (comma-separated list)</label>
                <textarea 
                  value={skills} 
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="e.g. Create PDA sync, Test on-chain, Verify signatures"
                  rows={2}
                  className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded p-2.5 text-on-surface font-body-md text-[13px] focus:outline-none focus:border-primary transition-colors focus:ring-0"
                />
              </div>

              <div>
                <label className="block font-label-mono text-[10px] text-on-surface-variant uppercase tracking-wider mb-1">Resources / URLs (comma-separated list)</label>
                <input 
                  type="text" 
                  value={resources} 
                  onChange={(e) => setResources(e.target.value)}
                  placeholder="e.g. Soldev.app, Anchor documentation"
                  className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded p-2.5 text-on-surface font-body-md text-[13px] focus:outline-none focus:border-primary transition-colors focus:ring-0"
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3 bg-[#185FA5] hover:bg-[#185FA5]/95 text-white font-label-mono text-[12px] rounded hover:shadow-[0_0_15px_rgba(24,95,165,0.4)] transition-all uppercase tracking-wider font-bold mt-2 flex justify-center items-center"
              >
                {loading ? 'INITIALIZING...' : 'INITIALIZE QUEST'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Sidebar;
