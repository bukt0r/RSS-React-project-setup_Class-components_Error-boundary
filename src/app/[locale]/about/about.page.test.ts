import AboutRoute, {
  dynamic,
  generateStaticParams,
} from '@/app/[locale]/about/page';

describe('About route SSG config', () => {
  it('forces static generation', () => {
    expect(dynamic).toBe('force-static');
  });

  it('generates static params for each locale', () => {
    expect(generateStaticParams()).toEqual([{ locale: 'en' }, { locale: 'ru' }]);
  });

  it('exports an async server route component', () => {
    expect(AboutRoute.name).toBe('AboutRoute');
    expect(AboutRoute.constructor.name).toBe('AsyncFunction');
  });
});
