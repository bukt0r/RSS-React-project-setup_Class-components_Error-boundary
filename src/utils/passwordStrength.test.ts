import { getPasswordCriteria, getPasswordStrength } from './passwordStrength';

describe('getPasswordCriteria', () => {
  it('tracks each password requirement separately', () => {
    const criteria = getPasswordCriteria('Strong123!');

    expect(criteria).toEqual([
      { label: '1 number', met: true },
      { label: '1 uppercase letter', met: true },
      { label: '1 lowercase letter', met: true },
      { label: '1 special character', met: true },
    ]);
  });

  it('marks missing requirements as not met', () => {
    const criteria = getPasswordCriteria('abcdefgh');

    expect(criteria.find((item) => item.label === '1 number')?.met).toBe(false);
    expect(criteria.find((item) => item.label === '1 uppercase letter')?.met).toBe(false);
  });
});

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
