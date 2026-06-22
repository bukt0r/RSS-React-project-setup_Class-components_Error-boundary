import type { SearchResultItem } from '../types/item';
import { getPersonImageUrl } from './personImageUrl';

const DEFAULT_SWAPI_BASE_URL = 'https://swapi.py4e.com/api';
const VERCEL_SWAPI_BASE_URL = 'https://swapi.dev/api';
const SWAPI_PAGE_SIZE = 10;

const SWAPI_FETCH_OPTIONS: RequestInit = {
  headers: {
    Accept: 'application/json',
    'User-Agent': 'rs-react-app/1.0',
  },
  cache: 'no-store',
};

function getSwapiBaseUrl(): string {
  const configured = process.env.SWAPI_BASE_URL?.trim();

  if (configured) {
    return configured.replace(/\/$/, '');
  }

  if (process.env.VERCEL) {
    return VERCEL_SWAPI_BASE_URL;
  }

  return DEFAULT_SWAPI_BASE_URL;
}

function getSwapiPeopleUrl(): string {
  return `${getSwapiBaseUrl()}/people/`;
}

async function fetchSwapi(url: string): Promise<Response> {
  return fetch(url, SWAPI_FETCH_OPTIONS);
}

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
    imageUrl: getPersonImageUrl(extractPersonId(person.url)),
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
  const peopleUrl = getSwapiPeopleUrl();
  return query.length > 0 ? `${peopleUrl}?${query}` : peopleUrl;
}

export async function fetchPeoplePage(
  searchFromInput: string,
  page: number,
): Promise<PeoplePageResult> {
  const safePage = Math.max(1, Math.floor(page));
  const url = buildPeopleUrl(searchFromInput, safePage);
  const response = await fetchSwapi(url);

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
  const response = await fetchSwapi(`${getSwapiPeopleUrl()}${id}/`);

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
