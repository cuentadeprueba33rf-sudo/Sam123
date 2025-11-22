export type Gender = 'female' | 'male' | 'neutral';

export interface Note {
  id: string;
  content: string;
  author?: string; // Could be "Dios", "El Universo", "Tu yo del futuro"
  theme: 'hope' | 'courage' | 'love' | 'peace';
  timestamp: number;
}

export interface UserSettings {
  gender: Gender | null;
  hasOnboarded: boolean;
}