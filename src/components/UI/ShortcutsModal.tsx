import React, { useEffect } from 'react';
import { X, Command, PenTool, Highlighter, Table, Keyboard } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
  const cmdKey = isMac ? '⌘' : 'Ctrl';
  const optKey = isMac ? '⌥' : 'Alt';
  const shiftKey = isMac ? '⇧' : 'Shift';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl max-h-[85vh] bg-[#FFFDF9] rounded-3xl border border-theme-border shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-theme-border/80 bg-theme-sidebar/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-theme-accent text-white flex items-center justify-center shadow-xs">
              <Keyboard size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold font-display text-theme-text flex items-center gap-2">
                <span>Tools & Keyboard Shortcuts Guide</span>
                <span className="text-[10px] font-semibold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-200">
                  🐾 Cub Pad Desk
                </span>
              </h3>
              <p className="text-xs text-[#7E7267]">Quick cheatsheet for note editing, vector lines, and study tools</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#7E7267] hover:text-theme-text hover:bg-black/5 transition-colors cursor-pointer"
            title="Close (Esc)"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Section 1: Sticky Notes & Mascot Stickers */}
          <div className="bg-[#FFF8E7] p-4 rounded-2xl border border-amber-200/80">
            <div className="flex items-center gap-2 text-sm font-bold text-amber-950 mb-3">
              <span className="text-base">🐾</span>
              <span>Floating Sticky Notes & Mascot Sticker Deck</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-amber-200/60">
                <span className="text-[#5D5144]">New Sticky Memo</span>
                <span className="text-[11px] text-[#7E7267]">+ Sticky Note / Double-click margins</span>
              </div>
              <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-amber-200/60">
                <span className="text-[#5D5144]">Pastel Palettes</span>
                <span className="text-[11px] text-[#7E7267]">Yellow, Coral, Mint, Blue, Lavender</span>
              </div>
              <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-amber-200/60">
                <span className="text-[#5D5144]">Mascot Sticker Box</span>
                <span className="text-[11px] text-[#7E7267]">Click "Stickers" in toolbar to stamp</span>
              </div>
              <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-amber-200/60">
                <span className="text-[#5D5144]">Scale & Move Stickers</span>
                <span className="text-[11px] text-[#7E7267]">Drag to move; hover for (+ / -) scale</span>
              </div>
            </div>
          </div>

          {/* Section 2: Vector Drawing Overlay */}
          <div className="bg-[#FAF5EC] p-4 rounded-2xl border border-theme-border/80">
            <div className="flex items-center gap-2 text-sm font-bold text-theme-text mb-3">
              <PenTool size={16} className="text-theme-accent" />
              <span>Vector Drawing Overlay (Lines & Arrows)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-theme-border/60">
                <span className="text-[#5D5144]">Straight Underline</span>
                <span className="text-[11px] text-[#7E7267]">Auto-snaps ±6° horizontal</span>
              </div>
              <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-theme-border/60">
                <span className="text-[#5D5144]">Concept Arrow</span>
                <span className="text-[11px] text-[#7E7267]">Hand-drawn ink arrowhead</span>
              </div>
              <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-theme-border/60">
                <span className="text-[#5D5144]">45° / 90° Angle Lock</span>
                <kbd className="px-2 py-0.5 font-mono text-[11px] bg-amber-100/70 text-amber-900 border border-amber-200/80 rounded-md font-semibold">
                  Hold {shiftKey}
                </kbd>
              </div>
              <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-theme-border/60">
                <span className="text-[#5D5144]">Undo Last Shape</span>
                <kbd className="px-2 py-0.5 font-mono text-[11px] bg-amber-100/70 text-amber-900 border border-amber-200/80 rounded-md font-semibold">
                  {cmdKey} + Z
                </kbd>
              </div>
              <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-theme-border/60">
                <span className="text-[#5D5144]">Interactive Eraser</span>
                <span className="text-[11px] text-[#7E7267]">Click any line to erase</span>
              </div>
              <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-theme-border/60">
                <span className="text-[#5D5144]">Exit Drawing Mode</span>
                <kbd className="px-2 py-0.5 font-mono text-[11px] bg-amber-100/70 text-amber-900 border border-amber-200/80 rounded-md font-semibold">
                  Esc / Done
                </kbd>
              </div>
            </div>
          </div>

          {/* Section 3: Rich Text Formatting */}
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-theme-text mb-3">
              <Command size={16} className="text-theme-accent" />
              <span>Editor & Text Formatting</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-theme-border/60">
                <span className="text-[#5D5144]">Bold</span>
                <kbd className="px-2 py-0.5 font-mono text-[11px] bg-theme-sidebar text-theme-text border border-theme-border rounded-md font-semibold">
                  {cmdKey} + B
                </kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-theme-border/60">
                <span className="text-[#5D5144]">Italic</span>
                <kbd className="px-2 py-0.5 font-mono text-[11px] bg-theme-sidebar text-theme-text border border-theme-border rounded-md font-semibold">
                  {cmdKey} + I
                </kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-theme-border/60">
                <span className="text-[#5D5144]">Strikethrough</span>
                <kbd className="px-2 py-0.5 font-mono text-[11px] bg-theme-sidebar text-theme-text border border-theme-border rounded-md font-semibold">
                  {cmdKey} + {shiftKey} + X
                </kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-theme-border/60">
                <span className="text-[#5D5144]">Heading 1 / 2 / 3</span>
                <kbd className="px-2 py-0.5 font-mono text-[11px] bg-theme-sidebar text-theme-text border border-theme-border rounded-md font-semibold">
                  {cmdKey} + {optKey} + 1 / 2 / 3
                </kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-theme-border/60">
                <span className="text-[#5D5144]">Bullet List</span>
                <kbd className="px-2 py-0.5 font-mono text-[11px] bg-theme-sidebar text-theme-text border border-theme-border rounded-md font-semibold">
                  {cmdKey} + {shiftKey} + 8
                </kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-theme-border/60">
                <span className="text-[#5D5144]">Numbered List</span>
                <kbd className="px-2 py-0.5 font-mono text-[11px] bg-theme-sidebar text-theme-text border border-theme-border rounded-md font-semibold">
                  {cmdKey} + {shiftKey} + 7
                </kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-theme-border/60">
                <span className="text-[#5D5144]">Quote Block</span>
                <kbd className="px-2 py-0.5 font-mono text-[11px] bg-theme-sidebar text-theme-text border border-theme-border rounded-md font-semibold">
                  {cmdKey} + {shiftKey} + 9
                </kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-theme-border/60">
                <span className="text-[#5D5144]">Code Block</span>
                <kbd className="px-2 py-0.5 font-mono text-[11px] bg-theme-sidebar text-theme-text border border-theme-border rounded-md font-semibold">
                  {cmdKey} + {optKey} + C
                </kbd>
              </div>
            </div>
          </div>

          {/* Section 4: Study Tools & Paper Customization */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Highlighter */}
            <div className="p-3.5 bg-white rounded-2xl border border-theme-border/80">
              <div className="flex items-center gap-2 text-xs font-bold text-theme-text mb-2">
                <Highlighter size={14} className="text-theme-accent" />
                <span>5 Study Highlighters</span>
              </div>
              <p className="text-[11px] text-[#7E7267] leading-relaxed">
                Highlight keywords with Yellow, Green, Blue, Purple & Pink pastel tones. Select highlighted text and click highlighter to remove.
              </p>
            </div>

            {/* Tables */}
            <div className="p-3.5 bg-white rounded-2xl border border-theme-border/80">
              <div className="flex items-center gap-2 text-xs font-bold text-theme-text mb-2">
                <Table size={14} className="text-theme-accent" />
                <span>Study Tables</span>
              </div>
              <p className="text-[11px] text-[#7E7267] leading-relaxed">
                Insert grids, Vocabulary or Comparison presets. Hover over cells to see the active table editing sub-bar.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-theme-border/80 bg-theme-sidebar/30 flex items-center justify-between text-xs text-[#7E7267]">
          <span>Tip: Press <kbd className="px-1.5 py-0.5 bg-white border border-theme-border rounded text-[10px] font-mono">?</kbd> or <kbd className="px-1.5 py-0.5 bg-white border border-theme-border rounded text-[10px] font-mono">{cmdKey} + /</kbd> anytime to open this guide</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-theme-accent text-white font-bold rounded-xl hover:bg-[#C26325] transition-colors cursor-pointer shadow-xs"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};
