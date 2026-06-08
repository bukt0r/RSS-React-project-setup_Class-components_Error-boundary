export type PasswordStrength = 'Weak' | 'Medium' | 'Strong';

export const getPasswordStrength = (password: string): PasswordStrength => {
  let score = 0;

  if (password.length >= 8) {
    score += 1;
  }

  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
    score += 1;
  }

  if (/\d/.test(password)) {
    score += 1;
  }

  if (/[^A-Za-z0-9]/.test(password)) {
    score += 1;
  }

  if (score <= 1) {
    return 'Weak';
  }

  if (score <= 3) {
    return 'Medium';
  }

  return 'Strong';
};
