import { getPasswordStrength } from './passwordStrength';

describe('getPasswordStrength', () => {
  it('returns Weak for short or simple passwords', () => {
    expect(getPasswordStrength('')).toBe('Weak');
    expect(getPasswordStrength('abc')).toBe('Weak');
    expect(getPasswordStrength('abcdefgh')).toBe('Weak');
  });

  it('returns Medium for passwords with some complexity', () => {
    expect(getPasswordStrength('Abcdefgh')).toBe('Medium');
    expect(getPasswordStrength('Abcdefg1')).toBe('Medium');
    expect(getPasswordStrength('abcdefg1!')).toBe('Medium');
  });

  it('returns Strong for passwords with length and mixed character types', () => {
    expect(getPasswordStrength('Strong123!')).toBe('Strong');
  });
});
