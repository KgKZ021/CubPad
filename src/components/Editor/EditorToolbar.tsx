import React, { useState, useEffect } from 'react';
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
  Minus,
  ArrowRight,
  Eraser,
  PenTool,
  Check,
  RotateCcw,
  HelpCircle,
} from 'lucide-react';
import { HighlighterMenu } from './HighlighterMenu';
import { TableMenu } from './TableMenu';
import { Tooltip } from '../UI/Tooltip';
import { ShortcutsModal } from '../UI/ShortcutsModal';
import { useNoteZustandStore } from '../../stores/useNoteZustandStore';
import { PaperStyle, DrawingTool } from '../../types/note';

interface EditorToolbarProps {
  editor: Editor | null;
}

const PALETTE_COLORS = [
  { hex: '#4A3B32', name: 'Warm Brown' },
  { hex: '#D97736', name: 'Amber' },
  { hex: '#6A8E7F', name: 'Sage Green' },
  { hex: '#4A5568', name: 'Slate' },
];

export const EditorToolbar: React.FC<EditorToolbarProps> = ({ editor }) => {
  const {
    getActiveNote,
    fontMode,
    toggleFontMode,
    updateNoteBackgroundStyle,
    activeDrawingTool,
    setActiveDrawingTool,
    drawingColor,
    setDrawingColor,
    drawingStrokeWidth,
    setDrawingStrokeWidth,
    drawingIsDashed,
    setDrawingIsDashed,
    undoLastVectorShape,
    clearAllVectorShapes,
  } = useNoteZustandStore();

  const [isConfirmingClear, setIsConfirmingClear] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const activeNote = getActiveNote();

  // Global shortcut to open help/shortcuts modal (? or Cmd+/)
  useEffect(() => {
    const handleGlobalShortcuts = (e: KeyboardEvent) => {
      // Check if user pressed ? (shift + /) outside of editor focus or Cmd+/
      if ((e.key === '?' || ((e.metaKey || e.ctrlKey) && e.key === '/')) && !isShortcutsOpen) {
        // If not typing in input/textarea
        const tag = (e.target as HTMLElement)?.tagName;
        if (tag !== 'INPUT' && tag !== 'TEXTAREA') {
          e.preventDefault();
          setIsShortcutsOpen(true);
        }
      }
    };

    window.addEventListener('keydown', handleGlobalShortcuts);
    return () => window.removeEventListener('keydown', handleGlobalShortcuts);
  }, [isShortcutsOpen]);

  if (!editor || !activeNote) return null;

  const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
  const cmd = isMac ? '⌘' : 'Ctrl';
  const opt = isMac ? '⌥' : 'Alt';
  const shift = isMac ? '⇧' : 'Shift';

  const currentPaperStyle: PaperStyle = activeNote.backgroundStyle || 'lined';
  const isInsideTable = editor.isActive('table');
  const shapes = activeNote.vectorShapes || activeNote.content?.vectors || [];
  const isDrawingMode = activeDrawingTool !== 'none';

  const handlePaperStyleChange = (style: PaperStyle, e: React.MouseEvent) => {
    e.preventDefault();
    updateNoteBackgroundStyle(activeNote.id, style);
  };

  const handleToggleDrawMode = (tool: DrawingTool = 'line') => {
    if (activeDrawingTool === tool) {
      setActiveDrawingTool('none');
    } else {
      setActiveDrawingTool(tool);
    }
  };

  const handleClearAllShapes = () => {
    if (isConfirmingClear) {
      clearAllVectorShapes(activeNote.id);
      setIsConfirmingClear(false);
    } else {
      setIsConfirmingClear(true);
      setTimeout(() => setIsConfirmingClear(false), 3500);
    }
  };

  return (
    <>
      <div className="relative z-30 bg-white/95 backdrop-blur-md border-b border-theme-border/90 px-3 sm:px-5 py-2 shadow-xs">
        <div className="flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
          {/* Left & Middle: Formatting Tools Groups */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            {/* Group 1: Undo / Redo */}
            <div className="flex items-center gap-0.5 pr-1 border-r border-theme-border/70">
              <Tooltip label="Undo" shortcut={`${cmd}Z`} description="Revert previous text edit">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => editor.chain().focus().undo().run()}
                  disabled={!editor.can().undo()}
                  className="p-1.5 rounded-lg text-[#5D5144] hover:bg-theme-sidebar/70 disabled:opacity-35 disabled:hover:bg-transparent transition-colors cursor-pointer"
                  aria-label="Undo"
                >
                  <Undo2 size={15} />
                </button>
              </Tooltip>

              <Tooltip label="Redo" shortcut={`${cmd}Y`} description="Reapply reverted text edit">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => editor.chain().focus().redo().run()}
                  disabled={!editor.can().redo()}
                  className="p-1.5 rounded-lg text-[#5D5144] hover:bg-theme-sidebar/70 disabled:opacity-35 disabled:hover:bg-transparent transition-colors cursor-pointer"
                  aria-label="Redo"
                >
                  <Redo2 size={15} />
                </button>
              </Tooltip>
            </div>

            {/* Group 2: Headings */}
            <div className="flex items-center gap-0.5 pr-1 border-r border-theme-border/70">
              <Tooltip label="Heading 1" shortcut={`${cmd}${opt}1`} description="Large main section title">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                  className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    editor.isActive('heading', { level: 1 })
                      ? 'bg-theme-accent text-white shadow-2xs'
                      : 'text-[#5D5144] hover:bg-theme-sidebar/70'
                  }`}
                  aria-label="Heading 1"
                >
                  <Heading1 size={16} />
                </button>
              </Tooltip>

              <Tooltip label="Heading 2" shortcut={`${cmd}${opt}2`} description="Medium topic subtitle">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                  className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    editor.isActive('heading', { level: 2 })
                      ? 'bg-theme-accent text-white shadow-2xs'
                      : 'text-[#5D5144] hover:bg-theme-sidebar/70'
                  }`}
                  aria-label="Heading 2"
                >
                  <Heading2 size={16} />
                </button>
              </Tooltip>

              <Tooltip label="Heading 3" shortcut={`${cmd}${opt}3`} description="Small section header">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                  className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    editor.isActive('heading', { level: 3 })
                      ? 'bg-theme-accent text-white shadow-2xs'
                      : 'text-[#5D5144] hover:bg-theme-sidebar/70'
                  }`}
                  aria-label="Heading 3"
                >
                  <Heading3 size={16} />
                </button>
              </Tooltip>
            </div>

            {/* Group 3: Inline Text Styles */}
            <div className="flex items-center gap-0.5 pr-1 border-r border-theme-border/70">
              <Tooltip label="Bold" shortcut={`${cmd}B`} description="Emphasize important text">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                    editor.isActive('bold')
                      ? 'bg-theme-accent text-white shadow-2xs font-bold'
                      : 'text-[#5D5144] hover:bg-theme-sidebar/70'
                  }`}
                  aria-label="Bold"
                >
                  <Bold size={15} />
                </button>
              </Tooltip>

              <Tooltip label="Italic" shortcut={`${cmd}I`} description="Slanted emphasis">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                    editor.isActive('italic')
                      ? 'bg-theme-accent text-white shadow-2xs font-bold'
                      : 'text-[#5D5144] hover:bg-theme-sidebar/70'
                  }`}
                  aria-label="Italic"
                >
                  <Italic size={15} />
                </button>
              </Tooltip>

              <Tooltip label="Strikethrough" shortcut={`${cmd}${shift}X`} description="Cross out text">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => editor.chain().focus().toggleStrike().run()}
                  className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                    editor.isActive('strike')
                      ? 'bg-theme-accent text-white shadow-2xs font-bold'
                      : 'text-[#5D5144] hover:bg-theme-sidebar/70'
                  }`}
                  aria-label="Strikethrough"
                >
                  <Strikethrough size={15} />
                </button>
              </Tooltip>
            </div>

            {/* Group 4: Lists & Blocks */}
            <div className="flex items-center gap-0.5 pr-1 border-r border-theme-border/70">
              <Tooltip label="Bullet List" shortcut={`${cmd}${shift}8`} description="Unordered bullet points">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
                  className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                    editor.isActive('bulletList')
                      ? 'bg-theme-accent text-white shadow-2xs'
                      : 'text-[#5D5144] hover:bg-theme-sidebar/70'
                  }`}
                  aria-label="Bullet List"
                >
                  <List size={15} />
                </button>
              </Tooltip>

              <Tooltip label="Numbered List" shortcut={`${cmd}${shift}7`} description="Sequential numbered steps">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => editor.chain().focus().toggleOrderedList().run()}
                  className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                    editor.isActive('orderedList')
                      ? 'bg-theme-accent text-white shadow-2xs'
                      : 'text-[#5D5144] hover:bg-theme-sidebar/70'
                  }`}
                  aria-label="Numbered List"
                >
                  <ListOrdered size={15} />
                </button>
              </Tooltip>

              <Tooltip label="Quote Block" shortcut={`${cmd}${shift}9`} description="Callout quote block">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => editor.chain().focus().toggleBlockquote().run()}
                  className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                    editor.isActive('blockquote')
                      ? 'bg-theme-accent text-white shadow-2xs'
                      : 'text-[#5D5144] hover:bg-theme-sidebar/70'
                  }`}
                  aria-label="Quote Block"
                >
                  <Quote size={15} />
                </button>
              </Tooltip>

              <Tooltip label="Code Block" shortcut={`${cmd}${opt}C`} description="Monospace code snippet block">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                  className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                    editor.isActive('codeBlock')
                      ? 'bg-theme-accent text-white shadow-2xs'
                      : 'text-[#5D5144] hover:bg-theme-sidebar/70'
                  }`}
                  aria-label="Code Block"
                >
                  <Code2 size={15} />
                </button>
              </Tooltip>
            </div>

            {/* Group 5: Study Tools (Highlighter & Table) */}
            <div className="flex items-center gap-1.5 pr-1 border-r border-theme-border/70">
              <HighlighterMenu editor={editor} />
              <TableMenu editor={editor} />
            </div>

            {/* Group 6: Vector Lines & Arrows Draw Mode Toggle */}
            <div className="flex items-center gap-1 pr-1 border-r border-theme-border/70">
              <Tooltip
                label={isDrawingMode ? 'Drawing Mode Active' : 'Draw Lines & Arrows'}
                description={
                  isDrawingMode
                    ? 'Click to exit back to text editing'
                    : 'Draw underlines, dividers & hand-drawn concept arrows'
                }
              >
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleToggleDrawMode(isDrawingMode ? 'none' : 'line')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
                    isDrawingMode
                      ? 'bg-theme-accent text-white shadow-theme-accent/20 ring-2 ring-theme-accent/30'
                      : 'bg-white text-[#5D5144] border border-theme-border hover:bg-theme-sidebar/70'
                  }`}
                >
                  <PenTool size={14} />
                  <span>{isDrawingMode ? 'Drawing Mode' : 'Draw Lines'}</span>
                  {shapes.length > 0 && !isDrawingMode && (
                    <span className="ml-0.5 px-1.5 py-0.2 bg-[#F0E6D2] text-[#6A5D4D] rounded-full text-[10px] font-bold">
                      {shapes.length}
                    </span>
                  )}
                </button>
              </Tooltip>
            </div>

            {/* Group 7: Paper Pattern Switcher */}
            <div className="flex items-center gap-1 bg-[#F5EFE3] p-1 rounded-xl border border-theme-border/70">
              <Tooltip label="Ruled Pattern" description="Classic lined notebook paper">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={(e) => handlePaperStyleChange('lined', e)}
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                    currentPaperStyle === 'lined'
                      ? 'bg-white text-theme-accent shadow-xs border border-theme-border/80'
                      : 'text-[#675C51] hover:text-theme-text'
                  }`}
                >
                  <Rows size={13} />
                  <span className="hidden md:inline">Ruled</span>
                </button>
              </Tooltip>

              <Tooltip label="Grid Pattern" description="Graph paper for math, tables & diagrams">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={(e) => handlePaperStyleChange('grid', e)}
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                    currentPaperStyle === 'grid'
                      ? 'bg-white text-theme-accent shadow-xs border border-theme-border/80'
                      : 'text-[#675C51] hover:text-theme-text'
                  }`}
                >
                  <Grid size={13} />
                  <span className="hidden md:inline">Grid</span>
                </button>
              </Tooltip>

              <Tooltip label="Dot Matrix" description="Dot grid for bullet journaling & mind maps">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={(e) => handlePaperStyleChange('dot', e)}
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                    currentPaperStyle === 'dot'
                      ? 'bg-white text-theme-accent shadow-xs border border-theme-border/80'
                      : 'text-[#675C51] hover:text-theme-text'
                  }`}
                >
                  <CircleDot size={13} />
                  <span className="hidden md:inline">Dot</span>
                </button>
              </Tooltip>

              <Tooltip label="Blank Paper" description="Clean unlined paper card">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={(e) => handlePaperStyleChange('blank', e)}
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                    currentPaperStyle === 'blank'
                      ? 'bg-white text-theme-accent shadow-xs border border-theme-border/80'
                      : 'text-[#675C51] hover:text-theme-text'
                  }`}
                >
                  <Square size={13} />
                  <span className="hidden md:inline">Blank</span>
                </button>
              </Tooltip>
            </div>
          </div>

          {/* Right: Typography Font Switch & Help Guide Button */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <Tooltip
              label="Toggle Font Style"
              description="Switch between cozy Caveat handwriting & clean Nunito UI text"
            >
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={toggleFontMode}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all duration-150 shadow-xs cursor-pointer ${
                  fontMode === 'handwriting'
                    ? 'bg-[#FFF3B0] text-[#4F4310] border-[#E8DC88] hover:bg-[#FCEBA2]'
                    : 'bg-white text-theme-text border-theme-border hover:bg-theme-sidebar/60'
                }`}
              >
                <Type size={14} className="text-theme-accent" />
                <span className="hidden sm:inline">
                  {fontMode === 'handwriting' ? '✍️ Caveat' : '🔤 Nunito UI'}
                </span>
              </button>
            </Tooltip>

            {/* Help / Keyboard Shortcuts Modal Button */}
            <Tooltip label="Help & Shortcuts" shortcut="?" description="View complete cheatsheet for editor & tools">
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setIsShortcutsOpen(true)}
                className="p-1.5 rounded-xl border border-theme-border bg-white text-[#5D5144] hover:bg-theme-sidebar/70 hover:text-theme-accent transition-colors cursor-pointer shadow-xs"
                aria-label="View Keyboard Shortcuts and Help Guide"
              >
                <HelpCircle size={16} />
              </button>
            </Tooltip>
          </div>
        </div>

        {/* Interactive Vector Drawing Sub-Toolbar */}
        {isDrawingMode && (
          <div className="mt-2 pt-2 border-t border-theme-accent/30 flex items-center justify-between gap-3 overflow-x-auto text-xs bg-amber-50/85 -mx-3 sm:-mx-5 px-3 sm:px-5 py-2 animate-in fade-in slide-in-from-top-1 duration-150 rounded-b-md shadow-inner">
            <div className="flex items-center gap-3 flex-wrap min-w-max">
              {/* Tool Selection: Line, Arrow, Eraser */}
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-amber-200/80 shadow-2xs">
                <Tooltip
                  label="Straight Line / Underline"
                  description="Drag to draw. Auto-snaps horizontal underlines within ±6°"
                >
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => setActiveDrawingTool('line')}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      activeDrawingTool === 'line'
                        ? 'bg-theme-accent text-white shadow-2xs font-bold'
                        : 'text-[#5D5144] hover:bg-amber-100/50'
                    }`}
                  >
                    <Minus size={14} />
                    <span>Line</span>
                  </button>
                </Tooltip>

                <Tooltip
                  label="Concept Arrow"
                  shortcut={`Hold ${shift}`}
                  description="Draw connecting arrow with hand-drawn ink marker. Shift locks 45°"
                >
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => setActiveDrawingTool('arrow')}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      activeDrawingTool === 'arrow'
                        ? 'bg-theme-accent text-white shadow-2xs font-bold'
                        : 'text-[#5D5144] hover:bg-amber-100/50'
                    }`}
                  >
                    <ArrowRight size={14} />
                    <span>Arrow</span>
                  </button>
                </Tooltip>

                <Tooltip label="Eraser Tool" description="Click on any line or arrow on the note to erase it">
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => setActiveDrawingTool('eraser')}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      activeDrawingTool === 'eraser'
                        ? 'bg-red-500 text-white shadow-2xs font-bold'
                        : 'text-[#5D5144] hover:bg-amber-100/50'
                    }`}
                  >
                    <Eraser size={14} />
                    <span>Eraser</span>
                  </button>
                </Tooltip>
              </div>

              {/* Color Palette Selector */}
              <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-xl border border-amber-200/80 shadow-2xs">
                <span className="text-[10px] font-bold text-amber-950 uppercase tracking-wider mr-0.5">Color:</span>
                {PALETTE_COLORS.map((c) => (
                  <Tooltip key={c.hex} label={c.name} description={`Set line stroke color to ${c.name}`}>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => setDrawingColor(c.hex)}
                      className={`w-5 h-5 rounded-full transition-transform cursor-pointer flex items-center justify-center ${
                        drawingColor === c.hex
                          ? 'scale-110 ring-2 ring-offset-1 ring-theme-accent shadow-xs'
                          : 'hover:scale-105 opacity-80 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: c.hex }}
                    >
                      {drawingColor === c.hex && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </button>
                  </Tooltip>
                ))}
              </div>

              {/* Stroke Thickness Selector */}
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-amber-200/80 shadow-2xs">
                <Tooltip label="2px Fine Stroke" description="Delicate thin line suitable for underlines">
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => setDrawingStrokeWidth(2)}
                    className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                      drawingStrokeWidth === 2
                        ? 'bg-amber-200/80 text-amber-950 font-bold'
                        : 'text-[#6A5D4D] hover:bg-amber-50'
                    }`}
                  >
                    2px Fine
                  </button>
                </Tooltip>

                <Tooltip label="4px Bold Stroke" description="Thick prominent stroke for headers & arrows">
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => setDrawingStrokeWidth(4)}
                    className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                      drawingStrokeWidth === 4
                        ? 'bg-amber-200/80 text-amber-950 font-bold'
                        : 'text-[#6A5D4D] hover:bg-amber-50'
                    }`}
                  >
                    4px Bold
                  </button>
                </Tooltip>
              </div>

              {/* Stroke Style: Solid vs. Dashed */}
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-amber-200/80 shadow-2xs">
                <Tooltip label="Solid Line" description="Continuous unbroken stroke">
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => setDrawingIsDashed(false)}
                    className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                      !drawingIsDashed
                        ? 'bg-amber-200/80 text-amber-950 font-bold'
                        : 'text-[#6A5D4D] hover:bg-amber-50'
                    }`}
                  >
                    Solid
                  </button>
                </Tooltip>

                <Tooltip label="Dashed Line" description="Segmented dashed stroke for annotations & dividers">
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => setDrawingIsDashed(true)}
                    className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                      drawingIsDashed
                        ? 'bg-amber-200/80 text-amber-950 font-bold'
                        : 'text-[#6A5D4D] hover:bg-amber-50'
                    }`}
                  >
                    Dashed
                  </button>
                </Tooltip>
              </div>
            </div>

            {/* Right Actions: Undo, Clear All, Exit Draw Mode */}
            <div className="flex items-center gap-1.5 min-w-max flex-shrink-0">
              {/* Undo Last Vector Shape */}
              <Tooltip label="Undo Last Line" shortcut={`${cmd}Z`} description="Remove the most recently drawn shape">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => undoLastVectorShape(activeNote.id)}
                  disabled={shapes.length === 0}
                  className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-amber-100/60 disabled:opacity-40 disabled:hover:bg-white border border-amber-200/80 rounded-lg text-xs text-[#5D5144] font-medium transition-colors cursor-pointer"
                >
                  <RotateCcw size={13} className="text-theme-accent" />
                  <span>Undo</span>
                  {shapes.length > 0 && (
                    <span className="text-[10px] text-amber-800 font-bold">({shapes.length})</span>
                  )}
                </button>
              </Tooltip>

              {/* Clear All Vector Shapes */}
              <Tooltip
                label={isConfirmingClear ? 'Click again to confirm' : 'Clear All Lines'}
                description="Erase all drawn lines and arrows from this note"
              >
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={handleClearAllShapes}
                  disabled={shapes.length === 0}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isConfirmingClear
                      ? 'bg-red-600 text-white animate-pulse'
                      : 'bg-white hover:bg-red-50 text-red-700 border border-amber-200/80 disabled:opacity-40 disabled:hover:bg-white'
                  }`}
                >
                  <Trash2 size={13} className={isConfirmingClear ? 'text-white' : 'text-red-500'} />
                  <span>{isConfirmingClear ? 'Confirm Clear?' : 'Clear'}</span>
                </button>
              </Tooltip>

              {/* Exit Drawing Mode Button */}
              <Tooltip label="Exit Draw Mode" shortcut="Esc" description="Return to text typing & editing">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setActiveDrawingTool('none')}
                  className="flex items-center gap-1.5 px-3 py-1 bg-theme-accent hover:bg-[#C26325] text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer ml-1"
                >
                  <Check size={14} />
                  <span>Done</span>
                </button>
              </Tooltip>
            </div>
          </div>
        )}

        {/* Quick Table Sub-Bar when cursor is inside a table */}
        {isInsideTable && !isDrawingMode && (
          <div className="mt-2 pt-2 border-t border-theme-border/60 flex items-center justify-between gap-2 overflow-x-auto text-xs bg-amber-50/70 -mx-3 sm:-mx-5 px-3 sm:px-5 py-1.5 animate-in fade-in duration-100">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-900 flex-shrink-0">
              <span>📊 Active Table:</span>
            </div>

            <div className="flex items-center gap-1 min-w-max">
              <Tooltip label="Add Row Above" description="Insert an empty row above current cell">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => editor.chain().focus().addRowBefore().run()}
                  className="flex items-center gap-1 px-2 py-1 bg-white hover:bg-amber-100/60 border border-theme-border/70 rounded-md text-[11px] text-[#4A4036] cursor-pointer"
                >
                  <Rows size={12} className="text-theme-accent" />
                  <span>+ Row Above</span>
                </button>
              </Tooltip>

              <Tooltip label="Add Row Below" description="Insert an empty row below current cell">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => editor.chain().focus().addRowAfter().run()}
                  className="flex items-center gap-1 px-2 py-1 bg-white hover:bg-amber-100/60 border border-theme-border/70 rounded-md text-[11px] text-[#4A4036] cursor-pointer"
                >
                  <Rows size={12} className="text-theme-accent" />
                  <span>+ Row Below</span>
                </button>
              </Tooltip>

              <Tooltip label="Add Column Left" description="Insert an empty column to the left">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => editor.chain().focus().addColumnBefore().run()}
                  className="flex items-center gap-1 px-2 py-1 bg-white hover:bg-amber-100/60 border border-theme-border/70 rounded-md text-[11px] text-[#4A4036] cursor-pointer"
                >
                  <Columns size={12} className="text-theme-accent" />
                  <span>+ Col Left</span>
                </button>
              </Tooltip>

              <Tooltip label="Add Column Right" description="Insert an empty column to the right">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => editor.chain().focus().addColumnAfter().run()}
                  className="flex items-center gap-1 px-2 py-1 bg-white hover:bg-amber-100/60 border border-theme-border/70 rounded-md text-[11px] text-[#4A4036] cursor-pointer"
                >
                  <Columns size={12} className="text-theme-accent" />
                  <span>+ Col Right</span>
                </button>
              </Tooltip>

              <Tooltip label="Delete Row" description="Delete the row containing the cursor">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => editor.chain().focus().deleteRow().run()}
                  className="flex items-center gap-1 px-2 py-1 bg-white hover:bg-red-50 border border-theme-border/70 rounded-md text-[11px] text-red-700 cursor-pointer"
                >
                  <Trash2 size={12} className="text-red-500" />
                  <span>Del Row</span>
                </button>
              </Tooltip>

              <Tooltip label="Delete Column" description="Delete the column containing the cursor">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => editor.chain().focus().deleteColumn().run()}
                  className="flex items-center gap-1 px-2 py-1 bg-white hover:bg-red-50 border border-theme-border/70 rounded-md text-[11px] text-red-700 cursor-pointer"
                >
                  <Trash2 size={12} className="text-red-500" />
                  <span>Del Col</span>
                </button>
              </Tooltip>

              <Tooltip label="Delete Table" description="Remove entire table structure">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => editor.chain().focus().deleteTable().run()}
                  className="flex items-center gap-1 px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-[11px] font-bold cursor-pointer shadow-xs ml-1"
                >
                  <Trash2 size={12} />
                  <span>Delete Table</span>
                </button>
              </Tooltip>
            </div>
          </div>
        )}
      </div>

      {/* Shortcuts & Help Guide Modal */}
      <ShortcutsModal isOpen={isShortcutsOpen} onClose={() => setIsShortcutsOpen(false)} />
    </>
  );
};
