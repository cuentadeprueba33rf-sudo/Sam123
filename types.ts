
export type Gender = 'female' | 'male' | 'neutral';

export type NoteStyle = 'classic' | 'midnight' | 'aura' | 'minimal' | 'botanical' | 'cinema' | 'vintage' | 'rose';

export type Mood = 'anxious' | 'sad' | 'grateful' | 'tired' | 'confused' | 'neutral';

export type AppBackground = 'auto' | 'light' | 'dark' | 'aura';

export interface Note {
  id: string;
  content: string;
  author?: string; // Could be "Dios", "El Universo", "Tu yo del futuro"
  theme: 'hope' | 'courage' | 'love' | 'peace';
  style: NoteStyle;
  timestamp: number;
}

export interface UserSettings {
  gender: Gender | null;
  hasOnboarded: boolean;
  appBackground: AppBackground;
}

export interface ExtractionResult {
  isValid: boolean;
  errorReason?: string;
  note?: {
    content: string;
    author: string;
    theme: 'hope' | 'courage' | 'love' | 'peace';
    style: NoteStyle;
  }
}