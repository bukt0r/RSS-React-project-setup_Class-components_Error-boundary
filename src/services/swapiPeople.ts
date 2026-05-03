import type { SearchResultItem } from '../types/item';

const SWAPI_PEOPLE_URL = 'https://swapi.dev/api/people/';

interface SwapiPerson {
  name: string;
  height: string;
  mass: string;
  hair_color: string;
  gender: string;
  birth_year: string;
}

interface SwapiPeopleListResponse {
  results?: SwapiPerson[];
}

function personToItem(person: SwapiPerson): SearchResultItem {
  const description = [
    `Gender: ${person.gender}`,
    `Birth year: ${person.birth_year}`,
    `Height: ${person.height} cm`,
    `Mass: ${person.mass} kg`,
    `Hair: ${person.hair_color}`,
  ].join(' · ');

  return { name: person.name, description };
}

export async function fetchFirstPagePeople(
  searchFromInput: string,
): Promise<SearchResultItem[]> {
  const trimmed = searchFromInput.trim();
  const url =
    trimmed.length > 0
      ? `${SWAPI_PEOPLE_URL}?search=${encodeURIComponent(trimmed)}`
      : SWAPI_PEOPLE_URL;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`SWAPI responded with ${response.status}`);
  }

  const data = (await response.json()) as SwapiPeopleListResponse;
  const people = data.results ?? [];

  return people.map(personToItem);
}
