import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNoteZustandStore } from '../stores/useNoteZustandStore';
import { Plus, BookOpen, Trash2, Tag, Calendar, Sparkles, X, Search, StickyNote as StickyIcon } from 'lucide-react';
import { Tooltip } from './UI/Tooltip';

function stripHtml(html: string): string {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
}

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query.trim() || !text) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-amber-200 text-amber-950 px-0.5 rounded font-bold">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

function getSnippet(fullText: string, query: string): string | null {
  if (!query.trim() || !fullText) return null;
  const index = fullText.toLowerCase().indexOf(query.toLowerCase());
  if (index === -1) return null;

  const start = Math.max(0, index - 20);
  const end = Math.min(fullText.length, index + query.length + 40);
  const snippet = fullText.substring(start, end);

  return `${start > 0 ? '…' : ''}${snippet}${end < fullText.length ? '…' : ''}`;
}

export const Sidebar: React.FC = () => {
  const {
    notes,
    activeNoteId,
    selectNote,
    addNote,
    deleteNote,
    isSidebarOpen,
    setSidebarOpen,
  } = useNoteZustandStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
  const cmd = isMac ? '⌘' : 'Ctrl';

  // Global shortcut (Cmd+F / Ctrl+F) to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Extract unique categories
  const categories = useMemo(() => ['All', ...Array.from(new Set(notes.map((n) => n.category)))], [notes]);

  const searchResults = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return notes
      .filter((note) => {
        const matchesCategory = selectedCategory === 'All' || note.category === selectedCategory;
        if (!matchesCategory) return false;
        if (!query) return true;

        const bodyPlainText = stripHtml(note.contentHtml);
        const stickiesText = (note.stickyNotes || note.content?.stickyNotes || [])
          .map((s) => `${s.title || ''} ${s.text}`)
          .join(' ');

        return (
          note.title.toLowerCase().includes(query) ||
          note.category.toLowerCase().includes(query) ||
          bodyPlainText.toLowerCase().includes(query) ||
          stickiesText.toLowerCase().includes(query)
        );
      })
      .map((note) => {
        if (!query) {
          return { note, matchSnippet: null, matchSource: null };
        }

        const bodyPlainText = stripHtml(note.contentHtml);
        const bodySnippet = getSnippet(bodyPlainText, query);

        let stickySnippet: string | null = null;
        const stickies = note.stickyNotes || note.content?.stickyNotes || [];
        for (const s of stickies) {
          const match = getSnippet(`${s.title ? s.title + ': ' : ''}${s.text}`, query);
          if (match) {
            stickySnippet = match;
            break;
          }
        }

        return {
          note,
          matchSnippet: bodySnippet || stickySnippet,
          matchSource: bodySnippet ? 'body' : stickySnippet ? 'sticky' : null,
        };
      });
  }, [notes, selectedCategory, searchTerm]);

  const handleCreateNote = () => {
    const category = selectedCategory === 'All' ? 'General' : selectedCategory;
    const newId = addNote(category, 'New Note');
    selectNote(newId);
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-[280px] sm:w-[300px] md:static md:w-[280px] md:translate-x-0
          h-full flex-shrink-0 bg-theme-sidebar border-r border-theme-border flex flex-col justify-between select-none
          transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Brand & Header */}
        <div className="p-4 border-b border-theme-border flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl" role="img" aria-label="paw">🐾</span>
              <div>
                <h1 className="font-display font-bold text-lg text-theme-text leading-tight tracking-tight">
                  Cub Pad
                </h1>
                <p className="text-[11px] text-[#7E7267] font-medium">Cozy Study & Journal Desk</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#E8DFC8] text-[#5D5144] font-bold border border-[#D8CBAF]">
                v0.1
              </span>
              {/* Close Button on Mobile */}
              <button
                onClick={() => setSidebarOpen(false)}
                className="md:hidden p-1.5 text-[#7E7267] hover:text-theme-text hover:bg-black/5 rounded-lg transition-colors"
                aria-label="Close sidebar"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* New Note Action */}
          <button
            onClick={handleCreateNote}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-theme-accent hover:bg-[#C26325] text-white font-display font-semibold text-sm rounded-xl shadow-cozy transition-all duration-150 active:scale-[0.98] cursor-pointer"
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>New Note</span>
          </button>

          {/* Search Input with Shortcut Badge */}
          <div className="relative flex items-center">
            <Search size={14} className="absolute left-3 text-[#9F9386] pointer-events-none flex-shrink-0" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder={`Search notes (${cmd}F)...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/90 focus:bg-white text-xs pl-9 pr-11 py-2 rounded-xl border border-theme-border/80 focus:outline-none focus:ring-2 focus:ring-theme-accent/30 placeholder:text-[#9F9386] transition-colors shadow-2xs leading-normal"
            />
            {searchTerm ? (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 p-1 text-[#9F9386] hover:text-theme-text transition-colors cursor-pointer flex items-center justify-center"
                title="Clear search"
              >
                <X size={13} />
              </button>
            ) : (
              <kbd className="absolute right-2.5 px-1.5 py-0.5 text-[9px] font-mono text-[#9F9386] bg-black/5 border border-black/10 rounded pointer-events-none hidden sm:inline-block">
                {cmd}F
              </kbd>
            )}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="px-3 pt-2.5 pb-2 border-b border-theme-border/60 overflow-x-auto flex gap-1.5 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-theme-accent text-white shadow-xs'
                  : 'bg-white/60 text-[#675C51] hover:bg-white/90'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Results Summary Banner when query is active */}
        {searchTerm.trim() && (
          <div className="px-3 py-1.5 bg-amber-50/80 border-b border-amber-200/60 flex items-center justify-between text-[11px] text-amber-950">
            <span>
              {searchResults.length} {searchResults.length === 1 ? 'match' : 'matches'} found
            </span>
            <button
              onClick={() => setSearchTerm('')}
              className="text-amber-800 hover:text-amber-950 font-bold underline cursor-pointer text-[10px]"
            >
              Clear
            </button>
          </div>
        )}

        {/* Notes List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
          {searchResults.length === 0 ? (
            <div className="p-6 text-center text-xs text-[#8E8276] flex flex-col items-center gap-2 mt-4">
              <span className="text-3xl opacity-70">🐶</span>
              <span className="font-semibold text-theme-text">No notes match your search</span>
              <p className="text-[11px] text-[#9F9386]">Try searching with a different term or clear filters.</p>
            </div>
          ) : (
            searchResults.map(({ note, matchSnippet, matchSource }) => {
              const isActive = note.id === activeNoteId;
              return (
                <div
                  key={note.id}
                  onClick={() => selectNote(note.id)}
                  className={`group relative p-3 rounded-xl cursor-pointer border transition-all duration-150 ${
                    isActive
                      ? 'bg-white border-theme-accent shadow-cozy text-theme-text font-medium'
                      : 'bg-white/50 hover:bg-white/80 border-transparent hover:border-theme-border text-[#5D5144]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <h3 className="text-xs font-bold leading-snug line-clamp-1 flex-1 font-display">
                      {highlightMatch(note.title || 'Untitled Note', searchTerm)}
                    </h3>
                    <Tooltip label="Delete note" position="left">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Delete "${note.title}"?`)) {
                            deleteNote(note.id);
                          }
                        }}
                        className="opacity-0 group-hover:opacity-100 focus:opacity-100 hover:text-red-600 transition-opacity p-1 rounded hover:bg-red-50 cursor-pointer"
                        aria-label="Delete note"
                      >
                        <Trash2 size={13} />
                      </button>
                    </Tooltip>
                  </div>

                  {/* Highlighted Match Snippet Preview */}
                  {matchSnippet && (
                    <div className="text-[11px] text-[#7E7267] bg-amber-50/70 p-1.5 rounded-md border border-amber-200/50 mb-1.5 line-clamp-2 leading-relaxed">
                      {matchSource === 'sticky' && (
                        <span className="inline-flex items-center gap-0.5 text-[9px] font-bold uppercase text-amber-800 mr-1 bg-amber-100/90 px-1 py-0.2 rounded">
                          <StickyIcon size={9} />
                          Memo
                        </span>
                      )}
                      {highlightMatch(matchSnippet, searchTerm)}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[10px] text-[#8E8276] mt-1">
                    <span className="inline-flex items-center gap-1 bg-[#EBE2CF] text-[#554A3E] px-1.5 py-0.5 rounded-md font-semibold">
                      <Tag size={9} />
                      {highlightMatch(note.category, searchTerm)}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Calendar size={9} />
                      {formatDate(note.updatedAt)}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Cozy Footer Badge */}
        <div className="p-3 border-t border-theme-border bg-theme-sidebar/90 flex items-center justify-between text-[11px] text-[#7E7267]">
          <div className="flex items-center gap-1.5 font-medium">
            <BookOpen size={13} className="text-theme-accent" />
            <span>{notes.length} {notes.length === 1 ? 'Note' : 'Notes'}</span>
          </div>
          <div className="flex items-center gap-1 text-[#9F9386]">
            <Sparkles size={12} className="text-amber-500" />
            <span>Local Desk Storage</span>
          </div>
        </div>
      </aside>
    </>
  );
};
