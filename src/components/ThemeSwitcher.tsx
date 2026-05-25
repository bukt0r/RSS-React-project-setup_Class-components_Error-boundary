import type { ChangeEvent } from 'react';
import { useTheme } from '../context/useTheme';
import type { Theme } from '../context/themeContext';
import './ThemeSwitcher.css';

function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setTheme(event.target.value as Theme);
  };

  return (
    <fieldset className="theme-switcher">
      <legend className="theme-switcher__legend">Theme</legend>
      <div className="theme-switcher__options">
        <label className="theme-switcher__option">
          <input
            type="radio"
            name="app-theme"
            value="light"
            checked={theme === 'light'}
            onChange={handleChange}
          />
          Light
        </label>
        <label className="theme-switcher__option">
          <input
            type="radio"
            name="app-theme"
            value="dark"
            checked={theme === 'dark'}
            onChange={handleChange}
          />
          Dark
        </label>
      </div>
    </fieldset>
  );
}

export default ThemeSwitcher;
