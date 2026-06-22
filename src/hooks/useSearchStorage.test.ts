import { renderHook, act } from '@testing-library/react';
import { useSearchStorage } from './useSearchStorage';

describe('useSearchStorage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('reads stored search query from localStorage', () => {
    localStorage.setItem('searchQuery', 'Luke');
    const { result } = renderHook(() => useSearchStorage());

    expect(result.current.readStoredSearch()).toBe('Luke');
  });

  it('returns null when localStorage is empty', () => {
    const { result } = renderHook(() => useSearchStorage());

    expect(result.current.readStoredSearch()).toBeNull();
  });

  it('writes trimmed search query to localStorage', () => {
    const { result } = renderHook(() => useSearchStorage());

    act(() => {
      result.current.saveTrimmedSearch('Leia');
    });

    expect(localStorage.getItem('searchQuery')).toBe('Leia');
  });

  it('does not rewrite localStorage when value is unchanged', () => {
    localStorage.setItem('searchQuery', 'Han');
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
    const { result } = renderHook(() => useSearchStorage());

    act(() => {
      result.current.saveTrimmedSearch('Han');
    });

    expect(setItemSpy).not.toHaveBeenCalled();
  });
});
