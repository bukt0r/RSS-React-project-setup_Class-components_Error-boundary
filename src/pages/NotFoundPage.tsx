'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { appRoutes } from '@/i18n/routes';
import './NotFoundPage.css';

function NotFoundPage() {
  const t = useTranslations('notFound');

  return (
    <main className="not-found-page">
      <h1>{t('title')}</h1>
      <p className="not-found-page__message">{t('message')}</p>
      <Link className="not-found-page__link" href={appRoutes.home}>
        {t('backToSearch')}
      </Link>
    </main>
  );
}

export default NotFoundPage;
