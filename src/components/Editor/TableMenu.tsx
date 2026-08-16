import React, { useState, useRef, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import {
  Table as TableIcon,
  ChevronDown,
  BookMarked,
  Trash2,
  Rows,
  Columns,
  Sparkles,
} from 'lucide-react';
import { Tooltip } from '../UI/Tooltip';

interface TableMenuProps {
  editor: Editor | null;
}

const MAX_GRID_ROWS = 6;
const MAX_GRID_COLS = 6;

export const TableMenu: React.FC<TableMenuProps> = ({ editor }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoverRows, setHoverRows] = useState(0);
  const [hoverCols, setHoverCols] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!editor) return null;

  const isInsideTable = editor.isActive('table');

  const handleInsertGridTable = (rows: number, cols: number, e: React.MouseEvent) => {
    e.preventDefault();
    if (!editor) return;

    editor
      .chain()
      .focus()
      .insertTable({ rows, cols, withHeaderRow: true })
      .run();
    setIsOpen(false);
    setHoverRows(0);
    setHoverCols(0);
  };

  const handleInsertVocabPreset = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!editor) return;

    const vocabHtml = `
      <table>
        <thead>
          <tr>
            <th>Term / Marker</th>
            <th>Keyword / Expression</th>
            <th>Definition / Translation</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>n.</strong></td>
            <td>Serendipity</td>
            <td>Finding valuable or pleasant things by chance</td>
          </tr>
          <tr>
            <td><strong>v.</strong></td>
            <td>Persevere</td>
            <td>Continue firmly toward a goal despite difficulties</td>
          </tr>
          <tr>
            <td><strong>adj.</strong></td>
            <td>Luminous</td>
            <td>Radiating warmth, clarity, or soft glowing light</td>
          </tr>
        </tbody>
      </table>
      <p></p>
    `;
    editor.chain().focus().insertContent(vocabHtml).run();
    setIsOpen(false);
  };

  return (
    <div className="relative inline-flex items-center" ref={menuRef}>
      {/* Table Toggle Button with Tooltip */}
      <Tooltip label="Study Tables" description="Insert custom grid, Vocabulary or Comparison preset tables">
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={(e) => {
            e.preventDefault();
            setIsOpen((prev) => !prev);
          }}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all duration-150 cursor-pointer ${
            isInsideTable
              ? 'bg-amber-100/90 text-amber-900 border-amber-300 shadow-xs'
              : isOpen
              ? 'bg-theme-sidebar text-theme-text border-theme-border'
              : 'bg-white text-theme-text border-theme-border/80 hover:bg-theme-sidebar/50'
          }`}
          aria-label="Study tables generator"
        >
          <TableIcon size={14} className="text-theme-accent flex-shrink-0" />
          <span>Table</span>
          <ChevronDown size={12} className={`transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </Tooltip>

      {/* Table Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-cozy-lg border border-theme-border/90 p-3 z-50 animate-in fade-in-50 zoom-in-95 duration-100">
          {/* Custom Grid Interactive Matrix */}
          <div className="mb-3">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#8E8276] mb-1.5">
              <span>Custom Grid</span>
              <span className="text-theme-accent font-mono font-bold">
                {hoverRows > 0 && hoverCols > 0 ? `${hoverRows} × ${hoverCols} Table` : 'Select Size'}
              </span>
            </div>

            <div
              className="grid grid-cols-6 gap-1 p-2 bg-[#FAF6EE] rounded-lg border border-theme-border/60 justify-items-center cursor-pointer"
              onMouseLeave={() => {
                setHoverRows(0);
                setHoverCols(0);
              }}
            >
              {Array.from({ length: MAX_GRID_ROWS }).map((_, rIndex) =>
                Array.from({ length: MAX_GRID_COLS }).map((_, cIndex) => {
                  const isHighlighted = rIndex < hoverRows && cIndex < hoverCols;
                  return (
                    <div
                      key={`${rIndex}-${cIndex}`}
                      onMouseEnter={() => {
                        setHoverRows(rIndex + 1);
                        setHoverCols(cIndex + 1);
                      }}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={(e) => handleInsertGridTable(rIndex + 1, cIndex + 1, e)}
                      className={`w-6 h-6 rounded-md border transition-all duration-75 ${
                        isHighlighted
                          ? 'bg-amber-300 border-amber-500 scale-105 shadow-2xs'
                          : 'bg-white border-[#D8CBAF] hover:border-amber-400'
                      }`}
                      title={`${rIndex + 1} × ${cIndex + 1}`}
                    />
                  );
                })
              )}
            </div>
          </div>

          {/* Study Presets Section */}
          <div className="border-t border-theme-border/60 pt-2.5 mb-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#8E8276] mb-1.5 flex items-center gap-1">
              <Sparkles size={12} className="text-amber-500" />
              <span>Study Preset</span>
            </div>

            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleInsertVocabPreset}
              className="w-full flex items-start gap-2.5 p-2 rounded-lg text-left hover:bg-theme-sidebar/60 border border-transparent hover:border-theme-border transition-colors group cursor-pointer"
            >
              <div className="w-7 h-7 rounded-md bg-amber-100/80 border border-amber-200 flex items-center justify-center text-amber-800 flex-shrink-0 group-hover:scale-105 transition-transform">
                <BookMarked size={14} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-theme-text flex items-center gap-1">
                  <span>Vocabulary / Glossary</span>
                </div>
                <div className="text-[10px] text-[#7E7267] line-clamp-1">
                  [Term] | [Keyword] | [Definition]
                </div>
              </div>
            </button>
          </div>

          {/* Contextual Table Actions (when cursor is inside a table) */}
          {isInsideTable && (
            <div className="border-t border-theme-border/60 pt-2.5 mt-2 space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-theme-accent font-bold mb-1">
                ⚙️ Table Controls
              </div>

              <div className="grid grid-cols-2 gap-1 text-xs">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    editor.chain().focus().addRowBefore().run();
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-1.5 p-1.5 rounded-md hover:bg-theme-sidebar text-[#4A4036] text-[11px] cursor-pointer"
                >
                  <Rows size={12} className="text-theme-accent" />
                  <span>+ Row Above</span>
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    editor.chain().focus().addRowAfter().run();
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-1.5 p-1.5 rounded-md hover:bg-theme-sidebar text-[#4A4036] text-[11px] cursor-pointer"
                >
                  <Rows size={12} className="text-theme-accent" />
                  <span>+ Row Below</span>
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    editor.chain().focus().addColumnBefore().run();
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-1.5 p-1.5 rounded-md hover:bg-theme-sidebar text-[#4A4036] text-[11px] cursor-pointer"
                >
                  <Columns size={12} className="text-theme-accent" />
                  <span>+ Col Left</span>
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    editor.chain().focus().addColumnAfter().run();
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-1.5 p-1.5 rounded-md hover:bg-theme-sidebar text-[#4A4036] text-[11px] cursor-pointer"
                >
                  <Columns size={12} className="text-theme-accent" />
                  <span>+ Col Right</span>
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    editor.chain().focus().deleteRow().run();
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-1.5 p-1.5 rounded-md hover:bg-red-50 text-red-700 text-[11px] cursor-pointer"
                >
                  <Trash2 size={12} className="text-red-500" />
                  <span>Del Row</span>
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    editor.chain().focus().deleteColumn().run();
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-1.5 p-1.5 rounded-md hover:bg-red-50 text-red-700 text-[11px] cursor-pointer"
                >
                  <Trash2 size={12} className="text-red-500" />
                  <span>Del Column</span>
                </button>
              </div>

              <div className="pt-1">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    editor.chain().focus().deleteTable().run();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-1.5 p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Trash2 size={13} className="text-red-600" />
                  <span>Delete Table</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
