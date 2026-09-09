import React, { useRef, useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import { GripVertical, X } from 'lucide-react';

import { TextBlockItem, PaperStyle } from '../../types/note';
import { useNoteZustandStore } from '../../stores/useNoteZustandStore';
import { TableEnterRow, TableExtensionControls } from '../Editor/TableExtensionControls';

interface CanvasTextBlockProps {
  noteId: string;
  block: TextBlockItem;
  containerRef: React.RefObject<HTMLDivElement | null>;
  paperStyle: PaperStyle;
  isOnlyBlock: boolean;
}

export const CanvasTextBlock: React.FC<CanvasTextBlockProps> = ({
  noteId,
  block,
  containerRef,
  paperStyle,
  isOnlyBlock,
}) => {
  const {
    updateTextBlockPosition,
    updateTextBlockContent,
    deleteTextBlock,
    setActiveEditor,
    setActiveBlockId,
    activeBlockId,
    snapToPaperLines,
    fontMode,
  } = useNoteZustandStore();

  const blockRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number } | null>(null);

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
      TableEnterRow,
    ],
    content: block.contentHtml || '<p></p>',
    editorProps: {
      attributes: {
        class: 'tiptap focus:outline-none min-h-[32px] max-w-none text-selectable',
      },
    },
    onFocus: () => {
      setActiveBlockId(block.id);
      if (editor) {
        setActiveEditor(editor);
      }
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      updateTextBlockContent(noteId, block.id, html);
    },
    onBlur: ({ editor }) => {
      // Auto-cleanup if completely empty and not the only block on canvas
      if (!isOnlyBlock && editor.isEmpty) {
        const text = editor.getText().trim();
        if (!text && !editor.getHTML().includes('<table')) {
          deleteTextBlock(noteId, block.id);
          setActiveEditor(null);
          setActiveBlockId(null);
        }
      }
    },
  });

  // Sync content if updated from external store change
  useEffect(() => {
    if (!editor) return;
    const currentHtml = editor.getHTML();
    if (block.contentHtml !== undefined && !editor.isFocused && currentHtml !== block.contentHtml) {
      editor.commands.setContent(block.contentHtml, { emitUpdate: false });
    }
  }, [block.contentHtml, editor]);

  // Set active editor on mount if this is the active block
  useEffect(() => {
    if (editor && activeBlockId === block.id) {
      setActiveEditor(editor);
    }
  }, [editor, activeBlockId, block.id, setActiveEditor]);

  // Drag handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only drag from header/border, not inside editor text
    const target = e.target as HTMLElement;
    if (target.closest('.tiptap') || target.closest('button')) {
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
    setActiveBlockId(block.id);
    if (editor) {
      setActiveEditor(editor);
    }

    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: block.x,
      initialY: block.y,
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

    // Apply snap to paper lines if enabled (32px grid for lined paper)
    if (snapToPaperLines && paperStyle === 'lined') {
      newY = Math.max(0, Math.round(newY / 32) * 32);
    }

    // Keep within reasonable bounds relative to container
    if (containerRef.current) {
      const maxBoundX = Math.max(10, containerRef.current.clientWidth - 120);
      newX = Math.max(10, Math.min(maxBoundX, newX));
    } else {
      newX = Math.max(10, newX);
    }
    newY = Math.max(0, newY);

    updateTextBlockPosition(noteId, block.id, Math.round(newX), Math.round(newY));
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

  const isActive = activeBlockId === block.id;

  const fontClass =
    fontMode === 'steward'
      ? 'font-steward text-lg'
      : fontMode === 'handwriting'
      ? 'font-handwriting text-xl'
      : 'font-ui text-base';

  return (
    <div
      ref={blockRef}
      style={{
        transform: `translate3d(${block.x}px, ${block.y}px, 0)`,
        width: block.width ? `${block.width}px` : undefined,
        minWidth: '240px',
        maxWidth: '820px',
      }}
      className={`canvas-block-wrapper absolute top-0 left-0 z-20 group rounded-xl transition-all duration-100 ${
        isDragging ? 'shadow-md ring-2 ring-theme-accent/40 z-30 cursor-grabbing' : ''
      } ${isActive ? 'ring-1 ring-theme-accent/30' : 'hover:ring-1 hover:ring-theme-border/60'}`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Discreet Drag Handle Header */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="canvas-block-handle flex items-center justify-between px-2 py-0.5 bg-amber-100/90 backdrop-blur-xs rounded-t-xl border-b border-amber-200/70 text-[#7E7267] cursor-grab active:cursor-grabbing select-none"
      >
        <div className="flex items-center gap-1">
          <GripVertical size={11} className="text-amber-800/60" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900/70">Text Block</span>
        </div>

        {!isOnlyBlock && (
          <button
            type="button"
            onClick={() => deleteTextBlock(noteId, block.id)}
            className="p-0.5 rounded hover:bg-red-100 hover:text-red-700 transition-colors opacity-70 hover:opacity-100 cursor-pointer"
            title="Delete Text Block"
          >
            <X size={11} />
          </button>
        )}
      </div>

      {/* Editor Text Content */}
      <div className={`p-1.5 sm:p-2.5 transition-all text-selectable ${fontClass}`}>
        <EditorContent editor={editor} />
      </div>

      {/* Table Quick-Add Buttons (+ row, + col) if this block contains a table */}
      <TableExtensionControls editor={editor} containerRef={blockRef} />
    </div>
  );
};
