import { isValidEmail } from './emailValidation';

describe('isValidEmail', () => {
  it('accepts emails with one @, local part, and dotted domain', () => {
    expect(isValidEmail('user@example.com')).toBe(true);
    expect(isValidEmail('anna@mail.co.uk')).toBe(true);
  });

  it('rejects invalid email structure without regex', () => {
    expect(isValidEmail('')).toBe(false);
    expect(isValidEmail('invalid')).toBe(false);
    expect(isValidEmail('@example.com')).toBe(false);
    expect(isValidEmail('user@')).toBe(false);
    expect(isValidEmail('user@@example.com')).toBe(false);
    expect(isValidEmail('user@domain')).toBe(false);
  });
});
