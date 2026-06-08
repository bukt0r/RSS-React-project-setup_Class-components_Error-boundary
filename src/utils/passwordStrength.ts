export type PasswordStrength = 'Weak' | 'Medium' | 'Strong';

export interface PasswordCriterion {
  label: string;
  met: boolean;
}

const hasNumber = (password: string): boolean => {
  for (const char of password) {
    if (char >= '0' && char <= '9') {
      return true;
    }
  }

  return false;
};

const hasUppercase = (password: string): boolean => {
  for (const char of password) {
    if (char >= 'A' && char <= 'Z') {
      return true;
    }
  }

  return false;
};

const hasLowercase = (password: string): boolean => {
  for (const char of password) {
    if (char >= 'a' && char <= 'z') {
      return true;
    }
  }

  return false;
};

const hasSpecialCharacter = (password: string): boolean => {
  for (const char of password) {
    const isDigit = char >= '0' && char <= '9';
    const isUppercase = char >= 'A' && char <= 'Z';
    const isLowercase = char >= 'a' && char <= 'z';

    if (!isDigit && !isUppercase && !isLowercase) {
      return true;
    }
  }

  return false;
};

export const getPasswordCriteria = (password: string): PasswordCriterion[] => [
  { label: '1 number', met: hasNumber(password) },
  { label: '1 uppercase letter', met: hasUppercase(password) },
  { label: '1 lowercase letter', met: hasLowercase(password) },
  { label: '1 special character', met: hasSpecialCharacter(password) },
];

export const getPasswordStrength = (password: string): PasswordStrength => {
  const metCount = getPasswordCriteria(password).filter((criterion) => criterion.met).length;

  if (metCount <= 1) {
    return 'Weak';
  }

  if (metCount <= 3) {
    return 'Medium';
  }

  return 'Strong';
};
