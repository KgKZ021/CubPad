import React, { useState, useEffect, useCallback } from 'react';
import { Editor } from '@tiptap/react';
import { Plus } from 'lucide-react';
import { Extension } from '@tiptap/react';

// Custom TipTap Extension: Pressing Enter in the last row automatically appends a new row
export const TableEnterRow = Extension.create({
  name: 'tableEnterRow',
  addKeyboardShortcuts() {
    return {
      Enter: () => {
        const { state } = this.editor;
        const { $from } = state.selection;
        let cellDepth = -1;
        for (let d = $from.depth; d > 0; d--) {
          const node = $from.node(d);
          if (node.type.name === 'tableCell' || node.type.name === 'tableHeader') {
            cellDepth = d;
            break;
          }
        }
        if (cellDepth > 1) {
          const tableNode = $from.node(cellDepth - 2);
          if (tableNode && tableNode.type.name === 'table') {
            const rowIndex = $from.index(cellDepth - 2);
            if (rowIndex === tableNode.childCount - 1) {
              return this.editor.commands.addRowAfter();
            }
          }
        }
        return false;
      },
    };
  },
});

interface TableExtensionControlsProps {
  editor: Editor | null;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export const TableExtensionControls: React.FC<TableExtensionControlsProps> = ({
  editor,
  containerRef,
}) => {
  const [tableRect, setTableRect] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);

  const updateTablePosition = useCallback(() => {
    if (!editor || !containerRef.current) {
      setTableRect(null);
      return;
    }

    if (!editor.isActive('table')) {
      setTableRect(null);
      return;
    }

    // Find active table in current editor DOM
    const editorDom = editor.view.dom;
    const selectedCell = editorDom.querySelector('.selectedCell');
    const tableEl =
      selectedCell?.closest('table') ||
      editorDom.querySelector('table:hover') ||
      editorDom.querySelector('table');

    if (!tableEl) {
      setTableRect(null);
      return;
    }

    const containerRect = containerRef.current.getBoundingClientRect();
    const tRect = tableEl.getBoundingClientRect();

    setTableRect({
      top: tRect.top - containerRect.top,
      left: tRect.left - containerRect.left,
      width: tRect.width,
      height: tRect.height,
    });
  }, [editor, containerRef]);

  useEffect(() => {
    if (!editor) return;

    editor.on('selectionUpdate', updateTablePosition);
    editor.on('transaction', updateTablePosition);
    window.addEventListener('resize', updateTablePosition);

    updateTablePosition();

    return () => {
      editor.off('selectionUpdate', updateTablePosition);
      editor.off('transaction', updateTablePosition);
      window.removeEventListener('resize', updateTablePosition);
    };
  }, [editor, updateTablePosition]);

  if (!editor || !tableRect || !editor.isActive('table')) {
    return null;
  }

  const handleAddRow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    editor.chain().focus().addRowAfter().run();
  };

  const handleAddColumn = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    editor.chain().focus().addColumnAfter().run();
  };

  return (
    <>
      {/* Floating Add Column Button along Right Edge of Table */}
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={handleAddColumn}
        style={{
          top: `${tableRect.top + Math.max(10, tableRect.height / 2 - 12)}px`,
          left: `${tableRect.left + tableRect.width + 6}px`,
        }}
        className="table-quick-add-col absolute z-30 flex items-center justify-center w-6 h-6 rounded-full bg-amber-500 hover:bg-amber-600 text-white shadow-md border border-white cursor-pointer transition-transform duration-100 hover:scale-110 active:scale-95"
        title="Add Column to Table"
        aria-label="Add Column to Table"
      >
        <Plus size={13} strokeWidth={3} />
      </button>

      {/* Floating Add Row Button along Bottom Edge of Table */}
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={handleAddRow}
        style={{
          top: `${tableRect.top + tableRect.height + 6}px`,
          left: `${tableRect.left + Math.max(10, tableRect.width / 2 - 12)}px`,
        }}
        className="table-quick-add-row absolute z-30 flex items-center justify-center w-6 h-6 rounded-full bg-amber-500 hover:bg-amber-600 text-white shadow-md border border-white cursor-pointer transition-transform duration-100 hover:scale-110 active:scale-95"
        title="Add Row to Table"
        aria-label="Add Row to Table"
      >
        <Plus size={13} strokeWidth={3} />
      </button>
    </>
  );
};
