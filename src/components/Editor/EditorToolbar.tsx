import React from 'react';
import { Editor } from '@tiptap/react';
import {
  Undo2,
  Redo2,
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code2,
  Type,
  Grid,
  CircleDot,
  Square,
  Rows,
  Trash2,
  Columns,
} from 'lucide-react';
import { HighlighterMenu } from './HighlighterMenu';
import { TableMenu } from './TableMenu';
import { useNoteZustandStore } from '../../stores/useNoteZustandStore';
import { PaperStyle } from '../../types/note';

interface EditorToolbarProps {
  editor: Editor | null;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({ editor }) => {
  const {
    getActiveNote,
    fontMode,
    toggleFontMode,
    updateNoteBackgroundStyle,
  } = useNoteZustandStore();

  const activeNote = getActiveNote();

  if (!editor || !activeNote) return null;

  const currentPaperStyle: PaperStyle = activeNote.backgroundStyle || 'lined';
  const isInsideTable = editor.isActive('table');

  const handlePaperStyleChange = (style: PaperStyle, e: React.MouseEvent) => {
    e.preventDefault();
    updateNoteBackgroundStyle(activeNote.id, style);
  };

  return (
    <div className="relative z-30 bg-white/95 backdrop-blur-md border-b border-theme-border/90 px-3 sm:px-5 py-2 shadow-xs">
      <div className="flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
        {/* Left & Middle: Formatting Tools Groups */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          {/* Group 1: Undo / Redo */}
          <div className="flex items-center gap-0.5 pr-1 border-r border-theme-border/70">
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              className="p-1.5 rounded-lg text-[#5D5144] hover:bg-theme-sidebar/70 disabled:opacity-35 disabled:hover:bg-transparent transition-colors cursor-pointer"
              title="Undo (Ctrl+Z)"
              aria-label="Undo"
            >
              <Undo2 size={15} />
            </button>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              className="p-1.5 rounded-lg text-[#5D5144] hover:bg-theme-sidebar/70 disabled:opacity-35 disabled:hover:bg-transparent transition-colors cursor-pointer"
              title="Redo (Ctrl+Y)"
              aria-label="Redo"
            >
              <Redo2 size={15} />
            </button>
          </div>

          {/* Group 2: Headings */}
          <div className="flex items-center gap-0.5 pr-1 border-r border-theme-border/70">
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                editor.isActive('heading', { level: 1 })
                  ? 'bg-theme-accent text-white shadow-2xs'
                  : 'text-[#5D5144] hover:bg-theme-sidebar/70'
              }`}
              title="Heading 1"
              aria-label="Heading 1"
            >
              <Heading1 size={16} />
            </button>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                editor.isActive('heading', { level: 2 })
                  ? 'bg-theme-accent text-white shadow-2xs'
                  : 'text-[#5D5144] hover:bg-theme-sidebar/70'
              }`}
              title="Heading 2"
              aria-label="Heading 2"
            >
              <Heading2 size={16} />
            </button>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                editor.isActive('heading', { level: 3 })
                  ? 'bg-theme-accent text-white shadow-2xs'
                  : 'text-[#5D5144] hover:bg-theme-sidebar/70'
              }`}
              title="Heading 3"
              aria-label="Heading 3"
            >
              <Heading3 size={16} />
            </button>
          </div>

          {/* Group 3: Inline Text Styles */}
          <div className="flex items-center gap-0.5 pr-1 border-r border-theme-border/70">
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                editor.isActive('bold')
                  ? 'bg-theme-accent text-white shadow-2xs font-bold'
                  : 'text-[#5D5144] hover:bg-theme-sidebar/70'
              }`}
              title="Bold (Ctrl+B)"
              aria-label="Bold"
            >
              <Bold size={15} />
            </button>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                editor.isActive('italic')
                  ? 'bg-theme-accent text-white shadow-2xs font-bold'
                  : 'text-[#5D5144] hover:bg-theme-sidebar/70'
              }`}
              title="Italic (Ctrl+I)"
              aria-label="Italic"
            >
              <Italic size={15} />
            </button>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                editor.isActive('strike')
                  ? 'bg-theme-accent text-white shadow-2xs font-bold'
                  : 'text-[#5D5144] hover:bg-theme-sidebar/70'
              }`}
              title="Strikethrough"
              aria-label="Strikethrough"
            >
              <Strikethrough size={15} />
            </button>
          </div>

          {/* Group 4: Lists & Blocks */}
          <div className="flex items-center gap-0.5 pr-1 border-r border-theme-border/70">
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                editor.isActive('bulletList')
                  ? 'bg-theme-accent text-white shadow-2xs'
                  : 'text-[#5D5144] hover:bg-theme-sidebar/70'
              }`}
              title="Bullet List"
              aria-label="Bullet List"
            >
              <List size={15} />
            </button>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                editor.isActive('orderedList')
                  ? 'bg-theme-accent text-white shadow-2xs'
                  : 'text-[#5D5144] hover:bg-theme-sidebar/70'
              }`}
              title="Numbered List"
              aria-label="Numbered List"
            >
              <ListOrdered size={15} />
            </button>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                editor.isActive('blockquote')
                  ? 'bg-theme-accent text-white shadow-2xs'
                  : 'text-[#5D5144] hover:bg-theme-sidebar/70'
              }`}
              title="Quote Block"
              aria-label="Quote Block"
            >
              <Quote size={15} />
            </button>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                editor.isActive('codeBlock')
                  ? 'bg-theme-accent text-white shadow-2xs'
                  : 'text-[#5D5144] hover:bg-theme-sidebar/70'
              }`}
              title="Code Block"
              aria-label="Code Block"
            >
              <Code2 size={15} />
            </button>
          </div>

          {/* Group 5: Study Tools (Highlighter & Table) */}
          <div className="flex items-center gap-1.5 pr-1 border-r border-theme-border/70">
            <HighlighterMenu editor={editor} />
            <TableMenu editor={editor} />
          </div>

          {/* Group 6: Paper Pattern Switcher */}
          <div className="flex items-center gap-1 bg-[#F5EFE3] p-1 rounded-xl border border-theme-border/70">
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={(e) => handlePaperStyleChange('lined', e)}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                currentPaperStyle === 'lined'
                  ? 'bg-white text-theme-accent shadow-xs border border-theme-border/80'
                  : 'text-[#675C51] hover:text-theme-text'
              }`}
              title="Ruled / Lined Notebook Pattern"
            >
              <Rows size={13} />
              <span className="hidden md:inline">Ruled</span>
            </button>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={(e) => handlePaperStyleChange('grid', e)}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                currentPaperStyle === 'grid'
                  ? 'bg-white text-theme-accent shadow-xs border border-theme-border/80'
                  : 'text-[#675C51] hover:text-theme-text'
              }`}
              title="Grid / Graph Paper Pattern"
            >
              <Grid size={13} />
              <span className="hidden md:inline">Grid</span>
            </button>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={(e) => handlePaperStyleChange('dot', e)}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                currentPaperStyle === 'dot'
                  ? 'bg-white text-theme-accent shadow-xs border border-theme-border/80'
                  : 'text-[#675C51] hover:text-theme-text'
              }`}
              title="Dot Matrix Bullet Journal Pattern"
            >
              <CircleDot size={13} />
              <span className="hidden md:inline">Dot</span>
            </button>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={(e) => handlePaperStyleChange('blank', e)}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                currentPaperStyle === 'blank'
                  ? 'bg-white text-theme-accent shadow-xs border border-theme-border/80'
                  : 'text-[#675C51] hover:text-theme-text'
              }`}
              title="Clean Blank Card Canvas"
            >
              <Square size={13} />
              <span className="hidden md:inline">Blank</span>
            </button>
          </div>
        </div>

        {/* Right: Typography Font Switch Button */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={toggleFontMode}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all duration-150 shadow-xs cursor-pointer ${
              fontMode === 'handwriting'
                ? 'bg-[#FFF3B0] text-[#4F4310] border-[#E8DC88] hover:bg-[#FCEBA2]'
                : 'bg-white text-theme-text border-theme-border hover:bg-theme-sidebar/60'
            }`}
            title="Toggle Handwriting vs Clean Sans-Serif Font"
          >
            <Type size={14} className="text-theme-accent" />
            <span className="hidden sm:inline">
              {fontMode === 'handwriting' ? '✍️ Caveat' : '🔤 Nunito UI'}
            </span>
          </button>
        </div>
      </div>

      {/* Quick Table Sub-Bar when cursor is inside a table */}
      {isInsideTable && (
        <div className="mt-2 pt-2 border-t border-theme-border/60 flex items-center justify-between gap-2 overflow-x-auto text-xs bg-amber-50/70 -mx-3 sm:-mx-5 px-3 sm:px-5 py-1.5 animate-in fade-in duration-100">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-900 flex-shrink-0">
            <span>📊 Active Table:</span>
          </div>

          <div className="flex items-center gap-1 min-w-max">
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => editor.chain().focus().addRowBefore().run()}
              className="flex items-center gap-1 px-2 py-1 bg-white hover:bg-amber-100/60 border border-theme-border/70 rounded-md text-[11px] text-[#4A4036] cursor-pointer"
            >
              <Rows size={12} className="text-theme-accent" />
              <span>+ Row Above</span>
            </button>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => editor.chain().focus().addRowAfter().run()}
              className="flex items-center gap-1 px-2 py-1 bg-white hover:bg-amber-100/60 border border-theme-border/70 rounded-md text-[11px] text-[#4A4036] cursor-pointer"
            >
              <Rows size={12} className="text-theme-accent" />
              <span>+ Row Below</span>
            </button>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => editor.chain().focus().addColumnBefore().run()}
              className="flex items-center gap-1 px-2 py-1 bg-white hover:bg-amber-100/60 border border-theme-border/70 rounded-md text-[11px] text-[#4A4036] cursor-pointer"
            >
              <Columns size={12} className="text-theme-accent" />
              <span>+ Col Left</span>
            </button>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => editor.chain().focus().addColumnAfter().run()}
              className="flex items-center gap-1 px-2 py-1 bg-white hover:bg-amber-100/60 border border-theme-border/70 rounded-md text-[11px] text-[#4A4036] cursor-pointer"
            >
              <Columns size={12} className="text-theme-accent" />
              <span>+ Col Right</span>
            </button>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => editor.chain().focus().deleteRow().run()}
              className="flex items-center gap-1 px-2 py-1 bg-white hover:bg-red-50 border border-theme-border/70 rounded-md text-[11px] text-red-700 cursor-pointer"
            >
              <Trash2 size={12} className="text-red-500" />
              <span>Del Row</span>
            </button>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => editor.chain().focus().deleteColumn().run()}
              className="flex items-center gap-1 px-2 py-1 bg-white hover:bg-red-50 border border-theme-border/70 rounded-md text-[11px] text-red-700 cursor-pointer"
            >
              <Trash2 size={12} className="text-red-500" />
              <span>Del Col</span>
            </button>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => editor.chain().focus().deleteTable().run()}
              className="flex items-center gap-1 px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-[11px] font-bold cursor-pointer shadow-xs ml-1"
            >
              <Trash2 size={12} />
              <span>Delete Table</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
