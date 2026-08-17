import React, { useState } from 'react';
import { useNoteZustandStore } from '../../stores/useNoteZustandStore';
import { STICKER_DEFINITIONS, StickerDefinition } from './StickerAssets';
import { X, Sparkles, Plus, Check } from 'lucide-react';

interface StickerDeckDrawerProps {
  noteId: string;
}

export const StickerDeckDrawer: React.FC<StickerDeckDrawerProps> = ({ noteId }) => {
  const { isStickerDrawerOpen, setStickerDrawerOpen, addMascotSticker } = useNoteZustandStore();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'mascot' | 'milestone' | 'study'>('all');
  const [lastStampedId, setLastStampedId] = useState<string | null>(null);

  if (!isStickerDrawerOpen) return null;

  const stickerList: StickerDefinition[] = Object.values(STICKER_DEFINITIONS).filter((stk) =>
    selectedCategory === 'all' ? true : stk.category === selectedCategory
  );

  const handleStampSticker = (type: string) => {
    // Generate slight random offset around center-right of paper
    const randomX = Math.floor(Math.random() * 200) + 420;
    const randomY = Math.floor(Math.random() * 240) + 120;
    const randomRotation = Math.floor(Math.random() * 12) - 6;

    addMascotSticker(noteId, type, randomX, randomY, 1.0, randomRotation);
    setLastStampedId(type);
    setTimeout(() => setLastStampedId(null), 1200);
  };

  return (
    <div
      className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-[#FFFDF8] border-l border-theme-border shadow-2xl flex flex-col animate-in slide-in-from-right duration-200"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="p-4 border-b border-theme-border/80 bg-theme-sidebar/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-theme-accent text-white flex items-center justify-center shadow-xs text-base">
            🐾
          </div>
          <div>
            <h3 className="text-sm font-bold font-display text-theme-text flex items-center gap-1.5">
              <span>Mascot Sticker Box</span>
              <span className="text-[10px] font-semibold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-200">
                8 Stamps
              </span>
            </h3>
            <p className="text-[11px] text-[#7E7267]">Click any mascot to stamp onto your desk paper</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setStickerDrawerOpen(false)}
          className="p-1.5 rounded-xl text-[#7E7267] hover:text-theme-text hover:bg-black/5 transition-colors cursor-pointer"
          title="Close Sticker Box"
        >
          <X size={18} />
        </button>
      </div>

      {/* Category Filter Chips */}
      <div className="px-4 py-2.5 border-b border-theme-border/60 bg-white flex items-center gap-1.5 overflow-x-auto text-xs">
        <button
          type="button"
          onClick={() => setSelectedCategory('all')}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-theme-accent text-white shadow-2xs'
              : 'text-[#675C51] hover:bg-theme-sidebar/60'
          }`}
        >
          All
        </button>
        <button
          type="button"
          onClick={() => setSelectedCategory('mascot')}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            selectedCategory === 'mascot'
              ? 'bg-theme-accent text-white shadow-2xs'
              : 'text-[#675C51] hover:bg-theme-sidebar/60'
          }`}
        >
          🐶 Mascot
        </button>
        <button
          type="button"
          onClick={() => setSelectedCategory('milestone')}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            selectedCategory === 'milestone'
              ? 'bg-theme-accent text-white shadow-2xs'
              : 'text-[#675C51] hover:bg-theme-sidebar/60'
          }`}
        >
          ⭐ Milestones
        </button>
        <button
          type="button"
          onClick={() => setSelectedCategory('study')}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            selectedCategory === 'study'
              ? 'bg-theme-accent text-white shadow-2xs'
              : 'text-[#675C51] hover:bg-theme-sidebar/60'
          }`}
        >
          📚 Study Badges
        </button>
      </div>

      {/* Stickers Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-3">
          {stickerList.map((stk) => {
            const isJustStamped = lastStampedId === stk.type;

            return (
              <div
                key={stk.type}
                onClick={() => handleStampSticker(stk.type)}
                className={`relative group flex flex-col items-center p-3 rounded-2xl border bg-white hover:bg-amber-50/50 hover:border-theme-accent/60 transition-all duration-150 cursor-pointer shadow-xs hover:shadow-md ${
                  isJustStamped ? 'ring-2 ring-theme-accent scale-95 bg-amber-50' : ''
                }`}
              >
                {/* Sticker Render */}
                <div className="w-20 h-20 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  {stk.renderSvg(0.85)}
                </div>

                {/* Sticker Info */}
                <div className="mt-2 text-center w-full">
                  <span className="block text-xs font-bold text-theme-text truncate">{stk.name}</span>
                  <span className="block text-[10px] text-[#8E8276] truncate">{stk.label}</span>
                </div>

                {/* Quick Add Overlay Pill */}
                <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[11px] font-bold text-theme-accent bg-amber-100/90 px-2 py-0.5 rounded-full border border-amber-200">
                  {isJustStamped ? (
                    <>
                      <Check size={11} />
                      <span>Stamped!</span>
                    </>
                  ) : (
                    <>
                      <Plus size={11} />
                      <span>Stamp on Note</span>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-theme-border/80 bg-theme-sidebar/30 flex items-center justify-between text-xs text-[#7E7267]">
        <span className="flex items-center gap-1">
          <Sparkles size={13} className="text-theme-accent" />
          <span>Drag placed stickers to move & scale</span>
        </span>
        <button
          type="button"
          onClick={() => setStickerDrawerOpen(false)}
          className="px-3 py-1 bg-theme-accent text-white font-bold rounded-xl hover:bg-[#C26325] transition-colors cursor-pointer text-xs shadow-xs"
        >
          Done
        </button>
      </div>
    </div>
  );
};
