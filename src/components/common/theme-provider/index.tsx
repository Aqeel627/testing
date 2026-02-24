'use client';

import ColorThemeProvider from '@/components/pages/color-theme-provider';
import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';

export function AuExchThemeProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <ColorThemeProvider>
        {children}
      </ColorThemeProvider>
    </ThemeProvider>
  );
}