
import { type ReactNode } from 'react';

export interface LanguageContextType {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: string) => string;
  // Additional functions can be added here
}

export interface LanguageProviderProps {
  children: ReactNode;
}
