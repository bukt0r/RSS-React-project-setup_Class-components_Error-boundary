'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { appRoutes } from '@/i18n/routes';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import ThemeSwitcher from '@/components/ThemeSwitcher';

function AppHeader() {
  const t = useTranslations('nav');
  const pathname = usePathname();

  return (
    <header className="app-header">
      <nav className="app-nav" aria-label={t('main')}>
        <Link
          href={appRoutes.home}
          className={pathname === appRoutes.home ? 'app-nav__link active' : 'app-nav__link'}
        >
          {t('search')}
        </Link>
        <Link
          href={appRoutes.about}
          className={
            pathname === appRoutes.about ? 'app-nav__link active' : 'app-nav__link'
          }
        >
          {t('about')}
        </Link>
      </nav>
      <div className="app-header__controls">
        <LanguageSwitcher />
        <ThemeSwitcher />
      </div>
    </header>
  );
}

export default AppHeader;
