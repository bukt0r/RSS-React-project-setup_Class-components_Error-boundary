import { getPasswordCriteria } from '../../utils/passwordStrength';
import './PasswordStrengthIndicator.css';

interface PasswordStrengthIndicatorProps {
  password: string;
}

function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const criteria = getPasswordCriteria(password);

  return (
    <ul className="password-strength" aria-label="Password strength requirements">
      {criteria.map((criterion) => (
        <li
          key={criterion.label}
          className={
            criterion.met
              ? 'password-strength__item password-strength__item--met'
              : 'password-strength__item'
          }
        >
          {criterion.met ? '✓' : '○'} {criterion.label}
        </li>
      ))}
    </ul>
  );
}

export default PasswordStrengthIndicator;
