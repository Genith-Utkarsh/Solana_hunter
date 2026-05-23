import React, { useState, useMemo } from 'react';
import axios from 'axios';

const PHASES = [
  { name: "Phase 1 — Foundations", color: "#534AB7" },
  { name: "Phase 2 — Fullstack Web Dev", color: "#185FA5" },
  { name: "Phase 3 — Web3 Fundamentals", color: "#0F6E56" },
  { name: "Phase 4 — Solana Core Dev", color: "#BA7517" },
  { name: "Phase 5 — Advanced Solana", color: "#993C1D" },
  { name: "Phase 6 — Job Ready & Expert", color: "#993556" },
];

function CustomQuests({ quests, onQuestCreated, onToggleQuest, onAskAI }) {
  const [title, setTitle] = useState('');
  const [sub, setSub] = useState('');
  const [phase, setPhase] = useState(0);
  const [skills, setSkills] = useState('');
  const [resources, setResources] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedQuestId, setExpandedQuestId] = useState(null);

  // Filter custom quests
  const customQuests = useMemo(() => {
    return quests.filter(q => q.isCustom);
  }, [quests]);

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

      // Reset fields
      setTitle('');
      setSub('');
      setPhase(0);
      setSkills('');
      setResources('');

      if (onQuestCreated) onQuestCreated();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to create quest');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuest = async (questId) => {
    if (!window.confirm('Are you sure you want to discard this custom quest? Progress will be permanently deleted.')) {
      return;
    }

    try {
      await axios.delete(`/api/quests/${questId}`);
      if (onQuestCreated) onQuestCreated();
      if (expandedQuestId === questId) setExpandedQuestId(null);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to delete quest');
    }
  };

  const handleCardClick = (questId, e) => {
    if (
      e.target.closest('.action-btn') || 
      e.target.closest('.check-toggle')
    ) {
      return;
    }
    setExpandedQuestId(prev => (prev === questId ? null : questId));
  };

  return (
    <div className="space-y-8 animate-fade-in-active">
      {/* Title */}
      <div className="border-b border-outline-variant/30 pb-4">
        <div className="font-label-mono text-label-mono text-primary uppercase tracking-widest flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px]">assignment</span>
          CUSTOM MISSIONS
        </div>
        <h1 className="font-headline-md text-headline-md text-white mt-1">
          QUEST CONTROLLER
        </h1>
        <p className="font-body-md text-on-surface-variant text-[14px]">
          Inject custom training objectives (Daily Quests, Project Milestones) into the MERN interface to track progress and gain stats.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Create Custom Quest Form */}
        <div className="lg:col-span-1 bg-[#121212]/80 border border-outline-variant/30 rounded-lg p-6 scanline relative overflow-hidden h-fit">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-[#d8b9ff]"></div>
          
          <h2 className="font-headline-md text-[18px] text-[#d8b9ff] mb-4 uppercase tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">note_add</span>
            CREATE BOUNTY
          </h2>

          {error && (
            <div className="bg-error-container/20 border border-error/50 text-error p-3 rounded mb-4 font-body-md text-[12px] flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">error</span>
              {error}
            </div>
          )}

          <form onSubmit={handleCreateQuest} className="space-y-4">
            <div>
              <label className="block font-label-mono text-[9px] text-on-surface-variant uppercase tracking-wider mb-1">Quest Title *</label>
              <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Deploy Token-2022 hook"
                className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded p-2.5 text-on-surface font-body-md text-[13px] focus:outline-none focus:border-primary transition-colors focus:ring-0"
                required
              />
            </div>

            <div>
              <label className="block font-label-mono text-[9px] text-on-surface-variant uppercase tracking-wider mb-1">Subtopics</label>
              <input 
                type="text" 
                value={sub} 
                onChange={(e) => setSub(e.target.value)}
                placeholder="e.g. transfer-hook, anchor spl"
                className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded p-2.5 text-on-surface font-body-md text-[13px] focus:outline-none focus:border-primary transition-colors focus:ring-0"
              />
            </div>

            <div>
              <label className="block font-label-mono text-[9px] text-on-surface-variant uppercase tracking-wider mb-1">Dungeon Rank (Phase)</label>
              <select 
                value={phase} 
                onChange={(e) => setPhase(Number(e.target.value))}
                className="w-full bg-[#1c1c1c] border border-outline-variant/50 rounded p-2.5 text-on-surface font-body-md text-[13px] focus:outline-none focus:border-primary focus:ring-0"
              >
                {PHASES.map((p, idx) => (
                  <option key={idx} value={idx}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-label-mono text-[9px] text-on-surface-variant uppercase tracking-wider mb-1">Objectives (comma-separated)</label>
              <textarea 
                value={skills} 
                onChange={(e) => setSkills(e.target.value)}
                placeholder="e.g. Design metadata layout, Set transfer hooks, Deploy to devnet"
                rows={3}
                className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded p-2.5 text-on-surface font-body-md text-[12px] focus:outline-none focus:border-primary transition-colors focus:ring-0"
              />
            </div>

            <div>
              <label className="block font-label-mono text-[9px] text-on-surface-variant uppercase tracking-wider mb-1">Resources (comma-separated)</label>
              <input 
                type="text" 
                value={resources} 
                onChange={(e) => setResources(e.target.value)}
                placeholder="e.g. https://soldev.app, Anchor Docs"
                className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded p-2.5 text-on-surface font-body-md text-[12px] focus:outline-none focus:border-primary transition-colors focus:ring-0"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 bg-secondary text-[#050505] font-label-mono text-[11px] rounded hover:bg-secondary-fixed hover:shadow-[0_0_15px_rgba(216,185,255,0.4)] transition-all uppercase tracking-wider font-bold mt-2"
            >
              {loading ? 'INITIALIZING...' : 'INITIALIZE BOUNTY'}
            </button>
          </form>
        </div>

        {/* Right Side: Active Custom Quests List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-headline-md text-[18px] text-white uppercase tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-primary">lists</span>
            ACTIVE BOUNTIES ({customQuests.length})
          </h2>

          {customQuests.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-outline-variant/30 rounded-lg font-label-mono text-on-surface-variant/50">
              NO ACTIVE CUSTOM BOUNTIES. INJECT A NEW TARGET ON THE LEFT.
            </div>
          ) : (
            <div className="space-y-3">
              {customQuests.map((quest) => {
                const p = PHASES[quest.phase];
                const isExp = expandedQuestId === quest.questId;

                return (
                  <div 
                    key={quest.questId}
                    onClick={(e) => handleCardClick(quest.questId, e)}
                    className={`border rounded-lg overflow-hidden transition-all duration-300 cursor-pointer ${
                      isExp 
                        ? 'bg-[#121212] border-primary system-glow' 
                        : 'bg-[#121212]/80 border-outline-variant/40 hover:border-primary/60'
                    } ${quest.isCompleted ? 'opacity-60 hover:opacity-90' : ''}`}
                  >
                    <div className="p-4 flex gap-4">
                      {/* Checkmark toggle */}
                      <div className="flex flex-col items-center gap-2">
                        <button 
                          onClick={() => onToggleQuest(quest.questId)}
                          className="check-toggle w-8 h-8 rounded border flex items-center justify-center transition-colors duration-300 border-primary bg-primary/5 hover:bg-primary/20"
                        >
                          <span className={`material-symbols-outlined text-[16px] font-bold ${
                            quest.isCompleted ? 'text-primary' : 'text-transparent'
                          }`}>
                            check
                          </span>
                        </button>
                        <span className="font-label-mono text-[9px] text-on-surface-variant/40">DONE</span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span 
                                className="font-label-mono text-[9px] px-2 py-0.5 rounded tracking-wide font-medium"
                                style={{ backgroundColor: `${p.color}15`, color: p.color, border: `1px solid ${p.color}30` }}
                              >
                                {p.name.split('—')[1]?.trim() || p.name}
                              </span>
                              <span className="font-label-mono text-[9px] px-2 py-0.5 rounded tracking-wide bg-surface-container-highest border border-outline-variant/30 text-on-surface-variant">
                                CUSTOM
                              </span>
                            </div>
                            <h3 className="font-body-md text-[16px] text-on-surface font-semibold truncate mt-2">
                              {quest.title}
                            </h3>
                            <p className="font-body-md text-[13px] text-on-surface-variant truncate mt-0.5">
                              {quest.sub}
                            </p>
                          </div>

                          <button 
                            onClick={() => handleDeleteQuest(quest.questId)}
                            className="action-btn text-on-surface-variant hover:text-error transition-colors p-1"
                            title="Discard Quest"
                          >
                            <span className="material-symbols-outlined text-[20px]">delete</span>
                          </button>
                        </div>

                        {/* Objectives List (Expanded Only) */}
                        {isExp && (
                          <div className="mt-4 pt-4 border-t border-outline-variant/30 grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-active">
                            <div>
                              <h4 className="font-label-mono text-[11px] text-secondary tracking-widest mb-2 uppercase">
                                Objectives
                              </h4>
                              <ul className="space-y-1.5">
                                {quest.skills.map((skill, sIdx) => (
                                  <li key={sIdx} className="flex items-start gap-2 text-[13px] text-on-surface font-body-md">
                                    <span className="text-primary mt-1 text-[10px]">▸</span>
                                    <span>{skill}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-label-mono text-[11px] text-secondary tracking-widest mb-2 uppercase">
                                Resources
                              </h4>
                              <ul className="space-y-1.5">
                                {quest.resources.map((res, rIdx) => (
                                  <li key={rIdx} className="flex items-start gap-2 text-[13px] text-on-surface-variant font-body-md hover:text-primary cursor-pointer transition-colors">
                                    <span className="material-symbols-outlined text-[14px] mt-0.5">link</span>
                                    <span className="truncate">{res}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        {isExp && (
                          <div className="mt-6 flex gap-3">
                            <button 
                              onClick={() => onToggleQuest(quest.questId)}
                              className="action-btn flex-1 py-3 bg-primary text-[#050505] font-label-mono text-[11px] rounded hover:bg-primary-fixed hover:shadow-[0_0_15px_rgba(20,241,149,0.5)] transition-all uppercase tracking-wider font-bold"
                            >
                              {quest.isCompleted ? 'MARK QUEST INCOMPLETE' : 'COMPLETE QUEST'}
                            </button>
                            <button 
                              onClick={() => onAskAI(quest)}
                              className="action-btn px-4 py-3 bg-transparent border border-outline-variant hover:border-primary text-on-surface-variant hover:text-primary font-label-mono text-[12px] rounded transition-all uppercase tracking-wider flex items-center justify-center"
                              title="Ask AI System Guide"
                            >
                              <span className="material-symbols-outlined text-[18px]">smart_toy</span>
                            </button>
                          </div>
                        )}

                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default CustomQuests;
