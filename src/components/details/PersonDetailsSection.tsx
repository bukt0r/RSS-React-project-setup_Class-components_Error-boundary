import { getTranslations } from 'next-intl/server';
import PersonDetailsInteractive from '@/components/details/PersonDetailsInteractive';
import { loadPersonById } from '@/server/loadPersonById';

interface PersonDetailsSectionProps {
  detailsId: string | null;
}

async function PersonDetailsSection({ detailsId }: PersonDetailsSectionProps) {
  if (!detailsId) {
    return null;
  }

  await getTranslations('details');
  const { data, error } = await loadPersonById(detailsId);

  return (
    <PersonDetailsInteractive
      detailsId={detailsId}
      initialPerson={data}
      initialFetchError={error}
    />
  );
}

export default PersonDetailsSection;
