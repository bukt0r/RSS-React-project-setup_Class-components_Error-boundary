import type { SearchResultItem } from '../types/item';

const SWAPI_PEOPLE_URL = 'https://swapi.py4e.com/api/people/';
const SWAPI_PAGE_SIZE = 10;

export class SwapiHttpError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'SwapiHttpError';
    this.status = status;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export interface PeoplePageResult {
  items: SearchResultItem[];
  currentPage: number;
  totalPages: number;
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
  url: string;
  name: string;
  height: string;
  mass: string;
  hair_color: string;
  gender: string;
  birth_year: string;
}

interface SwapiPeopleListResponse {
  count?: number;
  results?: SwapiPerson[];
}

function extractPersonId(url: string): string {
  const segments = url.replace(/\/$/, '').split('/');
  return segments.at(-1) ?? '';
}

function personToItem(person: SwapiPerson): SearchResultItem {
  const description = [
    `Gender: ${person.gender}`,
    `Birth year: ${person.birth_year}`,
    `Height: ${person.height} cm`,
    `Mass: ${person.mass} kg`,
    `Hair: ${person.hair_color}`,
  ].join(' · ');

  return {
    id: extractPersonId(person.url),
    name: person.name,
    description,
    detailsUrl: person.url,
  };
}

function buildPeopleUrl(searchFromInput: string, page: number): string {
  const trimmed = searchFromInput.trim();
  const params = new URLSearchParams();

  if (trimmed.length > 0) {
    params.set('search', trimmed);
  }

  if (page > 1) {
    params.set('page', String(page));
  }

  const query = params.toString();
  return query.length > 0 ? `${SWAPI_PEOPLE_URL}?${query}` : SWAPI_PEOPLE_URL;
}

export async function fetchPeoplePage(
  searchFromInput: string,
  page: number,
): Promise<PeoplePageResult> {
  const safePage = Math.max(1, Math.floor(page));
  const url = buildPeopleUrl(searchFromInput, safePage);
  const response = await fetch(url);

  if (!response.ok) {
    throw new SwapiHttpError(
      response.status,
      messageForHttpStatus(response.status),
    );
  }

  const data = (await response.json()) as SwapiPeopleListResponse;
  const people = data.results ?? [];
  const count = data.count ?? people.length;
  const totalPages = Math.max(1, Math.ceil(count / SWAPI_PAGE_SIZE));

  return {
    items: people.map(personToItem),
    currentPage: safePage,
    totalPages,
  };
}

export async function fetchPersonById(id: string): Promise<SearchResultItem> {
  const response = await fetch(`${SWAPI_PEOPLE_URL}${id}/`);

  if (!response.ok) {
    throw new SwapiHttpError(
      response.status,
      messageForHttpStatus(response.status),
    );
  }

  const person = (await response.json()) as SwapiPerson;
  return personToItem(person);
}

export async function fetchFirstPagePeople(
  searchFromInput: string,
): Promise<SearchResultItem[]> {
  const page = await fetchPeoplePage(searchFromInput, 1);
  return page.items;
}
