import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import AppShell from '@/components/AppShell';
import AppProviders from '@/components/providers/AppProviders';
import '@/App.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'RS React App',
  description: 'RSS React Course — Next.js SSR migration',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppProviders>
          <AppShell>{children}</AppShell>
        </AppProviders>
      </body>
    </html>
  );
}
