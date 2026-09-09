import React, { useRef, useMemo } from 'react';
import { useNoteZustandStore } from '../../stores/useNoteZustandStore';
import { EditorToolbar } from './EditorToolbar';
import { VectorOverlay } from '../Canvas/VectorOverlay';
import { StickyNoteCard } from '../Cards/StickyNoteCard';
import { StickerItemView } from '../Stickers/StickerItemView';
import { StickerDeckDrawer } from '../Stickers/StickerDeckDrawer';
import { CanvasTextBlock } from '../Canvas/CanvasTextBlock';
import { CanvasTableBlock } from '../Canvas/CanvasTableBlock';
import { PaperStyle } from '../../types/note';

export const CubEditor: React.FC = () => {
  const {
    getActiveNote,
    addTextBlock,
    addStickyNote,
    activeDrawingTool,
    snapToPaperLines,
  } = useNoteZustandStore();

  const activeNote = getActiveNote();
  const containerRef = useRef<HTMLDivElement | null>(null);

  if (!activeNote) return null;

  const currentPaperStyle: PaperStyle = activeNote.backgroundStyle || 'lined';
  const paperClass =
    currentPaperStyle === 'grid'
      ? 'paper-grid'
      : currentPaperStyle === 'dot'
      ? 'paper-dot'
      : currentPaperStyle === 'blank'
      ? 'paper-blank'
      : 'paper-lined';

  // Ensure there is at least one primary text block for writing
  const textBlocks = useMemo(() => {
    if (activeNote.textBlocks && activeNote.textBlocks.length > 0) {
      return activeNote.textBlocks;
    }
    if (activeNote.contentHtml) {
      return [
        {
          id: `tb_${activeNote.id}_main`,
          x: 40,
          y: 32,
          contentHtml: activeNote.contentHtml,
        },
      ];
    }
    return [
      {
        id: `tb_${activeNote.id}_main`,
        x: 40,
        y: 32,
        contentHtml: '<p></p>',
      },
    ];
  }, [activeNote.id, activeNote.textBlocks, activeNote.contentHtml]);

  const tableBlocks = activeNote.tableBlocks || [];
  const stickyNotes = activeNote.stickyNotes || activeNote.content?.stickyNotes || [];
  const mascotStickers = activeNote.mascotStickers || activeNote.content?.stickers || [];
  const vectorShapes = activeNote.vectorShapes || activeNote.content?.vectors || [];

  // Dynamically calculate canvas paper height to accommodate dragged items
  const dynamicMinHeight = useMemo(() => {
    let maxY = 560;

    textBlocks.forEach((tb) => {
      maxY = Math.max(maxY, tb.y + 160);
    });

    tableBlocks.forEach((tb) => {
      maxY = Math.max(maxY, tb.y + 200);
    });

    stickyNotes.forEach((sn) => {
      maxY = Math.max(maxY, sn.y + (sn.isMinimized ? 40 : 180));
    });

    mascotStickers.forEach((stk) => {
      maxY = Math.max(maxY, stk.y + 120);
    });

    vectorShapes.forEach((v) => {
      maxY = Math.max(maxY, v.startY + 40, v.endY + 40);
    });

    return maxY + 240;
  }, [textBlocks, tableBlocks, stickyNotes, mascotStickers, vectorShapes]);

  // Single-click on empty canvas to place a new text block
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (activeDrawingTool !== 'none') return;

    const target = e.target as HTMLElement;
    const isBackground =
      target === containerRef.current ||
      target.classList.contains('paper-canvas-bg') ||
      target.tagName === 'MAIN' ||
      target.tagName === 'svg';

    if (isBackground && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const rawX = e.clientX - rect.left;
      const rawY = e.clientY - rect.top;

      let clickX = Math.max(20, Math.min(rect.width - 240, rawX));
      let clickY = Math.max(16, rawY);

      // Snap to 32px line grid if enabled
      if (snapToPaperLines && currentPaperStyle === 'lined') {
        clickY = Math.round(clickY / 32) * 32;
      }

      addTextBlock(activeNote.id, Math.round(clickX), Math.round(clickY), '<p></p>');
    }
  };

  // Double click to add a sticky note
  const handleCanvasDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (activeDrawingTool !== 'none') return;

    const target = e.target as HTMLElement;
    const isBackground =
      target === containerRef.current ||
      target.classList.contains('paper-canvas-bg') ||
      target.tagName === 'MAIN';

    if (isBackground && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(20, e.clientX - rect.left - 60);
      const y = Math.max(20, e.clientY - rect.top - 20);
      addStickyNote(activeNote.id, x, y, '#FFF3B0', '🐾 Memo:\n', 'Memo');
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-theme-primary relative">
      {/* Sticky Formatting Sub-Toolbar */}
      <EditorToolbar />

      {/* Main Canvas Scroll Area */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-6 md:p-8 flex justify-center items-start">
        <div
          ref={containerRef}
          onClick={handleCanvasClick}
          onDoubleClick={handleCanvasDoubleClick}
          className="relative w-full max-w-4xl min-h-[560px] mb-12 cursor-text"
        >
          {/* Note Paper Sheet with Background Pattern & Vector Overlay */}
          <div
            style={{ minHeight: `${dynamicMinHeight}px` }}
            className={`paper-canvas-bg relative w-full p-5 sm:p-8 md:p-12 rounded-2xl border border-theme-border shadow-cozy-md ${paperClass} transition-all duration-150 overflow-x-auto`}
          >
            {/* Interactive SVG Vector Overlay for Lines, Underlines, Concept Arrows & Eraser */}
            <VectorOverlay noteId={activeNote.id} />

            {/* Draggable & Selectable Freeform Text Blocks */}
            {textBlocks.map((block) => (
              <CanvasTextBlock
                key={block.id}
                noteId={activeNote.id}
                block={block}
                containerRef={containerRef}
                paperStyle={currentPaperStyle}
                isOnlyBlock={textBlocks.length === 1 && tableBlocks.length === 0}
              />
            ))}

            {/* Draggable Freestanding Table Blocks */}
            {tableBlocks.map((tableBlock) => (
              <CanvasTableBlock
                key={tableBlock.id}
                noteId={activeNote.id}
                tableBlock={tableBlock}
                containerRef={containerRef}
                paperStyle={currentPaperStyle}
              />
            ))}

            {/* Draggable Floating Sticky Notes */}
            {stickyNotes.map((sticky) => (
              <StickyNoteCard
                key={sticky.id}
                noteId={activeNote.id}
                sticky={sticky}
                containerRef={containerRef}
              />
            ))}

            {/* Draggable & Scalable Mascot Stickers */}
            {mascotStickers.map((sticker) => (
              <StickerItemView
                key={sticker.id}
                noteId={activeNote.id}
                sticker={sticker}
                containerRef={containerRef}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Mascot Sticker Deck Drawer */}
      <StickerDeckDrawer noteId={activeNote.id} />
    </div>
  );
};
