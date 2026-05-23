import React from 'react';

const INVENTORY_ITEMS = [
  {
    name: "Silicon Badge",
    description: "Granted to hunters who have conquered Phase 1 Foundations. Demonstrates baseline competency in command lines and programming structure.",
    icon: "workspace_premium",
    requirement: "Complete all levels of Phase 1 (Foundations)",
    color: "#534AB7",
  },
  {
    name: "Keyboard of Truth",
    description: "Legendary device rumored to execute CLI commands with zero keystroke latency. Unlocks with Phase 1 completion.",
    icon: "keyboard",
    requirement: "Complete all levels of Phase 1 (Foundations)",
    color: "#d8b9ff",
  },
  {
    name: "Web Shield",
    description: "An advanced defensive firewall module shielding your interface from CSRF and CORS script warnings. Unlocked by conquering web structures.",
    icon: "shield",
    requirement: "Complete all levels of Phase 2 (Fullstack Web Dev)",
    color: "#185FA5",
  },
  {
    name: "Styling Cloak",
    description: "Shimmering threads woven from CSS selectors. Confers extreme visual charm on frontend models.",
    icon: "palette",
    requirement: "Complete all levels of Phase 2 (Fullstack Web Dev)",
    color: "#ffeafb",
  },
  {
    name: "Sword of Solana",
    description: "Forged in the fires of Proof of History. Generates high compute transaction streams. Unlocks at Level 50.",
    icon: "colorize", // Swords-like icon
    requirement: "Reach Player Level 50",
    color: "#14f195",
  },
  {
    name: "Monarch Crown",
    description: "The ultimate developer accolade. Confers total supremacy over the Solana ecosystem and smart contract development.",
    icon: "emoji_events", // Crown-like icon
    requirement: "Conquer all 100 System Levels",
    color: "#ffe57f",
  }
];

function Inventory({ user }) {
  const userInventory = new Set(user.inventory || []);

  return (
    <div className="space-y-8 animate-fade-in-active">
      {/* Title */}
      <div className="border-b border-outline-variant/30 pb-4">
        <div className="font-label-mono text-label-mono text-primary uppercase tracking-widest flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px]">inventory_2</span>
          HUNTER BACKPACK
        </div>
        <h1 className="font-headline-md text-headline-md text-white mt-1">
          EQUIPPED GEAR & ACHIEVEMENTS
        </h1>
        <p className="font-body-md text-on-surface-variant text-[14px]">
          Inspect looted equipment unlocked by completing milestones in your leveling journey.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {INVENTORY_ITEMS.map((item, idx) => {
          const isUnlocked = userInventory.has(item.name);
          return (
            <div 
              key={idx}
              className={`relative border rounded-lg p-5 flex flex-col justify-between transition-all duration-300 ${
                isUnlocked 
                  ? 'bg-[#121212] border-outline-variant/50 system-glow shadow-[0_4px_15px_rgba(0,0,0,0.4)]' 
                  : 'bg-[#0a0a0a] border-outline-variant/20 opacity-40'
              }`}
            >
              {/* Scanline for unlocked items */}
              {isUnlocked && <div className="absolute inset-0 scanline pointer-events-none rounded-lg opacity-40"></div>}

              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div 
                    className="w-12 h-12 rounded border flex items-center justify-center"
                    style={{ 
                      borderColor: isUnlocked ? `${item.color}50` : 'rgba(255,255,255,0.05)', 
                      backgroundColor: isUnlocked ? `${item.color}15` : 'transparent',
                      color: isUnlocked ? item.color : '#444'
                    }}
                  >
                    <span className="material-symbols-outlined text-[24px]">{item.icon}</span>
                  </div>
                  <span className={`font-label-mono text-[9px] px-2 py-0.5 rounded tracking-widest uppercase border ${
                    isUnlocked 
                      ? 'bg-primary/10 border-primary/30 text-primary animate-pulse' 
                      : 'bg-surface-container-highest border-outline-variant/30 text-on-surface-variant/40'
                  }`}>
                    {isUnlocked ? 'UNLOCKED' : 'LOCKED'}
                  </span>
                </div>

                {/* Name & Desc */}
                <h3 className={`font-headline-md text-[18px] mb-2 ${isUnlocked ? 'text-white' : 'text-on-surface-variant/50'}`}>
                  {item.name}
                </h3>
                <p className="font-body-md text-[13px] text-on-surface-variant leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Requirement Label */}
              <div className="mt-6 pt-4 border-t border-outline-variant/20">
                <span className="block font-label-mono text-[9px] text-on-surface-variant/50 uppercase tracking-wider mb-1">
                  UNLOCK METRIC
                </span>
                <span className={`font-label-mono text-[11px] ${isUnlocked ? 'text-secondary-fixed' : 'text-on-surface-variant/40'}`}>
                  {item.requirement}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Inventory;
