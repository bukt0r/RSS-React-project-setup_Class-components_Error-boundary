'use client';

import { useAppSearchParams } from '@/hooks/useAppSearchParams';
import PersonDetailsInteractive from '@/components/details/PersonDetailsInteractive';

function PersonDetailsPanel() {
  const { searchParams } = useAppSearchParams();
  const detailsId = searchParams.get('details');

  if (!detailsId) {
    return null;
  }

  return (
    <PersonDetailsInteractive
      detailsId={detailsId}
      initialPerson={null}
      initialFetchError={null}
    />
  );
}

export default PersonDetailsPanel;
