export const isValidEmail = (value: string): boolean => {
  const parts = value.split('@');

  if (parts.length !== 2) {
    return false;
  }

  const [localPart, domain] = parts;

  if (localPart.length === 0) {
    return false;
  }

  if (domain.length === 0) {
    return false;
  }

  return domain.includes('.');
};
