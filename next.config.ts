import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  // Legacy Vite pages live in src/pages during migration; only *.page.tsx files are routes.
  pageExtensions: ['page.tsx', 'page.ts', 'page.jsx', 'page.js'],
};

export default withNextIntl(nextConfig);
