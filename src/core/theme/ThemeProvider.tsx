import { createContext, useContext, type ReactNode } from 'react';
import { darkColors, type ColorTokens } from './colors';

const ColorContext = createContext<ColorTokens>(darkColors);

export function ThemeProvider({ children }: { children: ReactNode }) {
  return <ColorContext.Provider value={darkColors}>{children}</ColorContext.Provider>;
}

export function useColors(): ColorTokens {
  return useContext(ColorContext);
}
