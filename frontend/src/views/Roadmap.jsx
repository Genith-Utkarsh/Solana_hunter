import React, { useState, useMemo } from 'react';

// Phase constant configurations
const PHASES = [
  { name: "Phase 1 — Foundations", color: "#534AB7", bg: "#EEEDFE", text: "#3C3489", dot: "#534AB7" },
  { name: "Phase 2 — Fullstack Web Dev", color: "#185FA5", bg: "#E6F1FB", text: "#0C447C", dot: "#185FA5" },
  { name: "Phase 3 — Web3 Fundamentals", color: "#0F6E56", bg: "#E1F5EE", text: "#085041", dot: "#0F6E56" },
  { name: "Phase 4 — Solana Core Dev", color: "#BA7517", bg: "#FAEEDA", text: "#633806", dot: "#BA7517" },
  { name: "Phase 5 — Advanced Solana", color: "#993C1D", bg: "#FAECE7", text: "#4A1B0C", dot: "#993C1D" },
  { name: "Phase 6 — Job Ready & Expert", color: "#993556", bg: "#FBEAF0", text: "#4B1528", dot: "#993556" },
];

function Roadmap({ user, quests, loading, onToggleQuest, onAskAI, rank }) {
  const [activePhase, setActivePhase] = useState('all'); // 'all', 0, 1, 2, 3, 4, 5
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedQuestId, setExpandedQuestId] = useState(null);

  // Filter system quests (excluding custom ones)
  const systemQuests = useMemo(() => {
    return quests.filter(q => !q.isCustom);
  }, [quests]);

  const totalSystemQuests = systemQuests.length || 100;
  const completedSystemQuests = systemQuests.filter(q => q.isCompleted).length;
  
  // Calculate percentage
  const expProgress = totalSystemQuests > 0 
    ? Math.round((completedSystemQuests / totalSystemQuests) * 100) 
    : 0;

  // Filtered system quests for display
  const filteredQuests = useMemo(() => {
    return systemQuests.filter(q => {
      const phaseMatch = activePhase === 'all' || q.phase === parseInt(activePhase);
      const qText = searchQuery.toLowerCase();
      const textMatch = !qText 
        || q.title.toLowerCase().includes(qText) 
        || q.sub.toLowerCase().includes(qText) 
        || (q.skills || []).some(s => s.toLowerCase().includes(qText));
      return phaseMatch && textMatch;
    });
  }, [systemQuests, activePhase, searchQuery]);

  const handleCardClick = (questId, e) => {
    // Prevent expanding if checkmark or action button was clicked
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
      {/* Header Status Window */}
      <div className="bg-[#121212]/80 backdrop-blur-xl border border-outline-variant/30 rounded-lg p-6 system-glow scanline relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-container to-transparent opacity-50"></div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
          <div>
            <div className="font-label-mono text-label-mono text-on-surface-variant flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              SYSTEM STATUS: ONLINE
            </div>
            <h1 className="font-headline-md text-[28px] text-on-surface mb-1 uppercase">
              PLAYER_STATUS: <span className="text-primary tracking-widest">{user.username}</span>
            </h1>
            <p className="font-body-md text-[14px] text-on-surface-variant">Solana Fullstack Developer Awakening</p>
          </div>

          <div className="flex gap-4 items-center bg-surface-container-highest p-4 rounded-md border border-outline-variant/50">
            <div className="text-center pr-4 border-r border-outline-variant/50">
              <div className="font-label-mono text-[10px] text-on-surface-variant mb-1">CLASS</div>
              <div className="font-headline-md text-[18px] text-secondary">{rank}</div>
            </div>
            <div className="text-center px-4 border-r border-outline-variant/50">
              <div className="font-label-mono text-[10px] text-on-surface-variant mb-1">LEVEL</div>
              <div className="font-status-number text-status-number text-primary">{user.level}</div>
            </div>
            <div className="text-center pl-4">
              <div className="font-label-mono text-[10px] text-on-surface-variant mb-1">QUESTS</div>
              <div className="font-status-number text-status-number text-on-surface">
                {completedSystemQuests}/{totalSystemQuests}
              </div>
            </div>
          </div>
        </div>

        {/* EXP Bar */}
        <div>
          <div className="flex justify-between font-label-mono text-label-mono text-on-surface-variant mb-2">
            <span>EXP Progress (Roadmap Completion)</span>
            <span className="text-primary">{expProgress}%</span>
          </div>
          <div className="w-full h-3 bg-surface-container-lowest rounded-full overflow-hidden border border-outline-variant/30">
            <div 
              className="h-full progress-gradient relative overflow-hidden transition-all duration-500" 
              style={{ width: `${expProgress}%` }}
            >
              <div className="absolute inset-0 bg-white/20 -translate-x-full shimmer-anim"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Intelligence Card */}
        <div className="bg-[#121212]/60 backdrop-blur-md border border-outline-variant/30 rounded-lg p-4 system-glow-hover transition-all group">
          <div className="font-label-mono text-[10px] text-on-surface-variant mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-[#534AB7]">hub</span>
            INTELLIGENCE
          </div>
          <div className="font-status-number text-[24px] text-on-surface group-hover:text-primary transition-colors">
            {user.stats.intelligence}
          </div>
          <div className="font-label-mono text-[10px] text-[#534AB7] mt-1">Phase 1: Foundations</div>
        </div>

        {/* Strength Card */}
        <div className="bg-[#121212]/60 backdrop-blur-md border border-outline-variant/30 rounded-lg p-4 system-glow-hover transition-all group">
          <div className="font-label-mono text-[10px] text-on-surface-variant mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-[#185FA5]">construction</span>
            STRENGTH
          </div>
          <div className="font-status-number text-[24px] text-on-surface group-hover:text-primary transition-colors">
            {user.stats.strength}
          </div>
          <div className="font-label-mono text-[10px] text-[#185FA5] mt-1">Phase 2: Web Dev</div>
        </div>

        {/* Agility Card */}
        <div className="bg-[#121212]/60 backdrop-blur-md border border-outline-variant/30 rounded-lg p-4 system-glow-hover transition-all group">
          <div className="font-label-mono text-[10px] text-on-surface-variant mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-[#BA7517]">memory</span>
            AGILITY
          </div>
          <div className="font-status-number text-[24px] text-on-surface group-hover:text-primary transition-colors">
            {user.stats.agility}
          </div>
          <div className="font-label-mono text-[10px] text-[#BA7517] mt-1">Phase 3-4: Core Dev</div>
        </div>

        {/* Luck Card */}
        <div className="bg-[#121212]/60 backdrop-blur-md border border-outline-variant/30 rounded-lg p-4 system-glow-hover transition-all group">
          <div className="font-label-mono text-[10px] text-on-surface-variant mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-[#993C1D]">token</span>
            LUCK
          </div>
          <div className="font-status-number text-[24px] text-on-surface group-hover:text-primary transition-colors">
            {user.stats.luck}
          </div>
          <div className="font-label-mono text-[10px] text-[#993C1D] mt-1">Phase 5-6: Advanced</div>
        </div>
      </div>

      {/* Controls: Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 bg-[#121212]/80 p-4 rounded-lg border border-outline-variant/20">
        <div className="relative flex-1 mana-pulse rounded border border-outline-variant/50">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
            search
          </span>
          <input 
            className="w-full bg-surface-container-lowest border-0 rounded-md py-3 pl-10 pr-4 text-on-surface font-body-md focus:outline-none focus:ring-0 placeholder-on-surface-variant/50 transition-colors" 
            placeholder="Search Quests by title, subtopic or objectives..." 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex overflow-x-auto no-scrollbar gap-2 pb-2 md:pb-0 items-center">
          <button 
            onClick={() => setActivePhase('all')}
            className={`whitespace-nowrap px-4 py-2 font-label-mono text-[11px] rounded-full border transition-all uppercase tracking-wider ${
              activePhase === 'all' 
                ? 'border-primary text-[#050505] bg-primary' 
                : 'border-outline-variant text-on-surface-variant hover:border-[#534AB7] hover:text-[#534AB7]'
            }`}
          >
            ALL DUNGEONS
          </button>
          {PHASES.map((p, index) => (
            <button 
              key={index}
              onClick={() => setActivePhase(index)}
              className={`whitespace-nowrap px-4 py-2 font-label-mono text-[11px] rounded-full border transition-all uppercase tracking-wider ${
                activePhase === index 
                  ? 'text-white' 
                  : 'border-outline-variant text-on-surface-variant hover:text-white'
              }`}
              style={{
                borderColor: activePhase === index ? p.color : '',
                backgroundColor: activePhase === index ? p.color : '',
              }}
            >
              F-RANK (P{index + 1})
            </button>
          ))}
        </div>
      </div>

      {/* Quest Grid */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-10 font-label-mono text-on-surface-variant/75 flex flex-col items-center gap-2">
            <span className="material-symbols-outlined animate-spin text-[32px] text-primary">sync</span>
            LOADING SYSTEM ROADMAP FILES...
          </div>
        ) : filteredQuests.length === 0 ? (
          <div className="text-center py-10 font-label-mono text-on-surface-variant/75">
            NO ROADMAP LEVELS CONFORM TO CURRENT SEARCH METRICS.
          </div>
        ) : (
          (() => {
            let lastPhaseIndex = -1;
            return filteredQuests.map((quest) => {
              const isFirstInPhase = quest.phase !== lastPhaseIndex;
              if (isFirstInPhase) {
                lastPhaseIndex = quest.phase;
              }
              const p = PHASES[quest.phase];
              const isExp = expandedQuestId === quest.questId;

              return (
                <div key={quest.questId} className="space-y-4">
                  {/* Phase Section Header */}
                  {isFirstInPhase && (
                    <div className="flex items-center gap-4 mb-4 mt-8">
                      <div className="h-px bg-outline-variant/30 flex-1"></div>
                      <div 
                        className="font-label-mono text-label-mono flex items-center gap-2 border px-4 py-1.5 rounded bg-surface/50"
                        style={{ color: p.color, borderColor: `${p.color}30`, backgroundColor: `${p.color}10` }}
                      >
                        <span className="material-symbols-outlined text-[14px]">swords</span>
                        {p.name.toUpperCase()}
                      </div>
                      <div className="h-px bg-outline-variant/30 flex-1"></div>
                    </div>
                  )}

                  {/* Quest Card */}
                  <div 
                    onClick={(e) => handleCardClick(quest.questId, e)}
                    className={`border rounded-lg overflow-hidden transition-all duration-300 cursor-pointer ${
                      isExp 
                        ? 'bg-[#121212] border-primary system-glow' 
                        : 'bg-[#121212]/80 border-outline-variant/40 hover:border-primary/60'
                    } ${quest.isCompleted ? 'opacity-60 hover:opacity-90' : ''}`}
                  >
                    <div className="p-4 flex gap-4">
                      {/* Checkmark and Rank badge */}
                      <div className="flex flex-col items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded border flex items-center justify-center font-status-number text-[16px] font-bold"
                          style={{ 
                            color: p.color, 
                            borderColor: `${p.color}40`, 
                            backgroundColor: `${p.color}15` 
                          }}
                        >
                          L{quest.questId}
                        </div>
                        <button 
                          onClick={() => onToggleQuest(quest.questId)}
                          className={`check-toggle w-6 h-6 rounded border flex items-center justify-center transition-colors duration-300 ${
                            quest.isCompleted 
                              ? 'border-primary bg-primary/20 hover:bg-primary/30' 
                              : 'border-outline-variant/50 hover:border-primary hover:bg-primary/10'
                          }`}
                        >
                          <span className={`material-symbols-outlined text-[14px] font-bold ${
                            quest.isCompleted ? 'text-primary' : 'text-transparent'
                          }`}>
                            check
                          </span>
                        </button>
                      </div>

                      {/* Title & Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <h3 className="font-body-md text-[16px] text-on-surface font-semibold truncate">
                              {quest.title}
                            </h3>
                            <p className="font-body-md text-[13px] text-on-surface-variant truncate mt-0.5">
                              {quest.sub}
                            </p>
                          </div>
                          {isExp && (
                            <span className="font-label-mono text-[9px] px-2 py-0.5 bg-primary/10 border border-primary/30 rounded text-primary tracking-wider shrink-0 uppercase animate-pulse">
                              ACTIVE MANUAL
                            </span>
                          )}
                        </div>

                        {/* Objectives Pills (Short View) */}
                        {!isExp && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {quest.skills.slice(0, 3).map((skill, sIdx) => (
                              <span 
                                key={sIdx}
                                className="text-[10px] font-label-mono px-2 py-0.5 bg-surface-container-highest rounded text-on-surface-variant border border-outline-variant/30"
                              >
                                {skill}
                              </span>
                            ))}
                            {quest.skills.length > 3 && (
                              <span className="text-[10px] font-label-mono px-2 py-0.5 bg-surface-container-highest rounded text-on-surface-variant border border-outline-variant/30">
                                +{quest.skills.length - 3} MORE
                              </span>
                            )}
                          </div>
                        )}

                        {/* Expanded details */}
                        {isExp && (
                          <div className="mt-4 pt-4 border-t border-outline-variant/30 grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-active">
                            <div>
                              <h4 className="font-label-mono text-[11px] text-secondary tracking-widest mb-2 uppercase">
                                Quest Objectives
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
                                Loot / Resources
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
                </div>
              );
            });
          })()
        )}
      </div>

      <div className="mt-12 text-center pb-8 md:pb-0">
        <p className="font-label-mono text-[10px] text-on-surface-variant/40 tracking-widest uppercase">
          System Initialization Complete. Awaiting Player Action.
        </p>
      </div>
    </div>
  );
}

export default Roadmap;
