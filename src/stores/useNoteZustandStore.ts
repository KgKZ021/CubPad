import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Note, PaperStyle, FontFamilyChoice, VectorShape, DrawingTool } from '../types/note';

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
      stickyNotes: [
        {
          id: 'sticky_demo_1',
          x: 480,
          y: 80,
          color: '#FFF3B0',
          text: '💡 Pro Tip:\nClick on the title in the header above to rename your note anytime!',
        },
      ],
      vectors: [],
      stickers: [
        {
          id: 'stk_demo_1',
          type: 'puppy_happy',
          x: 420,
          y: 20,
          scale: 1.0,
        },
      ],
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
  <li>[ ] Add custom sticker drawer (planned)</li>
</ul>

<p><em>"Creativity is intelligence having fun." — Albert Einstein</em></p>`,
    content: {
      textHtml: '',
      stickyNotes: [
        {
          id: 'sticky_demo_2',
          x: 460,
          y: 110,
          color: '#FFF3B0',
          text: '✨ Reminder:\nSmall daily progress leads to huge long-term results. Keep going!',
        },
      ],
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

  // Drawing Tools Session State
  activeDrawingTool: DrawingTool;
  drawingColor: string;
  drawingStrokeWidth: number;
  drawingIsDashed: boolean;

  // Actions
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
}

export const useNoteZustandStore = create<NoteState>()(
  persist(
    (set, get) => ({
      notes: INITIAL_DEMO_NOTES,
      activeNoteId: 'note_quickstart_01',
      fontMode: 'handwriting',
      isSidebarOpen: false,

      // Default drawing tool configuration
      activeDrawingTool: 'none',
      drawingColor: '#4A3B32', // Warm Brown
      drawingStrokeWidth: 2,
      drawingIsDashed: false,

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
          isSidebarOpen: false, // Auto-close drawer on mobile when creating
        }));

        return newId;
      },

      selectNote: (id: string) => {
        set({ activeNoteId: id, isSidebarOpen: false });
      },

      updateNoteContent: (id: string, contentHtml: string) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id
              ? {
                  ...note,
                  contentHtml,
                  updatedAt: new Date().toISOString(),
                }
              : note
          ),
        }));
      },

      updateNoteTitle: (id: string, title: string) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id
              ? {
                  ...note,
                  title,
                  updatedAt: new Date().toISOString(),
                }
              : note
          ),
        }));
      },

      updateNoteCategory: (id: string, category: string) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id
              ? {
                  ...note,
                  category,
                  updatedAt: new Date().toISOString(),
                }
              : note
          ),
        }));
      },

      updateNoteBackgroundStyle: (id: string, backgroundStyle: PaperStyle) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id
              ? {
                  ...note,
                  backgroundStyle,
                  updatedAt: new Date().toISOString(),
                }
              : note
          ),
        }));
      },

      updateNoteFontFamily: (id: string, fontFamily: FontFamilyChoice) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id
              ? {
                  ...note,
                  fontFamily,
                  updatedAt: new Date().toISOString(),
                }
              : note
          ),
        }));
      },

      deleteNote: (id: string) => {
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
        set((state) => ({
          notes: state.notes.map((note) => {
            if (note.id !== noteId) return note;
            const currentShapes = note.vectorShapes || note.content?.vectors || [];
            return {
              ...note,
              vectorShapes: [...currentShapes, shape],
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },

      undoLastVectorShape: (noteId: string) => {
        set((state) => ({
          notes: state.notes.map((note) => {
            if (note.id !== noteId) return note;
            const currentShapes = note.vectorShapes || note.content?.vectors || [];
            if (currentShapes.length === 0) return note;
            return {
              ...note,
              vectorShapes: currentShapes.slice(0, -1),
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },

      deleteVectorShape: (noteId: string, shapeId: string) => {
        set((state) => ({
          notes: state.notes.map((note) => {
            if (note.id !== noteId) return note;
            const currentShapes = note.vectorShapes || note.content?.vectors || [];
            return {
              ...note,
              vectorShapes: currentShapes.filter((s) => s.id !== shapeId),
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },

      clearAllVectorShapes: (noteId: string) => {
        set((state) => ({
          notes: state.notes.map((note) => {
            if (note.id !== noteId) return note;
            return {
              ...note,
              vectorShapes: [],
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },
    }),
    {
      name: 'cub-pad-notes-storage-v4',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
