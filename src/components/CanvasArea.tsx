import React, { useState, useEffect } from 'react';
import { useNoteZustandStore } from '../stores/useNoteZustandStore';
import { Type, Clock, Edit3, Check, StickyNote as StickyIcon, Menu, FileText } from 'lucide-react';

export const CanvasArea: React.FC = () => {
  const {
    getActiveNote,
    updateNoteContent,
    updateNoteTitle,
    fontMode,
    toggleFontMode,
    toggleSidebar,
    addNote,
  } = useNoteZustandStore();

  const activeNote = getActiveNote();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState('');
  const [isRawEditing, setIsRawEditing] = useState(false);
  const [rawContent, setRawContent] = useState('');

  useEffect(() => {
    if (activeNote) {
      setTitleInput(activeNote.title);
      setRawContent(activeNote.contentHtml);
    }
  }, [activeNote?.id]);

  if (!activeNote) {
    return (
      <main className="flex-1 h-full bg-theme-primary flex flex-col items-center justify-center p-4 sm:p-8 text-center select-none">
        <div className="max-w-md w-full p-6 sm:p-8 rounded-3xl bg-white/75 border border-theme-border shadow-cozy flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-theme-sidebar border border-theme-border flex items-center justify-center text-3xl">
            🐶
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-theme-text">No Note Selected</h2>
          <p className="text-sm text-[#7E7267] leading-relaxed">
            Select a note from the sidebar or create a new one to start writing your ideas!
          </p>
          <div className="flex flex-wrap gap-2 justify-center mt-2">
            <button
              onClick={() => toggleSidebar()}
              className="md:hidden flex items-center gap-1.5 px-4 py-2 bg-white text-theme-text border border-theme-border rounded-xl text-xs font-semibold hover:bg-theme-sidebar/60"
            >
              <Menu size={15} />
              <span>Browse Notes</span>
            </button>
            <button
              onClick={() => addNote('General', 'New Note')}
              className="flex items-center gap-1.5 px-4 py-2 bg-theme-accent hover:bg-[#C26325] text-white rounded-xl text-xs font-semibold shadow-cozy"
            >
              <FileText size={15} />
              <span>+ Create Note</span>
            </button>
          </div>
        </div>
      </main>
    );
  }

  const handleTitleSubmit = () => {
    if (titleInput.trim()) {
      updateNoteTitle(activeNote.id, titleInput.trim());
    }
    setIsEditingTitle(false);
  };

  const handleContentBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    updateNoteContent(activeNote.id, e.currentTarget.innerHTML);
  };

  const handleRawContentSave = () => {
    updateNoteContent(activeNote.id, rawContent);
    setIsRawEditing(false);
  };

  const paperClass =
    activeNote.backgroundStyle === 'grid'
      ? 'paper-grid'
      : activeNote.backgroundStyle === 'dot'
      ? 'paper-dot'
      : activeNote.backgroundStyle === 'blank'
      ? 'paper-blank'
      : 'paper-lined';

  return (
    <main className="flex-1 h-full bg-theme-primary flex flex-col overflow-hidden min-w-0">
      {/* Top Desk Toolbar Header */}
      <header className="h-16 flex-shrink-0 px-3 sm:px-6 bg-white/80 backdrop-blur border-b border-theme-border flex items-center justify-between gap-2 sm:gap-4 select-none shadow-xs z-10">
        {/* Left: Mobile Toggle & Note Title */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          {/* Mobile Hamburger Menu */}
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 -ml-1 text-theme-text hover:bg-black/5 rounded-lg transition-colors flex-shrink-0"
            aria-label="Toggle notes menu"
          >
            <Menu size={20} />
          </button>

          {isEditingTitle ? (
            <div className="flex items-center gap-1.5 max-w-md w-full">
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
                onBlur={handleTitleSubmit}
                autoFocus
                className="w-full text-base sm:text-lg font-bold font-display px-2 py-1 border border-theme-accent rounded-lg bg-white focus:outline-none ring-2 ring-theme-accent/20"
              />
              <button
                onClick={handleTitleSubmit}
                className="p-1.5 bg-theme-accent text-white rounded-lg hover:bg-[#C26325] flex-shrink-0"
              >
                <Check size={16} />
              </button>
            </div>
          ) : (
            <div
              onClick={() => setIsEditingTitle(true)}
              className="flex items-center gap-1.5 sm:gap-2 cursor-pointer group py-1 px-1.5 sm:px-2 -ml-1 rounded-lg hover:bg-theme-sidebar/50 transition-colors min-w-0 max-w-full"
            >
              <h2 className="text-base sm:text-lg font-bold font-display text-theme-text truncate">
                {activeNote.title}
              </h2>
              <Edit3 size={13} className="text-[#9F9386] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 hidden sm:inline" />
            </div>
          )}

          <span className="hidden lg:inline-flex text-[11px] font-semibold bg-[#EAE1CD] text-[#5A4F43] px-2 py-0.5 rounded-full border border-theme-border flex-shrink-0">
            {activeNote.category}
          </span>
        </div>

        {/* Right: Action Controls & Font Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
          {/* Last Updated Timestamp (Desktop only) */}
          <div className="hidden xl:flex items-center gap-1.5 text-xs text-[#8E8276]">
            <Clock size={13} />
            <span>
              {new Date(activeNote.updatedAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>

          <div className="h-5 w-[1px] bg-theme-border hidden xl:block" />

          {/* Quick Edit HTML Toggle */}
          <button
            onClick={() => {
              if (isRawEditing) {
                handleRawContentSave();
              } else {
                setRawContent(activeNote.contentHtml);
                setIsRawEditing(true);
              }
            }}
            className={`flex items-center gap-1.5 text-xs px-2.5 sm:px-3 py-1.5 rounded-xl border transition-all ${
              isRawEditing
                ? 'bg-theme-accent text-white border-theme-accent font-semibold shadow-xs'
                : 'bg-white text-[#5D5144] border-theme-border hover:bg-theme-sidebar/60'
            }`}
            title="HTML Source Editor"
          >
            <Edit3 size={14} />
            <span className="hidden sm:inline">{isRawEditing ? 'Save & Preview' : 'Edit HTML'}</span>
          </button>

          {/* Font Toggle Button */}
          <button
            onClick={toggleFontMode}
            className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl border transition-all duration-200 text-xs font-semibold ${
              fontMode === 'handwriting'
                ? 'bg-[#FFF3B0] text-[#4F4310] border-[#E8DC88] shadow-sticky'
                : 'bg-white text-theme-text border-theme-border hover:bg-theme-sidebar/60'
            }`}
            title="Toggle Font (Handwriting / Clean UI)"
          >
            <Type size={14} />
            <span className="hidden sm:inline">
              {fontMode === 'handwriting' ? '✍️ Handwriting' : '🔤 Clean UI'}
            </span>
          </button>
        </div>
      </header>

      {/* Main Canvas Note Page Area */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-6 md:p-8 flex justify-center items-start">
        <div className="relative w-full max-w-4xl min-h-[500px] mb-8">
          {/* Mobile / Tablet Inlined Sticky Note if present */}
          {activeNote.content?.stickyNotes && activeNote.content.stickyNotes.length > 0 && !isRawEditing && (
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

          {/* Note Paper Sheet */}
          <div
            className={`w-full min-h-[500px] sm:min-h-[580px] p-4 sm:p-8 md:p-12 rounded-2xl border border-theme-border shadow-cozy-md ${paperClass} transition-all duration-150 overflow-x-auto`}
          >
            {isRawEditing ? (
              <div className="flex flex-col gap-3">
                <div className="text-xs text-[#7E7267] font-semibold flex items-center gap-1">
                  <span>HTML Editor for Note Content:</span>
                </div>
                <textarea
                  value={rawContent}
                  onChange={(e) => setRawContent(e.target.value)}
                  rows={18}
                  className="w-full font-mono text-xs p-4 rounded-xl border border-theme-border bg-white text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-accent"
                />
              </div>
            ) : (
              <div
                contentEditable
                suppressContentEditableWarning
                onBlur={handleContentBlur}
                className={`outline-none prose prose-stone max-w-none break-words transition-all duration-150 ${
                  fontMode === 'handwriting'
                    ? 'font-handwriting text-xl sm:text-2xl leading-relaxed'
                    : 'font-ui text-sm sm:text-base leading-normal'
                }`}
                dangerouslySetInnerHTML={{ __html: activeNote.contentHtml }}
              />
            )}
          </div>

          {/* Desktop Floating Sticky Note */}
          {activeNote.content?.stickyNotes && activeNote.content.stickyNotes.length > 0 && !isRawEditing && (
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
    </main>
  );
};

