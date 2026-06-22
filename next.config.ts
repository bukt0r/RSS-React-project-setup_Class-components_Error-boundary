import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Legacy Vite pages live in src/pages during migration; only *.page.tsx files are routes.
  pageExtensions: ['page.tsx', 'page.ts', 'page.jsx', 'page.js'],
};

export default nextConfig;
