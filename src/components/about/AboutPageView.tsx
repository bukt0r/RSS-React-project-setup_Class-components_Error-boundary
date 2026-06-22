import Image from 'next/image';
import ExternalLink from '@/components/links/ExternalLink';
import './AboutPage.css';

const AUTHOR_GITHUB_URL = 'https://github.com/bukt0r';
const RS_REACT_COURSE_URL = 'https://rs.school/courses/reactjs';

export interface AboutPageContent {
  title: string;
  logoAlt: string;
  text: string;
  author: string;
  courseLink: string;
}

function AboutPageView({
  title,
  logoAlt,
  text,
  author,
  courseLink,
}: AboutPageContent) {
  return (
    <main className="about-page">
      <Image
        src="/images/rs-search-logo.svg"
        alt={logoAlt}
        width={64}
        height={64}
        className="about-page__logo"
        priority
      />
      <h1>{title}</h1>
      <p className="about-page__text">{text}</p>
      <p className="about-page__author">
        {author}{' '}
        <ExternalLink className="about-page__link" href={AUTHOR_GITHUB_URL}>
          vufimcev
        </ExternalLink>
      </p>
      <p>
        <ExternalLink className="about-page__link" href={RS_REACT_COURSE_URL}>
          {courseLink}
        </ExternalLink>
      </p>
    </main>
  );
}

export default AboutPageView;
