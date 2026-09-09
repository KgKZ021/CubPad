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

import { TableBlockItem, PaperStyle } from '../../types/note';
import { useNoteZustandStore } from '../../stores/useNoteZustandStore';
import { TableEnterRow, TableExtensionControls } from '../Editor/TableExtensionControls';

interface CanvasTableBlockProps {
  noteId: string;
  tableBlock: TableBlockItem;
  containerRef: React.RefObject<HTMLDivElement | null>;
  paperStyle: PaperStyle;
}

export const CanvasTableBlock: React.FC<CanvasTableBlockProps> = ({
  noteId,
  tableBlock,
  containerRef,
  paperStyle,
}) => {
  const {
    updateTableBlockPosition,
    updateTableBlockContent,
    deleteTableBlock,
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
    content: tableBlock.contentHtml || '',
    editorProps: {
      attributes: {
        class: 'tiptap focus:outline-none min-h-[32px] max-w-none text-selectable',
      },
    },
    onFocus: () => {
      setActiveBlockId(tableBlock.id);
      if (editor) {
        setActiveEditor(editor);
      }
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      updateTableBlockContent(noteId, tableBlock.id, html);
    },
  });

  // Sync content if changed from external store update
  useEffect(() => {
    if (!editor) return;
    const currentHtml = editor.getHTML();
    if (tableBlock.contentHtml !== undefined && !editor.isFocused && currentHtml !== tableBlock.contentHtml) {
      editor.commands.setContent(tableBlock.contentHtml, { emitUpdate: false });
    }
  }, [tableBlock.contentHtml, editor]);

  // Set active editor on mount if this is the active block
  useEffect(() => {
    if (editor && activeBlockId === tableBlock.id) {
      setActiveEditor(editor);
    }
  }, [editor, activeBlockId, tableBlock.id, setActiveEditor]);

  // Drag handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
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
    setActiveBlockId(tableBlock.id);
    if (editor) {
      setActiveEditor(editor);
    }

    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: tableBlock.x,
      initialY: tableBlock.y,
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

    if (snapToPaperLines && paperStyle === 'lined') {
      newY = Math.max(0, Math.round(newY / 32) * 32);
    }

    if (containerRef.current) {
      const maxBoundX = Math.max(10, containerRef.current.clientWidth - 120);
      newX = Math.max(10, Math.min(maxBoundX, newX));
    } else {
      newX = Math.max(10, newX);
    }
    newY = Math.max(0, newY);

    updateTableBlockPosition(noteId, tableBlock.id, Math.round(newX), Math.round(newY));
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

  const isActive = activeBlockId === tableBlock.id;

  const fontClass =
    fontMode === 'steward'
      ? 'font-steward text-base'
      : fontMode === 'handwriting'
      ? 'font-handwriting text-lg'
      : 'font-ui text-sm';

  return (
    <div
      ref={blockRef}
      style={{
        transform: `translate3d(${tableBlock.x}px, ${tableBlock.y}px, 0)`,
        width: tableBlock.width ? `${tableBlock.width}px` : undefined,
        minWidth: '280px',
      }}
      className={`canvas-block-wrapper absolute top-0 left-0 z-20 group rounded-xl bg-white/90 shadow-sm border border-theme-border/80 transition-shadow duration-100 ${
        isDragging ? 'shadow-md ring-2 ring-amber-400 z-30 cursor-grabbing' : ''
      } ${isActive ? 'ring-2 ring-amber-400/80 border-amber-400' : 'hover:border-theme-accent/60'}`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Drag Handle Header */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="canvas-block-handle flex items-center justify-between px-2.5 py-1 bg-amber-100/90 backdrop-blur-xs rounded-t-xl border-b border-amber-200/70 text-[#7E7267] cursor-grab active:cursor-grabbing select-none"
      >
        <div className="flex items-center gap-1.5">
          <GripVertical size={12} className="text-amber-800/60" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900/80">📊 Table Block</span>
        </div>

        <button
          type="button"
          onClick={() => deleteTableBlock(noteId, tableBlock.id)}
          className="p-0.5 rounded hover:bg-red-100 hover:text-red-700 transition-colors opacity-70 hover:opacity-100 cursor-pointer"
          title="Delete Table Block"
        >
          <X size={12} />
        </button>
      </div>

      {/* Editor Content with Table */}
      <div className={`p-2.5 sm:p-3 overflow-x-auto text-selectable ${fontClass}`}>
        <EditorContent editor={editor} />
      </div>

      {/* Table Quick-Add Buttons (+ row, + col) */}
      <TableExtensionControls editor={editor} containerRef={blockRef} />
    </div>
  );
};
