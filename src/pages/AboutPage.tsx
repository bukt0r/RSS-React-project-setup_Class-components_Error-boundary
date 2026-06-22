'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import './AboutPage.css';

const AUTHOR_GITHUB_URL = 'https://github.com/bukt0r';
const RS_REACT_COURSE_URL = 'https://rs.school/courses/reactjs';

function AboutPage() {
  const t = useTranslations('about');

  return (
    <main className="about-page">
      <h1>{t('title')}</h1>
      <p className="about-page__text">{t('text')}</p>
      <p className="about-page__author">
        {t('author')}{' '}
        <a
          className="about-page__link"
          href={AUTHOR_GITHUB_URL}
          target="_blank"
          rel="noreferrer"
        >
          vufimcev
        </a>
      </p>
      <p>
        <a
          className="about-page__link"
          href={RS_REACT_COURSE_URL}
          target="_blank"
          rel="noreferrer"
        >
          {t('courseLink')}
        </a>
      </p>
    </main>
  );
}

export default AboutPage;
