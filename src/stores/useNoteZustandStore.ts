import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Note } from '../types/note';

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
    contentHtml: `<h2>🐾 Welcome to Your Cozy Note Desk!</h2>
<p>Cub Pad is designed for delightful, distraction-free studying, journaling, and note-taking.</p>

<table style="width: 100%; border-collapse: collapse; margin-top: 14px; margin-bottom: 14px;">
  <thead>
    <tr style="background: rgba(217, 119, 54, 0.15); text-align: left;">
      <th style="padding: 8px 12px; border-bottom: 2px solid #D8CBAF;">Feature</th>
      <th style="padding: 8px 12px; border-bottom: 2px solid #D8CBAF;">Description</th>
      <th style="padding: 8px 12px; border-bottom: 2px solid #D8CBAF;">Quick Tip</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 8px 12px; border-bottom: 1px solid #E8DFC8; font-weight: 700; color: #D97736;">✍️ Live Editing</td>
      <td style="padding: 8px 12px; border-bottom: 1px solid #E8DFC8;">Click anywhere on the paper to type freely.</td>
      <td style="padding: 8px 12px; border-bottom: 1px solid #E8DFC8;">Edits save automatically!</td>
    </tr>
    <tr>
      <td style="padding: 8px 12px; border-bottom: 1px solid #E8DFC8; font-weight: 700; color: #2563EB;">🔤 Font Toggle</td>
      <td style="padding: 8px 12px; border-bottom: 1px solid #E8DFC8;">Switch between warm handwriting & clean UI fonts.</td>
      <td style="padding: 8px 12px; border-bottom: 1px solid #E8DFC8;">Top right toolbar button</td>
    </tr>
    <tr>
      <td style="padding: 8px 12px; border-bottom: 1px solid #E8DFC8; font-weight: 700; color: #16A34A;">📱 Responsive</td>
      <td style="padding: 8px 12px; border-bottom: 1px solid #E8DFC8;">Seamless experience on mobile, tablet & desktop.</td>
      <td style="padding: 8px 12px; border-bottom: 1px solid #E8DFC8;">Tap ☰ to access your notes on mobile</td>
    </tr>
    <tr>
      <td style="padding: 8px 12px; border-bottom: 1px solid #E8DFC8; font-weight: 700; color: #9333EA;">🏷️ Categories</td>
      <td style="padding: 8px 12px; border-bottom: 1px solid #E8DFC8;">Filter and organize notes with instant tags.</td>
      <td style="padding: 8px 12px; border-bottom: 1px solid #E8DFC8;">Use the category pills in sidebar</td>
    </tr>
  </tbody>
</table>

<p><strong>Today's Focus:</strong></p>
<ul>
  <li>✅ Explore and customize your notes</li>
  <li>✅ Try switching between Handwriting and Clean UI fonts</li>
  <li>✅ Create a new category for your daily thoughts or study topics</li>
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

  // Actions
  addNote: (category?: string, title?: string) => string;
  selectNote: (id: string) => void;
  updateNoteContent: (id: string, contentHtml: string) => void;
  updateNoteTitle: (id: string, title: string) => void;
  updateNoteCategory: (id: string, category: string) => void;
  deleteNote: (id: string) => void;
  setFontMode: (mode: 'handwriting' | 'ui') => void;
  toggleFontMode: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  toggleSidebar: () => void;
  getActiveNote: () => Note | undefined;
}

export const useNoteZustandStore = create<NoteState>()(
  persist(
    (set, get) => ({
      notes: INITIAL_DEMO_NOTES,
      activeNoteId: 'note_quickstart_01',
      fontMode: 'handwriting',
      isSidebarOpen: false,

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
    }),
    {
      name: 'cub-pad-notes-storage-v2',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

