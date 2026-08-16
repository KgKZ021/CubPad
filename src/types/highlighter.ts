export interface StudyHighlightColor {
  id: string;
  name: string;
  category: string;
  color: string;
  borderColor: string;
  textColor: string;
}

export const STUDY_HIGHLIGHT_COLORS: StudyHighlightColor[] = [
  {
    id: 'yellow',
    name: 'Key Concepts',
    category: 'Yellow',
    color: '#FFF3B0',
    borderColor: '#E8DC88',
    textColor: '#5B4E0A',
  },
  {
    id: 'blue',
    name: 'Pastel Blue',
    category: 'Blue',
    color: '#D0E8FF',
    borderColor: '#B0D4FF',
    textColor: '#1E40AF',
  },
  {
    id: 'coral',
    name: 'Pastel Coral',
    category: 'Coral/Red',
    color: '#FFD6D6',
    borderColor: '#FFB8B8',
    textColor: '#991B1B',
  },
  {
    id: 'mint',
    name: 'Pastel Mint',
    category: 'Mint/Green',
    color: '#D4EDDA',
    borderColor: '#B2DFDB',
    textColor: '#166534',
  },
  {
    id: 'purple',
    name: 'Pastel Purple',
    category: 'Purple',
    color: '#E8D7FF',
    borderColor: '#D4B8FF',
    textColor: '#6B21A8',
  },
];
