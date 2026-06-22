'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing, type AppLocale } from '@/i18n/routing';
import './LanguageSwitcher.css';

function LanguageSwitcher() {
  const t = useTranslations('languageSwitcher');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (nextLocale: AppLocale): void => {
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <fieldset className="language-switcher">
      <legend className="language-switcher__legend">{t('legend')}</legend>
      <div className="language-switcher__options">
        {routing.locales.map((optionLocale) => (
          <label key={optionLocale} className="language-switcher__option">
            <input
              type="radio"
              name="app-locale"
              value={optionLocale}
              checked={locale === optionLocale}
              onChange={() => handleChange(optionLocale)}
            />
            {t(optionLocale)}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default LanguageSwitcher;
