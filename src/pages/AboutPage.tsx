'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import ExternalLink from '@/components/links/ExternalLink';
import './AboutPage.css';

const AUTHOR_GITHUB_URL = 'https://github.com/bukt0r';
const RS_REACT_COURSE_URL = 'https://rs.school/courses/reactjs';

function AboutPage() {
  const t = useTranslations('about');

  return (
    <main className="about-page">
      <Image
        src="/images/rs-search-logo.svg"
        alt={t('logoAlt')}
        width={64}
        height={64}
        className="about-page__logo"
        priority
      />
      <h1>{t('title')}</h1>
      <p className="about-page__text">{t('text')}</p>
      <p className="about-page__author">
        {t('author')}{' '}
        <ExternalLink className="about-page__link" href={AUTHOR_GITHUB_URL}>
          vufimcev
        </ExternalLink>
      </p>
      <p>
        <ExternalLink className="about-page__link" href={RS_REACT_COURSE_URL}>
          {t('courseLink')}
        </ExternalLink>
      </p>
    </main>
  );
}

export default AboutPage;
