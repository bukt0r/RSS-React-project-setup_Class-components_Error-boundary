import type { SearchResultItem } from '../types/item';

const SWAPI_PEOPLE_URL = 'https://swapi.py4e.com/api/people/';

export class SwapiHttpError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'SwapiHttpError';
    this.status = status;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

function messageForHttpStatus(status: number): string {
  if (status >= 500) {
    return `The server returned an error (${status}). Please try again later.`;
  }

  if (status === 404) {
    return `No data was found for this request (${status}).`;
  }

  if (status >= 400) {
    return `The request could not be completed (${status}). Try again or adjust your search.`;
  }

  return `Unexpected response from the service (${status}).`;
}

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
    throw new SwapiHttpError(
      response.status,
      messageForHttpStatus(response.status),
    );
  }

  const data = (await response.json()) as SwapiPeopleListResponse;
  const people = data.results ?? [];

  return people.map(personToItem);
}
