import React, { useState, useRef, useEffect } from 'react';
import { useNoteZustandStore } from '../../stores/useNoteZustandStore';
import { StickyNoteItem } from '../../types/note';
import { GripVertical, X, Minus, Maximize2, Palette } from 'lucide-react';

interface StickyNoteCardProps {
  noteId: string;
  sticky: StickyNoteItem;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export const STICKY_PALETTE = [
  { id: 'yellow', hex: '#FFF3B0', border: '#E8DC88', name: 'Butter Yellow', text: '#5D4F12' },
  { id: 'coral', hex: '#FFD6D6', border: '#F2B8B8', name: 'Soft Coral', text: '#7E3030' },
  { id: 'mint', hex: '#D4EDDA', border: '#B7DFC0', name: 'Fresh Mint', text: '#1E582C' },
  { id: 'blue', hex: '#D0E8FF', border: '#B2D4F5', name: 'Sky Blue', text: '#1B4F82' },
  { id: 'lavender', hex: '#E8D7FF', border: '#D3B8F5', name: 'Lavender', text: '#592B8E' },
];

export const StickyNoteCard: React.FC<StickyNoteCardProps> = ({
  noteId,
  sticky,
  containerRef,
}) => {
  const {
    updateStickyNoteTitle,
    updateStickyNotePosition,
    updateStickyNoteText,
    updateStickyNoteColor,
    toggleStickyNoteMinimized,
    deleteStickyNote,
    fontMode,
  } = useNoteZustandStore();

  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-resize textarea height
  useEffect(() => {
    if (textareaRef.current && !sticky.isMinimized) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(56, textareaRef.current.scrollHeight)}px`;
    }
  }, [sticky.text, sticky.isMinimized]);

  // Find color config
  const colorConfig =
    STICKY_PALETTE.find((c) => c.hex.toLowerCase() === (sticky.color || '#FFF3B0').toLowerCase()) ||
    STICKY_PALETTE[0];

  // Drag handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.closest('button')) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // Ignore
    }

    setIsDragging(true);
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: sticky.x,
      initialY: sticky.y,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !dragStartRef.current) return;

    e.preventDefault();
    e.stopPropagation();

    const dx = e.clientX - dragStartRef.current.startX;
    const dy = e.clientY - dragStartRef.current.startY;

    let newX = dragStartRef.current.initialX + dx;
    let newY = dragStartRef.current.initialY + dy;

    // Boundary clamping relative to container
    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const cardWidth = sticky.isMinimized ? 160 : 200;
      const cardHeight = sticky.isMinimized ? 28 : 130;

      const maxX = Math.max(0, containerRect.width - cardWidth);
      const maxY = Math.max(0, containerRect.height - cardHeight);

      newX = Math.max(-20, Math.min(maxX + 40, newX));
      newY = Math.max(10, Math.min(maxY + 200, newY));
    }

    updateStickyNotePosition(noteId, sticky.id, Math.round(newX), Math.round(newY));
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore
    }

    setIsDragging(false);
    dragStartRef.current = null;
  };

  return (
    <div
      style={{
        transform: `translate3d(${sticky.x}px, ${sticky.y}px, 0)`,
        backgroundColor: colorConfig.hex,
        borderColor: colorConfig.border,
        color: colorConfig.text,
      }}
      className={`absolute top-0 left-0 z-30 rounded-2xl border shadow-sticky transition-shadow duration-150 select-none ${
        sticky.isMinimized ? 'w-40 sm:w-48' : 'w-48 sm:w-56'
      } ${isDragging ? 'shadow-sticky-hover scale-105 cursor-grabbing z-40' : 'cursor-default'}`}
    >
      {/* Narrow Minimalist Header Menu Bar with Editable Title */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="px-1.5 py-0.5 min-h-[22px] flex items-center justify-between border-b border-black/10 cursor-grab active:cursor-grabbing rounded-t-2xl bg-black/5 gap-0.5"
      >
        <div className="flex items-center gap-0.5 min-w-0 flex-1">
          <GripVertical size={10} className="opacity-30 flex-shrink-0 cursor-grab active:cursor-grabbing" />
          
          {/* Editable Title Input */}
          <input
            type="text"
            value={sticky.title ?? 'Memo'}
            onChange={(e) => updateStickyNoteTitle(noteId, sticky.id, e.target.value)}
            onPointerDown={(e) => e.stopPropagation()}
            placeholder="Memo"
            className="w-full text-[10px] font-bold uppercase tracking-wider bg-transparent border-none focus:outline-none focus:bg-black/10 rounded px-1 min-w-0 truncate leading-tight"
            style={{ color: colorConfig.text }}
            title="Click to rename note"
          />
        </div>

        {/* Compact Action Controls */}
        <div className="flex items-center gap-0.5 flex-shrink-0" onPointerDown={(e) => e.stopPropagation()}>
          {/* Color Palette Toggle */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsColorPickerOpen((prev) => !prev)}
              className="p-0.5 rounded hover:bg-black/10 transition-colors opacity-70 hover:opacity-100 cursor-pointer"
              title="Change Color"
            >
              <Palette size={10} />
            </button>

            {/* Color Palette Popover */}
            {isColorPickerOpen && (
              <div className="absolute right-0 top-full mt-1 p-1 bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-black/10 flex items-center gap-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                {STICKY_PALETTE.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      updateStickyNoteColor(noteId, sticky.id, c.hex);
                      setIsColorPickerOpen(false);
                    }}
                    className={`w-3.5 h-3.5 rounded-full border transition-transform cursor-pointer hover:scale-110 ${
                      colorConfig.hex === c.hex ? 'ring-2 ring-black/40 scale-105' : ''
                    }`}
                    style={{ backgroundColor: c.hex, borderColor: c.border }}
                    title={c.name}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Minimize / Expand Toggle */}
          <button
            type="button"
            onClick={() => toggleStickyNoteMinimized(noteId, sticky.id)}
            className="p-0.5 rounded hover:bg-black/10 transition-colors opacity-70 hover:opacity-100 cursor-pointer"
            title={sticky.isMinimized ? 'Expand Note' : 'Minimize Note'}
          >
            {sticky.isMinimized ? <Maximize2 size={10} /> : <Minus size={10} />}
          </button>

          {/* Delete Sticky Note */}
          <button
            type="button"
            onClick={() => deleteStickyNote(noteId, sticky.id)}
            className="p-0.5 rounded hover:bg-red-500/20 hover:text-red-700 transition-colors opacity-70 hover:opacity-100 cursor-pointer"
            title="Delete Note"
          >
            <X size={10} />
          </button>
        </div>
      </div>

      {/* Note Body (Hidden when Minimized) */}
      {!sticky.isMinimized && (
        <div className="p-2 pt-1.5">
          <textarea
            ref={textareaRef}
            value={sticky.text}
            onChange={(e) => updateStickyNoteText(noteId, sticky.id, e.target.value)}
            placeholder="Write a quick thought or reminder..."
            rows={2}
            className={`w-full bg-transparent border-none resize-none focus:outline-none text-sm sm:text-base leading-relaxed placeholder:opacity-40 ${
              fontMode === 'steward' ? 'font-steward' : 'font-handwriting'
            }`}
            style={{ color: colorConfig.text }}
          />
        </div>
      )}
    </div>
  );
};
