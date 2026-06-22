import PersonImage from '@/components/PersonImage';
import type { SearchResultItem } from '@/types/item';

interface PersonDetailsViewProps {
  person: SearchResultItem;
}

function PersonDetailsView({ person }: PersonDetailsViewProps) {
  return (
    <article className="person-details__content">
      <PersonImage
        src={person.imageUrl}
        alt={person.name}
        size={96}
        className="person-details__image"
        priority
      />
      <h3 className="person-details__name">{person.name}</h3>
      <p className="person-details__description">{person.description}</p>
    </article>
  );
}

export default PersonDetailsView;
