import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import AppProviders from '@/components/providers/AppProviders';
import './globals.css';

export const metadata: Metadata = {
  title: 'RS React App',
  description: 'RSS React Course — Next.js SSR migration',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
