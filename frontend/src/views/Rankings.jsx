import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Rankings({ user }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('/api/leaderboard');
      setLeaderboard(res.data);
    } catch (err) {
      console.error(err);
      setError('System Error: Failed to fetch ranking indexes.');
    } finally {
      setLoading(false);
    }
  };

  const getRankName = (level) => {
    if (level < 17) return 'F-RANK';
    if (level < 40) return 'E-RANK';
    if (level < 55) return 'D-RANK';
    if (level < 75) return 'C-RANK';
    if (level < 90) return 'B-RANK';
    if (level < 100) return 'A-RANK';
    return 'S-RANK';
  };

  return (
    <div className="space-y-8 animate-fade-in-active">
      {/* Title */}
      <div className="border-b border-outline-variant/30 pb-4">
        <div className="font-label-mono text-label-mono text-primary uppercase tracking-widest flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px]">leaderboard</span>
          AWAKENED INDEX
        </div>
        <h1 className="font-headline-md text-headline-md text-white mt-1">
          GLOBAL LEADERBOARD RANKINGS
        </h1>
        <p className="font-body-md text-on-surface-variant text-[14px]">
          Compare your hunter stats, clear status, and level against other active players connected to this node.
        </p>
      </div>

      {/* Rankings Table Card */}
      <div className="bg-[#121212]/80 border border-outline-variant/30 rounded-lg overflow-hidden scanline relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-transparent to-secondary opacity-50"></div>
        
        {loading ? (
          <div className="text-center py-16 font-label-mono text-on-surface-variant/75 flex flex-col items-center gap-2">
            <span className="material-symbols-outlined animate-spin text-[32px] text-primary">sync</span>
            QUERYING LEADERBOARD INDEXES...
          </div>
        ) : error ? (
          <div className="text-center py-16 font-label-mono text-error/85 flex flex-col items-center gap-2">
            <span className="material-symbols-outlined text-[48px]">warning</span>
            {error}
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="text-center py-16 font-label-mono text-on-surface-variant/75">
            NO HUNTERS DETECTED IN NODE DATABASES.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/20 bg-[#0c0c0c] text-on-surface-variant font-label-mono text-[10px] tracking-widest uppercase">
                  <th className="py-4 px-6 text-center w-20">Rank</th>
                  <th className="py-4 px-6">Hunter</th>
                  <th className="py-4 px-6 text-center">Class</th>
                  <th className="py-4 px-6 text-center">Level</th>
                  <th className="py-4 px-6 text-center">Quests Cleared</th>
                  <th className="py-4 px-6 hidden md:table-cell">Primary Attribute</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10 font-body-md text-[14px]">
                {leaderboard.map((hunter, index) => {
                  const position = index + 1;
                  const isSelf = String(hunter._id) === String(user._id);
                  
                  // Compute primary attribute
                  const stats = hunter.stats || { intelligence: 0, strength: 0, agility: 0, luck: 0 };
                  const maxVal = Math.max(stats.intelligence, stats.strength, stats.agility, stats.luck);
                  let primaryAttr = 'None';
                  if (maxVal > 0) {
                    if (stats.intelligence === maxVal) primaryAttr = 'Intelligence';
                    else if (stats.strength === maxVal) primaryAttr = 'Strength';
                    else if (stats.agility === maxVal) primaryAttr = 'Agility';
                    else if (stats.luck === maxVal) primaryAttr = 'Luck';
                  }

                  // Neon Styling for top ranks
                  let rankColor = 'text-on-surface-variant';
                  let rankGlow = '';
                  if (position === 1) {
                    rankColor = 'text-[#ffe57f] font-extrabold';
                    rankGlow = 'bg-[#ffe57f]/10 border border-[#ffe57f]/30';
                  } else if (position === 2) {
                    rankColor = 'text-secondary font-bold';
                    rankGlow = 'bg-secondary/10 border border-secondary/30';
                  } else if (position === 3) {
                    rankColor = 'text-primary-container font-bold';
                    rankGlow = 'bg-primary/10 border border-primary/30';
                  }

                  return (
                    <tr 
                      key={hunter._id}
                      className={`transition-colors duration-200 ${
                        isSelf 
                          ? 'bg-primary/5 hover:bg-primary/10 border-l-2 border-l-primary' 
                          : 'hover:bg-surface-variant/20'
                      }`}
                    >
                      {/* Rank Position */}
                      <td className="py-4 px-6 text-center">
                        <div className={`w-8 h-8 rounded flex items-center justify-center font-status-number text-[14px] mx-auto ${rankColor} ${rankGlow}`}>
                          {position}
                        </div>
                      </td>

                      {/* Hunter username */}
                      <td className="py-4 px-6 font-semibold">
                        <div className="flex items-center gap-2">
                          <span className={`truncate max-w-[150px] md:max-w-xs ${isSelf ? 'text-primary' : 'text-white'}`}>
                            {hunter.username}
                          </span>
                          {isSelf && (
                            <span className="font-label-mono text-[8px] px-1.5 py-0.5 rounded bg-primary/20 border border-primary/40 text-primary tracking-wider uppercase">
                              YOU
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Class */}
                      <td className="py-4 px-6 text-center font-label-mono text-[11px] text-on-surface-variant">
                        {getRankName(hunter.level)}
                      </td>

                      {/* Level */}
                      <td className="py-4 px-6 text-center font-status-number text-primary text-[16px]">
                        {hunter.level}
                      </td>

                      {/* Quests Cleared */}
                      <td className="py-4 px-6 text-center font-label-mono text-[12px] text-on-surface">
                        {hunter.completedQuestsCount}
                      </td>

                      {/* Primary attribute */}
                      <td className="py-4 px-6 hidden md:table-cell text-on-surface-variant/80 font-label-mono text-[11px]">
                        {primaryAttr !== 'None' ? (
                          <span className={`px-2 py-1 rounded bg-surface-container-highest border border-outline-variant/30 ${
                            primaryAttr === 'Intelligence' ? 'text-[#534AB7]' :
                            primaryAttr === 'Strength' ? 'text-[#185FA5]' :
                            primaryAttr === 'Agility' ? 'text-[#BA7517]' : 'text-[#993C1D]'
                          }`}>
                            {primaryAttr.toUpperCase()}
                          </span>
                        ) : (
                          <span className="text-on-surface-variant/30">N/A</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Rankings;
