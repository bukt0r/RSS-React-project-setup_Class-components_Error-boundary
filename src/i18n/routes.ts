export const appRoutes = {
  home: '/',
  about: '/about',
} as const;

export type AppRoute = (typeof appRoutes)[keyof typeof appRoutes];
