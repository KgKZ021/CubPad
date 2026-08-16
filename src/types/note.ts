export type PaperStyle = 'lined' | 'grid' | 'dot' | 'blank';
export type FontFamilyChoice = 'Caveat' | 'Patrick Hand' | 'Nunito' | 'Fredoka';
export type PuppyTheme = 'golden_retriever' | 'corgi' | 'shiba';

export interface StickyNote {
  id: string;
  x: number;
  y: number;
  color: string;
  text: string;
  width?: number;
  height?: number;
}

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

export interface StickerItem {
  id: string;
  type: string;
  x: number;
  y: number;
  scale: number;
}

export interface NoteContent {
  textHtml: string;
  stickyNotes?: StickyNote[];
  vectors?: VectorShape[];
  stickers?: StickerItem[];
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
  content?: NoteContent; // Rich forward-compatible container
}
