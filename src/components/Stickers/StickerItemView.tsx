import React, { useState, useRef } from 'react';
import { useNoteZustandStore } from '../../stores/useNoteZustandStore';
import { MascotStickerItem } from '../../types/note';
import { STICKER_DEFINITIONS } from './StickerAssets';
import { Trash2, ZoomIn, ZoomOut } from 'lucide-react';

interface StickerItemViewProps {
  noteId: string;
  sticker: MascotStickerItem;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export const StickerItemView: React.FC<StickerItemViewProps> = ({
  noteId,
  sticker,
  containerRef,
}) => {
  const { updateMascotStickerPosition, updateMascotStickerScale, deleteMascotSticker } =
    useNoteZustandStore();

  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number } | null>(
    null
  );

  const definition = STICKER_DEFINITIONS[sticker.type] || STICKER_DEFINITIONS.pup_cheer;
  const currentScale = sticker.scale || 1.0;
  const currentRotation = sticker.rotation || 0;

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Ignore clicks on action buttons
    if ((e.target as HTMLElement).closest('button')) return;

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
      initialX: sticker.x,
      initialY: sticker.y,
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

    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const stickerWidth = 80 * currentScale;
      const stickerHeight = 80 * currentScale;

      const maxX = Math.max(0, containerRect.width - stickerWidth);
      const maxY = Math.max(0, containerRect.height - stickerHeight);

      newX = Math.max(-10, Math.min(maxX + 20, newX));
      newY = Math.max(10, Math.min(maxY + 200, newY));
    }

    updateMascotStickerPosition(noteId, sticker.id, Math.round(newX), Math.round(newY));
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

  const handleScaleDelta = (delta: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const nextScale = Math.round((currentScale + delta) * 10) / 10;
    updateMascotStickerScale(noteId, sticker.id, nextScale);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteMascotSticker(noteId, sticker.id);
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: `translate3d(${sticker.x}px, ${sticker.y}px, 0) rotate(${currentRotation}deg)`,
      }}
      className={`absolute top-0 left-0 z-30 group cursor-grab active:cursor-grabbing transition-shadow duration-150 select-none ${
        isDragging ? 'scale-110 z-40 cursor-grabbing' : 'hover:scale-105'
      }`}
    >
      {/* Mascot Sticker Graphic */}
      <div className="relative inline-block">
        {definition.renderSvg(currentScale)}

        {/* Hover Quick Action Dock */}
        {(isHovered || isDragging) && (
          <div
            className="absolute -top-7 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-[#2B231D]/90 backdrop-blur text-white px-2 py-1 rounded-full shadow-lg border border-white/20 z-50 animate-in fade-in zoom-in-95 duration-100"
            onPointerDown={(e) => e.stopPropagation()}
          >
            {/* Scale Down */}
            <button
              type="button"
              onClick={(e) => handleScaleDelta(-0.15, e)}
              disabled={currentScale <= 0.7}
              className="p-0.5 hover:text-amber-300 disabled:opacity-30 disabled:hover:text-white transition-colors cursor-pointer"
              title="Scale Down"
            >
              <ZoomOut size={12} />
            </button>

            {/* Current Scale Badge */}
            <span className="text-[9px] font-mono font-bold text-amber-200 px-0.5">
              {Math.round(currentScale * 100)}%
            </span>

            {/* Scale Up */}
            <button
              type="button"
              onClick={(e) => handleScaleDelta(0.15, e)}
              disabled={currentScale >= 1.6}
              className="p-0.5 hover:text-amber-300 disabled:opacity-30 disabled:hover:text-white transition-colors cursor-pointer"
              title="Scale Up"
            >
              <ZoomIn size={12} />
            </button>

            <div className="w-[1px] h-2.5 bg-white/20 mx-0.5" />

            {/* Delete Sticker */}
            <button
              type="button"
              onClick={handleDelete}
              className="p-0.5 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
              title="Remove Sticker"
            >
              <Trash2 size={12} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
