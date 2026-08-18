import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  Note,
  PaperStyle,
  FontFamilyChoice,
  VectorShape,
  DrawingTool,
  StickyNoteItem,
  MascotStickerItem,
} from '../types/note';
import { saveNoteToDisk, loadAllNotesFromDisk, deleteNoteFromDisk } from '../services/tauriStorage';

// Debounce map for note saving
const saveDebounceMap = new Map<string, NodeJS.Timeout>();

function triggerDebouncedSave(note: Note) {
  useNoteZustandStore.setState({ saveStatus: 'saving' });

  const existing = saveDebounceMap.get(note.id);
  if (existing) {
    clearTimeout(existing);
  }

  const timer = setTimeout(async () => {
    await saveNoteToDisk(note);
    useNoteZustandStore.setState({
      saveStatus: 'saved',
      lastSavedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
    saveDebounceMap.delete(note.id);
  }, 400);

  saveDebounceMap.set(note.id, timer);
}

const INITIAL_DEMO_NOTES: Note[] = [
  {
    id: 'note_quickstart_01',
    title: '🐾 Welcome to Cub Pad: Quick Start Guide',
    category: 'Getting Started',
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    theme: 'golden_retriever',
    backgroundStyle: 'lined',
    fontFamily: 'Caveat',
    vectorShapes: [
      {
        id: 'demo_arrow_1',
        type: 'arrow',
        startX: 40,
        startY: 72,
        endX: 380,
        endY: 72,
        color: '#D97736',
        strokeWidth: 2,
        isDashed: false,
      },
      {
        id: 'demo_line_2',
        type: 'line',
        startX: 40,
        startY: 550,
        endX: 320,
        endY: 550,
        color: '#6A8E7F',
        strokeWidth: 2,
        isDashed: true,
      },
    ],
    stickyNotes: [
      {
        id: 'sticky_demo_1',
        title: 'PRO TIP',
        x: 520,
        y: 60,
        color: '#FFF3B0',
        text: '💡 Pro Tip:\nClick on the title in the header above to rename your note anytime!',
        isMinimized: false,
      },
      {
        id: 'sticky_demo_2',
        title: 'STICKY MEMO',
        x: 520,
        y: 280,
        color: '#D4EDDA',
        text: '🐾 Sticky Memo:\nDrag me anywhere on your desk! Double-click margins to add a new card.',
        isMinimized: false,
      },
    ],
    mascotStickers: [
      {
        id: 'stk_demo_1',
        type: 'pup_cheer',
        x: 480,
        y: 470,
        scale: 1.05,
        rotation: 3,
      },
      {
        id: 'stk_demo_2',
        type: 'paw_done',
        x: 620,
        y: 490,
        scale: 0.95,
        rotation: -4,
      },
    ],
    contentHtml: `<h2>🐾 Welcome to Your Cozy Note Desk!</h2>
<p>Cub Pad is designed for delightful, distraction-free <mark data-color="#FFF3B0" style="background-color: #FFF3B0;">studying, journaling, and note-taking</mark>.</p>

<table>
  <thead>
    <tr>
      <th>Feature</th>
      <th>Description</th>
      <th>Quick Tip</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>✍️ Live Editing</strong></td>
      <td>Click anywhere on the paper to type freely.</td>
      <td><mark data-color="#D4EDDA" style="background-color: #D4EDDA;">Edits save automatically!</mark></td>
    </tr>
    <tr>
      <td><strong>🎨 Study Highlighter</strong></td>
      <td>5 pastel colors to highlight vocabulary, terms & ideas.</td>
      <td><mark data-color="#D0E8FF" style="background-color: #D0E8FF;">Click the highlighter icon</mark></td>
    </tr>
    <tr>
      <td><strong>📊 Study Tables</strong></td>
      <td>Insert custom grids and vocabulary presets.</td>
      <td><mark data-color="#E8D7FF" style="background-color: #E8D7FF;">Use the Table dropdown</mark></td>
    </tr>
    <tr>
      <td><strong>📜 Paper Patterns</strong></td>
      <td>Switch between Ruled, Grid, Dot Matrix & Blank.</td>
      <td><mark data-color="#FFD6D6" style="background-color: #FFD6D6;">Toolbar pattern picker</mark></td>
    </tr>
  </tbody>
</table>

<p><strong>Today's Focus:</strong></p>
<ul>
  <li>Explore and customize your study notes</li>
  <li>Try highlighting text with pastel colors</li>
  <li>Insert a Vocabulary table preset from the Table menu</li>
</ul>`,
    content: {
      textHtml: '',
      stickyNotes: [],
      vectors: [],
      stickers: [],
    },
  },
  {
    id: 'note_ideas_02',
    title: '💡 Project Ideas & Daily Reflections',
    category: 'Ideas',
    updatedAt: new Date(Date.now() - 3600000 * 20).toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    theme: 'golden_retriever',
    backgroundStyle: 'grid',
    fontFamily: 'Patrick Hand',
    vectorShapes: [],
    stickyNotes: [
      {
        id: 'sticky_demo_3',
        title: 'REMINDER',
        x: 480,
        y: 80,
        color: '#E8D7FF',
        text: '✨ Reminder:\nSmall daily progress leads to huge long-term results. Keep going!',
        isMinimized: false,
      },
    ],
    mascotStickers: [
      {
        id: 'stk_demo_3',
        type: 'study_star',
        x: 490,
        y: 220,
        scale: 1.1,
        rotation: 6,
      },
    ],
    contentHtml: `<h2>💡 Creative Projects & Inspiration</h2>
<p>Here are a few core ideas and priorities for this week:</p>

<h3>1. Design & Aesthetic Goals</h3>
<ul>
  <li><span style="color: #D97736; font-weight: bold;">Warm & Cozy Palette:</span> Golden retriever tones, creamy paper textures, and soft amber accents.</li>
  <li><span style="color: #2563EB; font-weight: bold;">Fluid Typography:</span> Seamless transitions between Caveat handwriting and clean Nunito sans-serif.</li>
  <li><span style="color: #16A34A; font-weight: bold;">Accessible UI:</span> High-contrast text, clear touch targets (44px+), and smooth animations.</li>
</ul>

<h3>2. Weekly Checklist</h3>
<ul>
  <li>[x] Set up responsive layout for all mobile screens</li>
  <li>[x] Translate all controls and starter guides to English</li>
  <li>[ ] Add audio ambient lofi background sounds (planned)</li>
  <li>[x] Add draggable floating sticky notes & mascot sticker deck</li>
</ul>

<p><em>"Creativity is intelligence having fun." — Albert Einstein</em></p>`,
    content: {
      textHtml: '',
      stickyNotes: [],
      vectors: [],
      stickers: [],
    },
  },
];

interface NoteState {
  notes: Note[];
  activeNoteId: string | null;
  fontMode: 'handwriting' | 'ui';
  isSidebarOpen: boolean;
  isStickerDrawerOpen: boolean;

  // Save Status
  saveStatus: 'saved' | 'saving' | 'error';
  lastSavedAt: string | null;
  forceSaveNow: () => Promise<void>;

  // Drawing Tools Session State
  activeDrawingTool: DrawingTool;
  drawingColor: string;
  drawingStrokeWidth: number;
  drawingIsDashed: boolean;

  // Actions
  hydrateFromDisk: () => Promise<void>;
  addNote: (category?: string, title?: string) => string;
  selectNote: (id: string) => void;
  updateNoteContent: (id: string, contentHtml: string) => void;
  updateNoteTitle: (id: string, title: string) => void;
  updateNoteCategory: (id: string, category: string) => void;
  updateNoteBackgroundStyle: (id: string, backgroundStyle: PaperStyle) => void;
  updateNoteFontFamily: (id: string, fontFamily: FontFamilyChoice) => void;
  deleteNote: (id: string) => void;
  setFontMode: (mode: 'handwriting' | 'ui') => void;
  toggleFontMode: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  toggleSidebar: () => void;
  setStickerDrawerOpen: (isOpen: boolean) => void;
  toggleStickerDrawer: () => void;
  getActiveNote: () => Note | undefined;

  // Drawing Actions
  setActiveDrawingTool: (tool: DrawingTool) => void;
  setDrawingColor: (color: string) => void;
  setDrawingStrokeWidth: (width: number) => void;
  setDrawingIsDashed: (isDashed: boolean) => void;
  addVectorShape: (noteId: string, shape: VectorShape) => void;
  undoLastVectorShape: (noteId: string) => void;
  deleteVectorShape: (noteId: string, shapeId: string) => void;
  clearAllVectorShapes: (noteId: string) => void;

  // Sticky Notes Actions
  addStickyNote: (noteId: string, x?: number, y?: number, color?: string, text?: string, title?: string) => string;
  updateStickyNoteTitle: (noteId: string, id: string, title: string) => void;
  updateStickyNotePosition: (noteId: string, id: string, x: number, y: number) => void;
  updateStickyNoteText: (noteId: string, id: string, text: string) => void;
  updateStickyNoteColor: (noteId: string, id: string, color: string) => void;
  toggleStickyNoteMinimized: (noteId: string, id: string) => void;
  deleteStickyNote: (noteId: string, id: string) => void;

  // Mascot Stickers Actions
  addMascotSticker: (noteId: string, stickerType: string, x: number, y: number, scale?: number, rotation?: number) => string;
  updateMascotStickerPosition: (noteId: string, id: string, x: number, y: number) => void;
  updateMascotStickerScale: (noteId: string, id: string, scale: number) => void;
  deleteMascotSticker: (noteId: string, id: string) => void;
}

export const useNoteZustandStore = create<NoteState>()(
  persist(
    (set, get) => ({
      notes: INITIAL_DEMO_NOTES,
      activeNoteId: 'note_quickstart_01',
      fontMode: 'handwriting',
      isSidebarOpen: false,
      isStickerDrawerOpen: false,

      // Save Status
      saveStatus: 'saved',
      lastSavedAt: 'Saved',

      forceSaveNow: async () => {
        const active = get().getActiveNote();
        if (active) {
          set({ saveStatus: 'saving' });
          await saveNoteToDisk(active);
          set({
            saveStatus: 'saved',
            lastSavedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          });
        }
      },

      // Default drawing tool configuration
      activeDrawingTool: 'none',
      drawingColor: '#4A3B32', // Warm Brown
      drawingStrokeWidth: 2,
      drawingIsDashed: false,

      hydrateFromDisk: async () => {
        const diskNotes = await loadAllNotesFromDisk();
        if (diskNotes && diskNotes.length > 0) {
          set((state) => ({
            notes: diskNotes,
            activeNoteId: diskNotes.some((n) => n.id === state.activeNoteId)
              ? state.activeNoteId
              : diskNotes[0].id,
            saveStatus: 'saved',
            lastSavedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }));
        }
      },

      addNote: (category = 'General', title = 'New Note') => {
        const newId = `note_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const newNote: Note = {
          id: newId,
          title: title || 'New Note',
          category: category || 'General',
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          theme: 'golden_retriever',
          backgroundStyle: 'lined',
          fontFamily: 'Caveat',
          vectorShapes: [],
          stickyNotes: [],
          mascotStickers: [],
          contentHtml: `<h2>🐾 ${title || 'New Note'}</h2><p>Start typing your notes here...</p>`,
          content: {
            textHtml: '',
            stickyNotes: [],
            vectors: [],
            stickers: [],
          },
        };

        set((state) => ({
          notes: [newNote, ...state.notes],
          activeNoteId: newId,
          isSidebarOpen: false,
          saveStatus: 'saving',
        }));

        triggerDebouncedSave(newNote);
        return newId;
      },

      selectNote: (id: string) => {
        set({ activeNoteId: id, isSidebarOpen: false });
      },

      updateNoteContent: (id: string, contentHtml: string) => {
        set((state) => {
          let updatedNote: Note | null = null;
          const updatedNotes = state.notes.map((note) => {
            if (note.id === id) {
              updatedNote = {
                ...note,
                contentHtml,
                updatedAt: new Date().toISOString(),
              };
              return updatedNote;
            }
            return note;
          });

          if (updatedNote) {
            triggerDebouncedSave(updatedNote);
          }
          return { notes: updatedNotes, saveStatus: 'saving' };
        });
      },

      updateNoteTitle: (id: string, title: string) => {
        set((state) => {
          let updatedNote: Note | null = null;
          const updatedNotes = state.notes.map((note) => {
            if (note.id === id) {
              updatedNote = {
                ...note,
                title,
                updatedAt: new Date().toISOString(),
              };
              return updatedNote;
            }
            return note;
          });

          if (updatedNote) {
            triggerDebouncedSave(updatedNote);
          }
          return { notes: updatedNotes, saveStatus: 'saving' };
        });
      },

      updateNoteCategory: (id: string, category: string) => {
        set((state) => {
          let updatedNote: Note | null = null;
          const updatedNotes = state.notes.map((note) => {
            if (note.id === id) {
              updatedNote = {
                ...note,
                category,
                updatedAt: new Date().toISOString(),
              };
              return updatedNote;
            }
            return note;
          });

          if (updatedNote) {
            triggerDebouncedSave(updatedNote);
          }
          return { notes: updatedNotes, saveStatus: 'saving' };
        });
      },

      updateNoteBackgroundStyle: (id: string, backgroundStyle: PaperStyle) => {
        set((state) => {
          let updatedNote: Note | null = null;
          const updatedNotes = state.notes.map((note) => {
            if (note.id === id) {
              updatedNote = {
                ...note,
                backgroundStyle,
                updatedAt: new Date().toISOString(),
              };
              return updatedNote;
            }
            return note;
          });

          if (updatedNote) {
            triggerDebouncedSave(updatedNote);
          }
          return { notes: updatedNotes, saveStatus: 'saving' };
        });
      },

      updateNoteFontFamily: (id: string, fontFamily: FontFamilyChoice) => {
        set((state) => {
          let updatedNote: Note | null = null;
          const updatedNotes = state.notes.map((note) => {
            if (note.id === id) {
              updatedNote = {
                ...note,
                fontFamily,
                updatedAt: new Date().toISOString(),
              };
              return updatedNote;
            }
            return note;
          });

          if (updatedNote) {
            triggerDebouncedSave(updatedNote);
          }
          return { notes: updatedNotes, saveStatus: 'saving' };
        });
      },

      deleteNote: (id: string) => {
        const targetNote = get().notes.find((n) => n.id === id);
        if (targetNote) {
          deleteNoteFromDisk(id, targetNote.title);
        }

        set((state) => {
          const newNotes = state.notes.filter((note) => note.id !== id);
          let newActiveId = state.activeNoteId;
          if (state.activeNoteId === id) {
            newActiveId = newNotes.length > 0 ? newNotes[0].id : null;
          }
          return {
            notes: newNotes,
            activeNoteId: newActiveId,
          };
        });
      },

      setFontMode: (mode: 'handwriting' | 'ui') => {
        set({ fontMode: mode });
      },

      toggleFontMode: () => {
        set((state) => ({
          fontMode: state.fontMode === 'handwriting' ? 'ui' : 'handwriting',
        }));
      },

      setSidebarOpen: (isOpen: boolean) => {
        set({ isSidebarOpen: isOpen });
      },

      toggleSidebar: () => {
        set((state) => ({ isSidebarOpen: !state.isSidebarOpen }));
      },

      setStickerDrawerOpen: (isOpen: boolean) => {
        set({ isStickerDrawerOpen: isOpen });
      },

      toggleStickerDrawer: () => {
        set((state) => ({ isStickerDrawerOpen: !state.isStickerDrawerOpen }));
      },

      getActiveNote: () => {
        const { notes, activeNoteId } = get();
        return notes.find((n) => n.id === activeNoteId);
      },

      // Drawing Actions
      setActiveDrawingTool: (tool: DrawingTool) => {
        set({ activeDrawingTool: tool });
      },

      setDrawingColor: (color: string) => {
        set({ drawingColor: color });
      },

      setDrawingStrokeWidth: (width: number) => {
        set({ drawingStrokeWidth: width });
      },

      setDrawingIsDashed: (isDashed: boolean) => {
        set({ drawingIsDashed: isDashed });
      },

      addVectorShape: (noteId: string, shape: VectorShape) => {
        set((state) => {
          let updatedNote: Note | null = null;
          const updatedNotes = state.notes.map((note) => {
            if (note.id !== noteId) return note;
            const currentShapes = note.vectorShapes || note.content?.vectors || [];
            updatedNote = {
              ...note,
              vectorShapes: [...currentShapes, shape],
              updatedAt: new Date().toISOString(),
            };
            return updatedNote;
          });

          if (updatedNote) {
            triggerDebouncedSave(updatedNote);
          }
          return { notes: updatedNotes, saveStatus: 'saving' };
        });
      },

      undoLastVectorShape: (noteId: string) => {
        set((state) => {
          let updatedNote: Note | null = null;
          const updatedNotes = state.notes.map((note) => {
            if (note.id !== noteId) return note;
            const currentShapes = note.vectorShapes || note.content?.vectors || [];
            if (currentShapes.length === 0) return note;
            updatedNote = {
              ...note,
              vectorShapes: currentShapes.slice(0, -1),
              updatedAt: new Date().toISOString(),
            };
            return updatedNote;
          });

          if (updatedNote) {
            triggerDebouncedSave(updatedNote);
          }
          return { notes: updatedNotes, saveStatus: 'saving' };
        });
      },

      deleteVectorShape: (noteId: string, shapeId: string) => {
        set((state) => {
          let updatedNote: Note | null = null;
          const updatedNotes = state.notes.map((note) => {
            if (note.id !== noteId) return note;
            const currentShapes = note.vectorShapes || note.content?.vectors || [];
            updatedNote = {
              ...note,
              vectorShapes: currentShapes.filter((s) => s.id !== shapeId),
              updatedAt: new Date().toISOString(),
            };
            return updatedNote;
          });

          if (updatedNote) {
            triggerDebouncedSave(updatedNote);
          }
          return { notes: updatedNotes, saveStatus: 'saving' };
        });
      },

      clearAllVectorShapes: (noteId: string) => {
        set((state) => {
          let updatedNote: Note | null = null;
          const updatedNotes = state.notes.map((note) => {
            if (note.id !== noteId) return note;
            updatedNote = {
              ...note,
              vectorShapes: [],
              updatedAt: new Date().toISOString(),
            };
            return updatedNote;
          });

          if (updatedNote) {
            triggerDebouncedSave(updatedNote);
          }
          return { notes: updatedNotes, saveStatus: 'saving' };
        });
      },

      // Sticky Notes Actions
      addStickyNote: (
        noteId: string,
        x = 460,
        y = 100,
        color = '#FFF3B0',
        text = 'New Note...',
        title = 'Memo'
      ) => {
        const newStickyId = `sticky_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const newSticky: StickyNoteItem = {
          id: newStickyId,
          title,
          x,
          y,
          color,
          text,
          isMinimized: false,
        };

        set((state) => {
          let updatedNote: Note | null = null;
          const updatedNotes = state.notes.map((note) => {
            if (note.id !== noteId) return note;
            const currentStickies = note.stickyNotes || note.content?.stickyNotes || [];
            updatedNote = {
              ...note,
              stickyNotes: [...currentStickies, newSticky],
              updatedAt: new Date().toISOString(),
            };
            return updatedNote;
          });

          if (updatedNote) {
            triggerDebouncedSave(updatedNote);
          }
          return { notes: updatedNotes, saveStatus: 'saving' };
        });

        return newStickyId;
      },

      updateStickyNoteTitle: (noteId: string, id: string, title: string) => {
        set((state) => {
          let updatedNote: Note | null = null;
          const updatedNotes = state.notes.map((note) => {
            if (note.id !== noteId) return note;
            const currentStickies = note.stickyNotes || note.content?.stickyNotes || [];
            updatedNote = {
              ...note,
              stickyNotes: currentStickies.map((s) => (s.id === id ? { ...s, title } : s)),
              updatedAt: new Date().toISOString(),
            };
            return updatedNote;
          });

          if (updatedNote) {
            triggerDebouncedSave(updatedNote);
          }
          return { notes: updatedNotes, saveStatus: 'saving' };
        });
      },

      updateStickyNotePosition: (noteId: string, id: string, x: number, y: number) => {
        set((state) => {
          let updatedNote: Note | null = null;
          const updatedNotes = state.notes.map((note) => {
            if (note.id !== noteId) return note;
            const currentStickies = note.stickyNotes || note.content?.stickyNotes || [];
            updatedNote = {
              ...note,
              stickyNotes: currentStickies.map((s) => (s.id === id ? { ...s, x, y } : s)),
              updatedAt: new Date().toISOString(),
            };
            return updatedNote;
          });

          if (updatedNote) {
            triggerDebouncedSave(updatedNote);
          }
          return { notes: updatedNotes, saveStatus: 'saving' };
        });
      },

      updateStickyNoteText: (noteId: string, id: string, text: string) => {
        set((state) => {
          let updatedNote: Note | null = null;
          const updatedNotes = state.notes.map((note) => {
            if (note.id !== noteId) return note;
            const currentStickies = note.stickyNotes || note.content?.stickyNotes || [];
            updatedNote = {
              ...note,
              stickyNotes: currentStickies.map((s) => (s.id === id ? { ...s, text } : s)),
              updatedAt: new Date().toISOString(),
            };
            return updatedNote;
          });

          if (updatedNote) {
            triggerDebouncedSave(updatedNote);
          }
          return { notes: updatedNotes, saveStatus: 'saving' };
        });
      },

      updateStickyNoteColor: (noteId: string, id: string, color: string) => {
        set((state) => {
          let updatedNote: Note | null = null;
          const updatedNotes = state.notes.map((note) => {
            if (note.id !== noteId) return note;
            const currentStickies = note.stickyNotes || note.content?.stickyNotes || [];
            updatedNote = {
              ...note,
              stickyNotes: currentStickies.map((s) => (s.id === id ? { ...s, color } : s)),
              updatedAt: new Date().toISOString(),
            };
            return updatedNote;
          });

          if (updatedNote) {
            triggerDebouncedSave(updatedNote);
          }
          return { notes: updatedNotes, saveStatus: 'saving' };
        });
      },

      toggleStickyNoteMinimized: (noteId: string, id: string) => {
        set((state) => {
          let updatedNote: Note | null = null;
          const updatedNotes = state.notes.map((note) => {
            if (note.id !== noteId) return note;
            const currentStickies = note.stickyNotes || note.content?.stickyNotes || [];
            updatedNote = {
              ...note,
              stickyNotes: currentStickies.map((s) =>
                s.id === id ? { ...s, isMinimized: !s.isMinimized } : s
              ),
              updatedAt: new Date().toISOString(),
            };
            return updatedNote;
          });

          if (updatedNote) {
            triggerDebouncedSave(updatedNote);
          }
          return { notes: updatedNotes, saveStatus: 'saving' };
        });
      },

      deleteStickyNote: (noteId: string, id: string) => {
        set((state) => {
          let updatedNote: Note | null = null;
          const updatedNotes = state.notes.map((note) => {
            if (note.id !== noteId) return note;
            const currentStickies = note.stickyNotes || note.content?.stickyNotes || [];
            updatedNote = {
              ...note,
              stickyNotes: currentStickies.filter((s) => s.id !== id),
              updatedAt: new Date().toISOString(),
            };
            return updatedNote;
          });

          if (updatedNote) {
            triggerDebouncedSave(updatedNote);
          }
          return { notes: updatedNotes, saveStatus: 'saving' };
        });
      },

      // Mascot Stickers Actions
      addMascotSticker: (
        noteId: string,
        stickerType: string,
        x = 420,
        y = 200,
        scale = 1.0,
        rotation = Math.floor(Math.random() * 12) - 6
      ) => {
        const newStickerId = `stk_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const newSticker: MascotStickerItem = {
          id: newStickerId,
          type: stickerType,
          x,
          y,
          scale,
          rotation,
        };

        set((state) => {
          let updatedNote: Note | null = null;
          const updatedNotes = state.notes.map((note) => {
            if (note.id !== noteId) return note;
            const currentStickers = note.mascotStickers || note.content?.stickers || [];
            updatedNote = {
              ...note,
              mascotStickers: [...currentStickers, newSticker],
              updatedAt: new Date().toISOString(),
            };
            return updatedNote;
          });

          if (updatedNote) {
            triggerDebouncedSave(updatedNote);
          }
          return { notes: updatedNotes, saveStatus: 'saving' };
        });

        return newStickerId;
      },

      updateMascotStickerPosition: (noteId: string, id: string, x: number, y: number) => {
        set((state) => {
          let updatedNote: Note | null = null;
          const updatedNotes = state.notes.map((note) => {
            if (note.id !== noteId) return note;
            const currentStickers = note.mascotStickers || note.content?.stickers || [];
            updatedNote = {
              ...note,
              mascotStickers: currentStickers.map((stk) => (stk.id === id ? { ...stk, x, y } : stk)),
              updatedAt: new Date().toISOString(),
            };
            return updatedNote;
          });

          if (updatedNote) {
            triggerDebouncedSave(updatedNote);
          }
          return { notes: updatedNotes, saveStatus: 'saving' };
        });
      },

      updateMascotStickerScale: (noteId: string, id: string, scale: number) => {
        set((state) => {
          let updatedNote: Note | null = null;
          const updatedNotes = state.notes.map((note) => {
            if (note.id !== noteId) return note;
            const currentStickers = note.mascotStickers || note.content?.stickers || [];
            updatedNote = {
              ...note,
              mascotStickers: currentStickers.map((stk) =>
                stk.id === id ? { ...stk, scale: Math.max(0.6, Math.min(2.0, scale)) } : stk
              ),
              updatedAt: new Date().toISOString(),
            };
            return updatedNote;
          });

          if (updatedNote) {
            triggerDebouncedSave(updatedNote);
          }
          return { notes: updatedNotes, saveStatus: 'saving' };
        });
      },

      deleteMascotSticker: (noteId: string, id: string) => {
        set((state) => {
          let updatedNote: Note | null = null;
          const updatedNotes = state.notes.map((note) => {
            if (note.id !== noteId) return note;
            const currentStickers = note.mascotStickers || note.content?.stickers || [];
            updatedNote = {
              ...note,
              mascotStickers: currentStickers.filter((stk) => stk.id !== id),
              updatedAt: new Date().toISOString(),
            };
            return updatedNote;
          });

          if (updatedNote) {
            triggerDebouncedSave(updatedNote);
          }
          return { notes: updatedNotes, saveStatus: 'saving' };
        });
      },
    }),
    {
      name: 'cub-pad-notes-storage-v6',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        notes: state.notes,
        activeNoteId: state.activeNoteId,
        fontMode: state.fontMode,
      }),
    }
  )
);
