import React, { useEffect } from 'react';
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
import { StickyNote as StickyIcon } from 'lucide-react';

export const CubEditor: React.FC = () => {
  const {
    getActiveNote,
    updateNoteContent,
    fontMode,
  } = useNoteZustandStore();

  const activeNote = getActiveNote();

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

  // Sync editor content when the active note changes
  useEffect(() => {
    if (!editor || !activeNote) return;

    // Only replace content if the note switched
    const currentHtml = editor.getHTML();
    if (activeNote.contentHtml !== currentHtml) {
      editor.commands.setContent(activeNote.contentHtml, { emitUpdate: false });
    }
  }, [activeNote?.id, editor]);

  if (!activeNote) return null;

  const paperClass =
    activeNote.backgroundStyle === 'grid'
      ? 'paper-grid'
      : activeNote.backgroundStyle === 'dot'
      ? 'paper-dot'
      : activeNote.backgroundStyle === 'blank'
      ? 'paper-blank'
      : 'paper-lined';

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-theme-primary">
      {/* Sticky Formatting Sub-Toolbar */}
      <EditorToolbar editor={editor} />

      {/* Main Canvas Scroll Area */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-6 md:p-8 flex justify-center items-start">
        <div className="relative w-full max-w-4xl min-h-[500px] mb-8">
          {/* Mobile / Tablet Inlined Sticky Note if present */}
          {activeNote.content?.stickyNotes && activeNote.content.stickyNotes.length > 0 && (
            <div className="lg:hidden mb-4 space-y-2">
              {activeNote.content.stickyNotes.map((sticky) => (
                <div
                  key={sticky.id}
                  className="p-3 rounded-xl shadow-sticky border border-[#E8DC88] bg-[#FFF3B0] text-[#4F4310] text-xs sm:text-sm font-handwriting"
                >
                  <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider mb-1 opacity-70">
                    <StickyIcon size={11} />
                    <span>Memo</span>
                  </div>
                  <p className="whitespace-pre-line text-sm sm:text-base leading-snug">{sticky.text}</p>
                </div>
              ))}
            </div>
          )}

          {/* Note Paper Sheet with Background Pattern */}
          <div
            className={`w-full min-h-[520px] sm:min-h-[600px] p-5 sm:p-8 md:p-12 rounded-2xl border border-theme-border shadow-cozy-md ${paperClass} transition-all duration-150 overflow-x-auto`}
          >
            <div
              className={`transition-all duration-150 ${
                fontMode === 'handwriting'
                  ? 'font-handwriting text-xl sm:text-2xl leading-relaxed'
                  : 'font-ui text-sm sm:text-base leading-normal'
              }`}
            >
              <EditorContent editor={editor} />
            </div>
          </div>

          {/* Desktop Floating Sticky Note */}
          {activeNote.content?.stickyNotes && activeNote.content.stickyNotes.length > 0 && (
            <div className="absolute right-[-14px] top-6 hidden lg:block max-w-[220px]">
              {activeNote.content.stickyNotes.map((sticky) => (
                <div
                  key={sticky.id}
                  className="p-3 rounded-xl shadow-sticky border border-[#E8DC88] bg-[#FFF3B0] text-[#4F4310] text-sm font-handwriting rotate-2 transform hover:rotate-0 transition-transform cursor-move"
                >
                  <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider mb-1 opacity-70">
                    <StickyIcon size={12} />
                    <span>Memo</span>
                  </div>
                  <p className="whitespace-pre-line text-base leading-snug">{sticky.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
