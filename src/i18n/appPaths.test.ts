import { buildLocalizedAppDetailsUrl, buildLocalizedDetailsHref } from './appPaths';

describe('appPaths', () => {
  it('builds locale-prefixed details hrefs', () => {
    expect(buildLocalizedDetailsHref('en', '10')).toBe('/en?page=1&details=10');
    expect(buildLocalizedDetailsHref('ru', '10')).toBe('/ru?page=1&details=10');
  });

  it('builds absolute app details urls with locale prefix', () => {
    expect(
      buildLocalizedAppDetailsUrl('https://example.com', '10', 'en'),
    ).toBe('https://example.com/en?page=1&details=10');
  });
});
