import { readStoredSearchRaw, writeStoredSearchTrimmed } from './searchStorage';

describe('searchStorage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('returns null when localStorage has no saved query', () => {
    expect(readStoredSearchRaw()).toBeNull();
  });

  it('returns stored query when localStorage contains value', () => {
    localStorage.setItem('searchQuery', 'Luke');

    expect(readStoredSearchRaw()).toBe('Luke');
  });

  it('writes new trimmed query to localStorage', () => {
    writeStoredSearchTrimmed('Leia');

    expect(localStorage.getItem('searchQuery')).toBe('Leia');
  });

  it('does not rewrite localStorage when value is unchanged', () => {
    localStorage.setItem('searchQuery', 'Han');
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');

    writeStoredSearchTrimmed('Han');

    expect(setItemSpy).not.toHaveBeenCalled();
    expect(localStorage.getItem('searchQuery')).toBe('Han');
  });
});
