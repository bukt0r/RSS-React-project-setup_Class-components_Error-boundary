import { Link } from 'react-router-dom';
import './NotFoundPage.css';

function NotFoundPage() {
  return (
    <main className="not-found-page">
      <h1>404</h1>
      <p className="not-found-page__message">Page not found.</p>
      <Link className="not-found-page__link" to="/">
        Back to search
      </Link>
    </main>
  );
}

export default NotFoundPage;
