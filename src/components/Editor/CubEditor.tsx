import React, { useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';

import { useNoteZustandStore } from '../../stores/useNoteZustandStore';
import { EditorToolbar } from './EditorToolbar';
import { VectorOverlay } from '../Canvas/VectorOverlay';
import { StickyNoteCard } from '../Cards/StickyNoteCard';
import { StickerItemView } from '../Stickers/StickerItemView';
import { StickerDeckDrawer } from '../Stickers/StickerDeckDrawer';

export const CubEditor: React.FC = () => {
  const {
    getActiveNote,
    updateNoteContent,
    fontMode,
    addStickyNote,
  } = useNoteZustandStore();

  const activeNote = getActiveNote();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const activeNoteIdRef = useRef<string | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Highlight.configure({
        multicolor: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TextStyle,
      Color,
    ],
    content: activeNote?.contentHtml || '',
    editorProps: {
      attributes: {
        class: 'tiptap focus:outline-none min-h-[420px] max-w-none',
      },
    },
    onUpdate: ({ editor }) => {
      if (activeNote) {
        const html = editor.getHTML();
        updateNoteContent(activeNote.id, html);
      }
    },
  });

  // Sync editor content whenever active note changes or is hydrated from storage
  useEffect(() => {
    if (!editor || !activeNote) return;

    const noteContent = activeNote.contentHtml || '';
    if (activeNoteIdRef.current !== activeNote.id) {
      activeNoteIdRef.current = activeNote.id;
      editor.commands.setContent(noteContent, { emitUpdate: false });
    } else if (!editor.isFocused && editor.getHTML() !== noteContent) {
      editor.commands.setContent(noteContent, { emitUpdate: false });
    }
  }, [activeNote?.id, activeNote?.contentHtml, editor]);

  if (!activeNote) return null;

  const paperClass =
    activeNote.backgroundStyle === 'grid'
      ? 'paper-grid'
      : activeNote.backgroundStyle === 'dot'
      ? 'paper-dot'
      : activeNote.backgroundStyle === 'blank'
      ? 'paper-blank'
      : 'paper-lined';

  const stickyNotes = activeNote.stickyNotes || activeNote.content?.stickyNotes || [];
  const mascotStickers = activeNote.mascotStickers || activeNote.content?.stickers || [];

  const handleContainerDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (
      target === containerRef.current ||
      target.classList.contains('paper-canvas-bg') ||
      target.tagName === 'MAIN'
    ) {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(20, e.clientX - rect.left - 60);
        const y = Math.max(20, e.clientY - rect.top - 20);
        addStickyNote(activeNote.id, x, y, '#FFF3B0', '🐾 Memo:\n', 'Memo');
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-theme-primary relative">
      {/* Sticky Formatting Sub-Toolbar */}
      <EditorToolbar editor={editor} />

      {/* Main Canvas Scroll Area */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-6 md:p-8 flex justify-center items-start">
        <div
          ref={containerRef}
          onDoubleClick={handleContainerDoubleClick}
          className="relative w-full max-w-4xl min-h-[500px] mb-8"
        >
          {/* Note Paper Sheet with Background Pattern & Vector Overlay */}
          <div
            className={`paper-canvas-bg relative w-full min-h-[520px] sm:min-h-[600px] p-5 sm:p-8 md:p-12 rounded-2xl border border-theme-border shadow-cozy-md ${paperClass} transition-all duration-150 overflow-x-auto`}
          >
            {/* Interactive SVG Vector Overlay for Lines, Underlines, Concept Arrows & Eraser */}
            <VectorOverlay noteId={activeNote.id} />

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

            {/* Rich Text Editor Content */}
            <div
              className={`relative z-10 transition-all duration-150 ${
                fontMode === 'handwriting'
                  ? 'font-handwriting text-xl sm:text-2xl leading-relaxed'
                  : 'font-ui text-sm sm:text-base leading-normal'
              }`}
            >
              <EditorContent editor={editor} />
            </div>
          </div>
        </div>
      </div>

      {/* Mascot Sticker Deck Drawer */}
      <StickerDeckDrawer noteId={activeNote.id} />
    </div>
  );
};
