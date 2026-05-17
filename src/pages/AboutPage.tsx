import './AboutPage.css';

const AUTHOR_GITHUB_URL = 'https://github.com/bukt0r';
const RS_REACT_COURSE_URL = 'https://rs.school/courses/reactjs';

function AboutPage() {
  return (
    <main className="about-page">
      <h1>About</h1>
      <p className="about-page__text">
        Item Search is a training project for the Rolling Scopes School React
        course.
      </p>
      <p className="about-page__author">
        Author:{' '}
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
          RS School React course
        </a>
      </p>
    </main>
  );
}

export default AboutPage;
