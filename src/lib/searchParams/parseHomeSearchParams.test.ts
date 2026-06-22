import {
  parseDetailsParam,
  parseHomeSearchParams,
  parsePageParam,
} from './parseHomeSearchParams';

describe('parseHomeSearchParams', () => {
  it('parses page and details from query params', () => {
    expect(
      parseHomeSearchParams({
        page: '3',
        details: '10',
      }),
    ).toEqual({
      currentPage: 3,
      detailsId: '10',
      isDetailsOpen: true,
    });
  });

  it('falls back to page 1 when page param is missing or invalid', () => {
    expect(parsePageParam(null)).toBe(1);
    expect(parsePageParam('0')).toBe(1);
    expect(parsePageParam('abc')).toBe(1);
    expect(parsePageParam(['2'])).toBe(2);
  });

  it('returns null details id when details param is absent', () => {
    expect(parseDetailsParam(undefined)).toBeNull();
    expect(
      parseHomeSearchParams({
        page: '1',
      }).isDetailsOpen,
    ).toBe(false);
  });
});
