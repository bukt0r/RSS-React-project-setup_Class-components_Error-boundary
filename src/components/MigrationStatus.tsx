'use client';

import ThemeSwitcher from '@/components/ThemeSwitcher';

function MigrationStatus() {
  return (
    <section className="migration-placeholder">
      <h1>Next.js App Router</h1>
      <p>
        Client providers are connected: Redux store, theme context, and error
        boundary wrap every page through the root layout.
      </p>
      <p>App shell and file-based routes will be added in the next commit.</p>
      <div className="migration-placeholder__theme">
        <ThemeSwitcher />
      </div>
    </section>
  );
}

export default MigrationStatus;
