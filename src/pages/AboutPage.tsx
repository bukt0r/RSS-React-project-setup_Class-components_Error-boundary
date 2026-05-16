import './AboutPage.css';

const RS_REACT_COURSE_URL = 'https://rs.school/courses/react/en';

function AboutPage() {
  return (
    <main className="about-page">
      <h1>About</h1>
      <p className="about-page__text">
        Item Search is a training project for the Rolling Scopes School React
        course.
      </p>
      <p className="about-page__author">
        Author: <span className="about-page__author-name">vufimcev</span>
      </p>
      <p>
        <a
          className="about-page__course-link"
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
