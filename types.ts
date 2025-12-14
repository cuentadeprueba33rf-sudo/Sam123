
export type Gender = 'female' | 'male' | 'neutral';

export type NoteStyle = 'classic' | 'midnight' | 'aura' | 'minimal' | 'botanical' | 'cinema' | 'vintage' | 'rose';

export type Mood = 'anxious' | 'sad' | 'grateful' | 'tired' | 'confused' | 'neutral';

export type AppBackground = 'auto' | 'light' | 'dark' | 'aura';

export type AppMode = 'neutral' | 'egocentric' | 'redflags' | 'power';

export type AppInterfaceTheme = 'essence' | 'cosmos' | 'coquette';

export type FlagType = 'none' | 'rainbow' | 'bisexual' | 'lesbian' | 'trans' | 'pan' | 'nonbinary';

export type SocialPlatform = 'instagram' | 'tiktok' | 'twitter' | 'whatsapp';

export interface SocialStrategy {
  caption: string;
  hashtags: string[];
  viralHook: string; // The "hook" text to grab attention
  strategyTip: string; // Advice on how to post (e.g., audio, timing)
}

export interface Note {
  id: string;
  content: string;
  author?: string; // Could be "Dios", "El Universo", "Tu yo del futuro"
  theme: 'hope' | 'courage' | 'love' | 'peace';
  style: NoteStyle;
  timestamp: number;
  isGeneratedByAI?: boolean;
  userFlag?: FlagType; // New: Flag to display in signature
}

export interface UserSettings {
  gender: Gender | null;
  username: string | null; // New: Username
  hasOnboarded: boolean;
  appBackground: AppBackground;
  mode: AppMode;
  interfaceTheme: AppInterfaceTheme;
  preferredFlag: FlagType; // New: Saved flag preference
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
