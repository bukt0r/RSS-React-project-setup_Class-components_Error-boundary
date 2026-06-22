import { routing } from '@/i18n/routing';

export default function GlobalNotFound() {
  return (
    <html lang={routing.defaultLocale}>
      <body>
        <main className="not-found-page">
          <h1>404</h1>
          <p className="not-found-page__message">Page not found.</p>
          <a className="not-found-page__link" href={`/${routing.defaultLocale}?page=1`}>
            Back to search
          </a>
        </main>
      </body>
    </html>
  );
}
