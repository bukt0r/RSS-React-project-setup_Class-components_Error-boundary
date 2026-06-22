'use client';

import type { ChangeEvent } from 'react';
import { useTranslations } from 'next-intl';
import { useTheme } from '../context/useTheme';
import type { Theme } from '../context/themeContext';
import './ThemeSwitcher.css';

function ThemeSwitcher() {
  const t = useTranslations('theme');
  const { theme, setTheme } = useTheme();

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setTheme(event.target.value as Theme);
  };

  return (
    <fieldset className="theme-switcher">
      <legend className="theme-switcher__legend">{t('legend')}</legend>
      <div className="theme-switcher__options">
        <label className="theme-switcher__option">
          <input
            type="radio"
            name="app-theme"
            value="light"
            checked={theme === 'light'}
            onChange={handleChange}
          />
          {t('light')}
        </label>
        <label className="theme-switcher__option">
          <input
            type="radio"
            name="app-theme"
            value="dark"
            checked={theme === 'dark'}
            onChange={handleChange}
          />
          {t('dark')}
        </label>
      </div>
    </fieldset>
  );
}

export default ThemeSwitcher;
