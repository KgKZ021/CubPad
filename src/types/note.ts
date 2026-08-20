export type PaperStyle = 'lined' | 'grid' | 'dot' | 'blank';
export type FontFamilyChoice = 'KG Miss Steward' | 'Caveat' | 'Patrick Hand' | 'Nunito' | 'Fredoka';
export type PuppyTheme = 'golden_retriever' | 'corgi' | 'shiba';

export interface StickyNoteItem {
  id: string;
  title?: string;
  x: number;
  y: number;
  color: string;
  text: string;
  isMinimized?: boolean;
  width?: number;
  height?: number;
}

// Backward compatible alias
export type StickyNote = StickyNoteItem;

export interface MascotStickerItem {
  id: string;
  type: string;
  x: number;
  y: number;
  scale: number;
  rotation?: number;
}

// Backward compatible alias
export type StickerItem = MascotStickerItem;

export interface VectorShape {
  id: string;
  type: 'line' | 'arrow';
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  color: string;
  strokeWidth: number;
  isDashed?: boolean;
}

// Backward compatible alias
export type VectorLine = VectorShape;

export type DrawingTool = 'none' | 'line' | 'arrow' | 'eraser';

export interface NoteContent {
  textHtml: string;
  stickyNotes?: StickyNoteItem[];
  vectors?: VectorShape[];
  stickers?: MascotStickerItem[];
}

export interface Note {
  id: string;
  title: string;
  category: string;
  updatedAt: string;
  createdAt?: string;
  contentHtml: string; // Direct text HTML for fast binding
  theme?: PuppyTheme;
  backgroundStyle?: PaperStyle;
  fontFamily?: FontFamilyChoice;
  vectorShapes?: VectorShape[]; // Direct array of vector lines/arrows
  stickyNotes?: StickyNoteItem[]; // Direct array of floating sticky notes
  mascotStickers?: MascotStickerItem[]; // Direct array of floating mascot stickers
  content?: NoteContent; // Rich forward-compatible container
}
