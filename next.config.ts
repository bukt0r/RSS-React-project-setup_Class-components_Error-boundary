import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'starwars-visualguide.com',
        pathname: '/assets/img/character/**',
      },
    ],
  },
};

export default withNextIntl(nextConfig);
