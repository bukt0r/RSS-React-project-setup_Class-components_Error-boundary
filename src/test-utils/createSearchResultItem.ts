import type { SearchResultItem } from '../types/item';
import { getPersonImageUrl } from '../services/personImageUrl';

export function createSearchResultItem(
  id: string,
  name: string,
  description: string,
  detailsUrl = `https://swapi.py4e.com/api/people/${id}/`,
): SearchResultItem {
  return {
    id,
    name,
    description,
    detailsUrl,
    imageUrl: getPersonImageUrl(id),
  };
}
