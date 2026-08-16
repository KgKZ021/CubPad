import React, { useState, useEffect } from 'react';
import { useNoteZustandStore } from '../stores/useNoteZustandStore';
import { Clock, Edit3, Check, Menu, FileText, Code } from 'lucide-react';
import { CubEditor } from './Editor/CubEditor';
import { Tooltip } from './UI/Tooltip';

export const CanvasArea: React.FC = () => {
  const {
    getActiveNote,
    updateNoteContent,
    updateNoteTitle,
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

  const handleRawContentSave = () => {
    updateNoteContent(activeNote.id, rawContent);
    setIsRawEditing(false);
  };

  return (
    <main className="flex-1 h-full bg-theme-primary flex flex-col overflow-hidden min-w-0">
      {/* Top Desk Toolbar Header */}
      <header className="h-14 flex-shrink-0 px-3 sm:px-6 bg-white/90 backdrop-blur border-b border-theme-border flex items-center justify-between gap-2 sm:gap-4 select-none shadow-xs z-10">
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
            <Tooltip label="Rename Note" description="Click to edit note title" position="bottom">
              <div
                onClick={() => setIsEditingTitle(true)}
                className="flex items-center gap-1.5 sm:gap-2 cursor-pointer group py-1 px-1.5 sm:px-2 -ml-1 rounded-lg hover:bg-theme-sidebar/50 transition-colors min-w-0 max-w-full"
              >
                <h2 className="text-base sm:text-lg font-bold font-display text-theme-text truncate">
                  {activeNote.title}
                </h2>
                <Edit3 size={13} className="text-[#9F9386] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 hidden sm:inline" />
              </div>
            </Tooltip>
          )}

          <span className="hidden lg:inline-flex text-[11px] font-semibold bg-[#EAE1CD] text-[#5A4F43] px-2 py-0.5 rounded-full border border-theme-border flex-shrink-0">
            {activeNote.category}
          </span>
        </div>

        {/* Right: Timestamp & Raw HTML Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
          {/* Last Updated Timestamp */}
          <div className="hidden xl:flex items-center gap-1.5 text-xs text-[#8E8276]">
            <Clock size={13} />
            <span>
              {new Date(activeNote.updatedAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>

          <div className="h-4 w-[1px] bg-theme-border hidden xl:block" />

          {/* Quick Edit HTML Toggle */}
          <Tooltip label={isRawEditing ? 'Save & Preview' : 'Source Code Editor'} description="View or edit direct HTML source markup">
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
              aria-label="HTML Source Editor"
            >
              <Code size={14} />
              <span className="hidden sm:inline">{isRawEditing ? 'Save & Preview' : 'Source'}</span>
            </button>
          </Tooltip>
        </div>
      </header>

      {/* Main Note Canvas / Editor */}
      {isRawEditing ? (
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center items-start">
          <div className="max-w-4xl w-full bg-white p-6 rounded-2xl border border-theme-border shadow-cozy flex flex-col gap-3">
            <div className="text-xs text-[#7E7267] font-semibold flex items-center justify-between">
              <span>Raw HTML Source:</span>
              <button
                onClick={handleRawContentSave}
                className="px-3 py-1 bg-theme-accent text-white text-xs rounded-lg font-semibold hover:bg-[#C26325]"
              >
                Save & Exit
              </button>
            </div>
            <textarea
              value={rawContent}
              onChange={(e) => setRawContent(e.target.value)}
              rows={20}
              className="w-full font-mono text-xs p-4 rounded-xl border border-theme-border bg-[#FAF6EE] text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-accent"
            />
          </div>
        </div>
      ) : (
        <CubEditor />
      )}
    </main>
  );
};
