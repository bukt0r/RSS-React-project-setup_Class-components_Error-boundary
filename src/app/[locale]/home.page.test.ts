import HomeRoute from '@/app/[locale]/page';

describe('Home route SSR config', () => {
  it('exports an async server route component', () => {
    expect(HomeRoute.name).toBe('HomeRoute');
    expect(HomeRoute.constructor.name).toBe('AsyncFunction');
  });
});
