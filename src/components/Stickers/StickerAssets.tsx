import React from 'react';

export interface StickerDefinition {
  type: string;
  name: string;
  category: 'mascot' | 'milestone' | 'study';
  label: string;
  renderSvg: (scale?: number) => React.ReactNode;
}

export const STICKER_DEFINITIONS: Record<string, StickerDefinition> = {
  pup_cheer: {
    type: 'pup_cheer',
    name: 'Cheering Pup',
    category: 'mascot',
    label: 'Great Job! / Gut gemacht!',
    renderSvg: (scale = 1) => (
      <svg width={84 * scale} height={84 * scale} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-md select-none">
        {/* Soft Circular Glow */}
        <circle cx="50" cy="50" r="46" fill="#FFF8E7" stroke="#F6D59C" strokeWidth="2.5" strokeDasharray="3 3" />
        
        {/* Puppy Head */}
        <ellipse cx="50" cy="46" rx="28" ry="24" fill="#E8A952" />
        <ellipse cx="50" cy="50" rx="18" ry="15" fill="#FDF3DB" />
        
        {/* Floppy Ears */}
        <path d="M 24 34 C 15 36, 12 56, 20 62 C 26 66, 30 52, 28 42 Z" fill="#C98632" />
        <path d="M 76 34 C 85 36, 88 56, 80 62 C 74 66, 70 52, 72 42 Z" fill="#C98632" />
        
        {/* Happy Eyes */}
        <path d="M 40 40 Q 44 35 48 40" stroke="#3A2818" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M 52 40 Q 56 35 60 40" stroke="#3A2818" strokeWidth="3" strokeLinecap="round" fill="none" />
        
        {/* Cute Nose & Smile */}
        <ellipse cx="50" cy="46" rx="5" ry="3.5" fill="#3A2818" />
        <path d="M 50 49.5 Q 46 54 43 51" stroke="#3A2818" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M 50 49.5 Q 54 54 57 51" stroke="#3A2818" strokeWidth="2" strokeLinecap="round" fill="none" />
        
        {/* Little Pink Tongue */}
        <path d="M 48 53 C 48 58, 52 58, 52 53 Z" fill="#FF8A8A" />
        
        {/* Blushing Cheeks */}
        <circle cx="34" cy="46" r="4" fill="#FFB7B7" opacity="0.8" />
        <circle cx="66" cy="46" r="4" fill="#FFB7B7" opacity="0.8" />
        
        {/* Banner */}
        <rect x="10" y="72" width="80" height="20" rx="10" fill="#D97736" stroke="#FFFFFF" strokeWidth="1.5" />
        <text x="50" y="86" textAnchor="middle" fill="#FFFFFF" fontSize="9.5" fontWeight="bold" fontFamily="system-ui, sans-serif">
          Great Job! 🐾
        </text>
      </svg>
    ),
  },

  paw_done: {
    type: 'paw_done',
    name: 'Paw Checkmark',
    category: 'milestone',
    label: 'Done! / Erledigt',
    renderSvg: (scale = 1) => (
      <svg width={78 * scale} height={78 * scale} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-md select-none">
        <circle cx="50" cy="50" r="44" fill="#E8F8EE" stroke="#A3D9B5" strokeWidth="2.5" />
        
        {/* Main Paw Pad */}
        <path d="M 50 42 C 38 42, 34 56, 42 66 C 46 71, 54 71, 58 66 C 66 56, 62 42, 50 42 Z" fill="#2E7D47" />
        
        {/* 4 Toe Pads */}
        <ellipse cx="33" cy="38" rx="6.5" ry="9" transform="rotate(-20 33 38)" fill="#2E7D47" />
        <ellipse cx="44" cy="30" rx="6" ry="8.5" transform="rotate(-8 44 30)" fill="#2E7D47" />
        <ellipse cx="56" cy="30" rx="6" ry="8.5" transform="rotate(8 56 30)" fill="#2E7D47" />
        <ellipse cx="67" cy="38" rx="6.5" ry="9" transform="rotate(20 67 38)" fill="#2E7D47" />
        
        {/* Checkmark Badge */}
        <circle cx="72" cy="68" r="14" fill="#16A34A" stroke="#FFFFFF" strokeWidth="2.5" />
        <path d="M 66 68 L 70 72 L 78 64" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        
        {/* Tiny Banner */}
        <rect x="20" y="78" width="46" height="15" rx="7.5" fill="#2E7D47" />
        <text x="43" y="89" textAnchor="middle" fill="#FFFFFF" fontSize="8.5" fontWeight="bold" fontFamily="system-ui, sans-serif">
          DONE! ✨
        </text>
      </svg>
    ),
  },

  bone_important: {
    type: 'bone_important',
    name: 'Important Bone Pin',
    category: 'study',
    label: 'Wichtig! / Important',
    renderSvg: (scale = 1) => (
      <svg width={82 * scale} height={82 * scale} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-md select-none">
        <circle cx="50" cy="50" r="44" fill="#FFF2F2" stroke="#FCA5A5" strokeWidth="2.5" />
        
        {/* Golden Dog Bone */}
        <g transform="rotate(-15 50 44)">
          <rect x="30" y="40" width="40" height="12" rx="4" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5" />
          <circle cx="28" cy="38" r="7" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5" />
          <circle cx="28" cy="54" r="7" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5" />
          <circle cx="72" cy="38" r="7" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5" />
          <circle cx="72" cy="54" r="7" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5" />
        </g>
        
        {/* Red Pin Badge */}
        <rect x="12" y="68" width="76" height="20" rx="10" fill="#DC2626" stroke="#FFFFFF" strokeWidth="1.5" />
        <text x="50" y="82" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold" fontFamily="system-ui, sans-serif">
          ⚠️ IMPORTANT!
        </text>
      </svg>
    ),
  },

  idea_bulb: {
    type: 'idea_bulb',
    name: 'Idea Lightbulb',
    category: 'study',
    label: 'Aha! Idea',
    renderSvg: (scale = 1) => (
      <svg width={78 * scale} height={78 * scale} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-md select-none">
        <circle cx="50" cy="50" r="44" fill="#FFFDEB" stroke="#FDE047" strokeWidth="2.5" />
        
        {/* Glow Sparks */}
        <path d="M 50 14 L 50 20 M 24 26 L 29 30 M 76 26 L 71 30 M 18 50 L 24 50 M 82 50 L 76 50" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
        
        {/* Lightbulb Body */}
        <path d="M 36 44 C 36 34, 42 26, 50 26 C 58 26, 64 34, 64 44 C 64 51, 59 55, 58 60 L 42 60 C 41 55, 36 51, 36 44 Z" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
        
        {/* Bulb Base */}
        <rect x="44" y="62" width="12" height="4" rx="1" fill="#9CA3AF" />
        <rect x="45" y="67" width="10" height="3" rx="1" fill="#9CA3AF" />
        <path d="M 47 71 L 53 71" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" />
        
        {/* Cute Face on Bulb */}
        <circle cx="45" cy="42" r="2" fill="#3A2818" />
        <circle cx="55" cy="42" r="2" fill="#3A2818" />
        <path d="M 48 47 Q 50 49 52 47" stroke="#3A2818" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        
        {/* Banner */}
        <rect x="22" y="76" width="56" height="16" rx="8" fill="#D97706" />
        <text x="50" y="87.5" textAnchor="middle" fill="#FFFFFF" fontSize="8.5" fontWeight="bold" fontFamily="system-ui, sans-serif">
          💡 AHA! IDEA
        </text>
      </svg>
    ),
  },

  study_star: {
    type: 'study_star',
    name: 'Study Star',
    category: 'milestone',
    label: 'Mastered / 100%',
    renderSvg: (scale = 1) => (
      <svg width={78 * scale} height={78 * scale} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-md select-none">
        <circle cx="50" cy="50" r="44" fill="#FEFCE8" stroke="#FEF08A" strokeWidth="2.5" />
        
        {/* 5-Point Star */}
        <polygon
          points="50,18 58,36 78,38 63,52 68,72 50,61 32,72 37,52 22,38 42,36"
          fill="#FACC15"
          stroke="#CA8A04"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        
        {/* Cute Eyes & Smile */}
        <circle cx="44" cy="44" r="2.2" fill="#422006" />
        <circle cx="56" cy="44" r="2.2" fill="#422006" />
        <path d="M 47 49 Q 50 53 53 49" stroke="#422006" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <circle cx="39" cy="47" r="2" fill="#F87171" opacity="0.7" />
        <circle cx="61" cy="47" r="2" fill="#F87171" opacity="0.7" />
        
        {/* Banner */}
        <rect x="20" y="75" width="60" height="17" rx="8.5" fill="#CA8A04" />
        <text x="50" y="87" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold" fontFamily="system-ui, sans-serif">
          ⭐ STAR NOTE
        </text>
      </svg>
    ),
  },

  study_book: {
    type: 'study_book',
    name: 'Study Book',
    category: 'study',
    label: 'Grammar / Vocabulary',
    renderSvg: (scale = 1) => (
      <svg width={78 * scale} height={78 * scale} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-md select-none">
        <circle cx="50" cy="50" r="44" fill="#EFF6FF" stroke="#BFDBFE" strokeWidth="2.5" />
        
        {/* Open Book */}
        <path d="M 50 34 C 42 30, 26 31, 22 36 L 22 66 C 26 62, 42 61, 50 66 Z" fill="#FFFFFF" stroke="#3B82F6" strokeWidth="2" />
        <path d="M 50 34 C 58 30, 74 31, 78 36 L 78 66 C 74 62, 58 61, 50 66 Z" fill="#FFFFFF" stroke="#3B82F6" strokeWidth="2" />
        <path d="M 50 34 L 50 66" stroke="#2563EB" strokeWidth="2" />
        
        {/* Bookmark Ribbon */}
        <path d="M 50 34 L 50 52 L 46 48 L 42 52 L 42 34" fill="#EF4444" />
        
        {/* Little Paw Stamp on page */}
        <circle cx="64" cy="48" r="3" fill="#93C5FD" />
        <circle cx="59" cy="44" r="1.5" fill="#93C5FD" />
        <circle cx="64" cy="42" r="1.5" fill="#93C5FD" />
        <circle cx="69" cy="44" r="1.5" fill="#93C5FD" />
        
        {/* Banner */}
        <rect x="22" y="75" width="56" height="17" rx="8.5" fill="#2563EB" />
        <text x="50" y="87" textAnchor="middle" fill="#FFFFFF" fontSize="8.5" fontWeight="bold" fontFamily="system-ui, sans-serif">
          📚 STUDY RULE
        </text>
      </svg>
    ),
  },

  coffee_mug: {
    type: 'coffee_mug',
    name: 'Cozy Coffee / Tea',
    category: 'study',
    label: 'Focus Break',
    renderSvg: (scale = 1) => (
      <svg width={78 * scale} height={78 * scale} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-md select-none">
        <circle cx="50" cy="50" r="44" fill="#FDF4ED" stroke="#FBD5BE" strokeWidth="2.5" />
        
        {/* Steam */}
        <path d="M 44 26 Q 40 20 44 16" stroke="#D97736" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6" />
        <path d="M 50 28 Q 54 22 50 18" stroke="#D97736" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.8" />
        <path d="M 56 26 Q 52 20 56 16" stroke="#D97736" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6" />
        
        {/* Mug Body */}
        <rect x="34" y="32" width="32" height="34" rx="8" fill="#FFFFFF" stroke="#8C4A20" strokeWidth="2" />
        <ellipse cx="50" cy="34" rx="16" ry="4" fill="#D97736" />
        
        {/* Mug Handle */}
        <path d="M 66 38 C 76 38, 76 56, 66 58" stroke="#8C4A20" strokeWidth="3" strokeLinecap="round" fill="none" />
        
        {/* Puppy Face on Mug */}
        <circle cx="45" cy="48" r="1.8" fill="#8C4A20" />
        <circle cx="55" cy="48" r="1.8" fill="#8C4A20" />
        <ellipse cx="50" cy="52" rx="2.5" ry="1.8" fill="#8C4A20" />
        
        {/* Banner */}
        <rect x="22" y="75" width="56" height="17" rx="8.5" fill="#8C4A20" />
        <text x="50" y="87" textAnchor="middle" fill="#FFFFFF" fontSize="8.5" fontWeight="bold" fontFamily="system-ui, sans-serif">
          ☕ COZY BREAK
        </text>
      </svg>
    ),
  },

  trophy: {
    type: 'trophy',
    name: 'Puppy Trophy Cup',
    category: 'milestone',
    label: 'Milestone Champion',
    renderSvg: (scale = 1) => (
      <svg width={78 * scale} height={78 * scale} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-md select-none">
        <circle cx="50" cy="50" r="44" fill="#FFFBEB" stroke="#FDE68A" strokeWidth="2.5" />
        
        {/* Trophy Cup */}
        <path d="M 34 26 L 66 26 L 62 50 C 60 58, 40 58, 38 50 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="2" />
        <path d="M 34 32 C 24 32, 24 46, 36 48" stroke="#B45309" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M 66 32 C 76 32, 76 46, 64 48" stroke="#B45309" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        
        {/* Trophy Stem & Base */}
        <rect x="47" y="56" width="6" height="8" fill="#B45309" />
        <path d="M 38 64 L 62 64 L 66 70 L 34 70 Z" fill="#78350F" stroke="#B45309" strokeWidth="1.5" />
        
        {/* Star on Cup */}
        <polygon points="50,34 52,39 57,39 53,42 55,47 50,44 45,47 47,42 43,39 48,39" fill="#FEF08A" />
        
        {/* Banner */}
        <rect x="22" y="75" width="56" height="17" rx="8.5" fill="#B45309" />
        <text x="50" y="87" textAnchor="middle" fill="#FFFFFF" fontSize="8.5" fontWeight="bold" fontFamily="system-ui, sans-serif">
          🏆 CHAMPION!
        </text>
      </svg>
    ),
  },
};
