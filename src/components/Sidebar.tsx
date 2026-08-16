import React, { useState } from 'react';
import { useNoteZustandStore } from '../stores/useNoteZustandStore';
import { Plus, BookOpen, Trash2, Tag, Calendar, Sparkles, X } from 'lucide-react';

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

  // Extract unique categories
  const categories = ['All', ...Array.from(new Set(notes.map((n) => n.category)))];

  const filteredNotes = notes.filter((note) => {
    const matchesCategory =
      selectedCategory === 'All' || note.category === selectedCategory;
    const matchesSearch =
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.contentHtml.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-theme-accent hover:bg-[#C26325] text-white font-display font-semibold text-sm rounded-xl shadow-cozy transition-all duration-150 active:scale-[0.98]"
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>+ New Note</span>
          </button>

          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/80 focus:bg-white text-xs px-3 py-2 rounded-lg border border-theme-border/80 focus:outline-none focus:ring-2 focus:ring-theme-accent/30 placeholder:text-[#9F9386] transition-colors"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="px-3 pt-2.5 pb-2 border-b border-theme-border/60 overflow-x-auto flex gap-1.5 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-theme-accent text-white shadow-xs'
                  : 'bg-white/60 text-[#675C51] hover:bg-white/90'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Notes List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
          {filteredNotes.length === 0 ? (
            <div className="p-6 text-center text-xs text-[#8E8276] flex flex-col items-center gap-2 mt-4">
              <span className="text-3xl opacity-70">🐶</span>
              <span className="font-semibold text-theme-text">No notes found</span>
              <p className="text-[11px] text-[#9F9386]">Click "+ New Note" to start writing!</p>
            </div>
          ) : (
            filteredNotes.map((note) => {
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
                      {note.title || 'Untitled Note'}
                    </h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Delete "${note.title}"?`)) {
                          deleteNote(note.id);
                        }
                      }}
                      className="opacity-0 group-hover:opacity-100 focus:opacity-100 hover:text-red-600 transition-opacity p-1 rounded hover:bg-red-50"
                      title="Delete note"
                      aria-label="Delete note"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-[#8E8276] mt-1.5">
                    <span className="inline-flex items-center gap-1 bg-[#EBE2CF] text-[#554A3E] px-1.5 py-0.5 rounded-md font-semibold">
                      <Tag size={9} />
                      {note.category}
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
            <span>Golden Pup Mode</span>
          </div>
        </div>
      </aside>
    </>
  );
};

