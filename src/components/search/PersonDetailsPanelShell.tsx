import { getTranslations } from 'next-intl/server';
import type { ReactNode } from 'react';

interface PersonDetailsPanelShellProps {
  children: ReactNode;
}

async function PersonDetailsPanelShell({ children }: PersonDetailsPanelShellProps) {
  const t = await getTranslations('details');

  return (
    <aside className="home-split__details" aria-label={t('itemDetails')}>
      {children}
    </aside>
  );
}

export default PersonDetailsPanelShell;
