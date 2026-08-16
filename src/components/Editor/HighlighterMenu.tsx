import React, { useState, useRef, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import { Highlighter, ChevronDown, Check, Ban } from 'lucide-react';
import { StudyHighlightColor, STUDY_HIGHLIGHT_COLORS } from '../../types/highlighter';
import { Tooltip } from '../UI/Tooltip';

interface HighlighterMenuProps {
  editor: Editor | null;
}

export const HighlighterMenu: React.FC<HighlighterMenuProps> = ({ editor }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState<StudyHighlightColor>(STUDY_HIGHLIGHT_COLORS[0]);
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

  const isHighlighted = editor.isActive('highlight');

  const handleApplySelectedColor = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!editor) return;

    if (editor.isActive('highlight', { color: selectedColor.color })) {
      editor.chain().focus().unsetHighlight().run();
    } else {
      editor.chain().focus().setHighlight({ color: selectedColor.color }).run();
    }
  };

  const handleSelectAndApply = (colorItem: StudyHighlightColor, e: React.MouseEvent) => {
    e.preventDefault();
    if (!editor) return;

    setSelectedColor(colorItem);
    editor.chain().focus().setHighlight({ color: colorItem.color }).run();
    setIsOpen(false);
  };

  const handleClearHighlight = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!editor) return;

    editor.chain().focus().unsetHighlight().run();
    setIsOpen(false);
  };

  return (
    <div className="relative inline-flex items-center" ref={menuRef}>
      {/* Split Button: Main Button with Tooltip */}
      <Tooltip label={`Highlight (${selectedColor.name})`} description="Highlight selected text with study pastel color">
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleApplySelectedColor}
          className={`flex items-center gap-1.5 px-2 py-1 rounded-l-lg border text-xs font-semibold transition-all duration-150 cursor-pointer ${
            isHighlighted
              ? 'bg-amber-100/90 text-amber-900 border-amber-300 shadow-xs'
              : 'bg-white text-theme-text border-theme-border/80 hover:bg-theme-sidebar/50'
          }`}
          aria-label="Toggle study highlight"
        >
          <Highlighter size={14} className="flex-shrink-0 text-amber-700" />
          <span
            className="w-3.5 h-3.5 rounded-full border shadow-2xs flex-shrink-0"
            style={{ backgroundColor: selectedColor.color, borderColor: selectedColor.borderColor }}
          />
        </button>
      </Tooltip>

      {/* Split Button: Arrow Trigger with Tooltip */}
      <Tooltip label="5 Highlighter Colors" description="Choose Yellow, Green, Blue, Purple, or Rose">
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={(e) => {
            e.preventDefault();
            setIsOpen((prev) => !prev);
          }}
          className={`px-1.5 py-1 rounded-r-lg border-y border-r text-xs transition-all duration-150 cursor-pointer ${
            isOpen
              ? 'bg-theme-sidebar text-theme-text border-theme-border'
              : isHighlighted
              ? 'bg-amber-100/90 text-amber-900 border-amber-300'
              : 'bg-white text-theme-text border-theme-border/80 hover:bg-theme-sidebar/50'
          }`}
          aria-label="Open highlighter color palette"
        >
          <ChevronDown size={12} className={`transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </Tooltip>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-cozy-lg border border-theme-border/90 p-2 z-50 animate-in fade-in-50 zoom-in-95 duration-100">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#8E8276] px-2 py-1 mb-1 border-b border-theme-border/40 flex items-center justify-between">
            <span>Study Highlighter</span>
            <span className="text-[10px] font-normal text-theme-accent font-mono">5 Colors</span>
          </div>

          <div className="space-y-1">
            {STUDY_HIGHLIGHT_COLORS.map((item) => {
              const isActive = editor.isActive('highlight', { color: item.color });

              return (
                <button
                  key={item.id}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={(e) => handleSelectAndApply(item, e)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer group ${
                    isActive ? 'bg-theme-sidebar/80 font-bold' : 'hover:bg-theme-sidebar/40 text-[#4A4036]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-4 h-4 rounded-full border flex-shrink-0 shadow-2xs group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: item.color, borderColor: item.borderColor }}
                    />
                    <span className="truncate text-left">{item.name}</span>
                  </div>
                  {isActive && <Check size={13} className="text-theme-accent flex-shrink-0" />}
                </button>
              );
            })}
          </div>

          <div className="mt-1.5 pt-1.5 border-t border-theme-border/50">
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleClearHighlight}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-red-700 hover:bg-red-50 transition-colors font-medium cursor-pointer"
            >
              <Ban size={13} className="text-red-500" />
              <span>Clear Highlight</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
