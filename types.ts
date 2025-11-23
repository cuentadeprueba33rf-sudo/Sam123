export type Gender = 'female' | 'male' | 'neutral';

export type NoteStyle = 'classic' | 'midnight' | 'aura' | 'minimal';

export type Mood = 'anxious' | 'sad' | 'grateful' | 'tired' | 'confused' | 'neutral';

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
}