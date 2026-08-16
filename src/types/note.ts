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

export interface VectorLine {
  id: string;
  type: 'straight_line' | 'underline' | 'arrow';
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  strokeColor: string;
  strokeWidth: number;
}

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
  vectors?: VectorLine[];
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
  content?: NoteContent; // Rich forward-compatible container
}
