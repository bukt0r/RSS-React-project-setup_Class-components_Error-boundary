import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getSwapiCacheTtlSeconds } from '../config/queryConfig';
import type { SearchResultItem } from '../types/item';

const SWAPI_BASE_URL = 'https://swapi.py4e.com/api/';
const SWAPI_PAGE_SIZE = 10;

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

export interface PeoplePageResult {
  items: SearchResultItem[];
  currentPage: number;
  totalPages: number;
}

export interface PeoplePageQueryArg {
  searchFromInput: string;
  page: number;
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

export const swapiApi = createApi({
  reducerPath: 'swapiApi',
  baseQuery: fetchBaseQuery({
    baseUrl: SWAPI_BASE_URL,
  }),
  tagTypes: ['PeoplePage', 'Person'],
  keepUnusedDataFor: getSwapiCacheTtlSeconds(),
  endpoints: (builder) => ({
    getPeoplePage: builder.query<PeoplePageResult, PeoplePageQueryArg>({
      query: ({ searchFromInput, page }) => {
        const trimmed = searchFromInput.trim();
        const safePage = Math.max(1, Math.floor(page));
        const params = new URLSearchParams();

        if (trimmed.length > 0) {
          params.set('search', trimmed);
        }
        if (safePage > 1) {
          params.set('page', String(safePage));
        }

        const queryString = params.toString();
        const url = queryString ? `people/?${queryString}` : 'people/';
        return { url };
      },
      transformResponse: (
        response: SwapiPeopleListResponse,
        _meta,
        arg,
      ): PeoplePageResult => {
        const people = response.results ?? [];
        const count = response.count ?? people.length;
        const totalPages = Math.max(1, Math.ceil(count / SWAPI_PAGE_SIZE));

        return {
          items: people.map(personToItem),
          currentPage: Math.max(1, Math.floor(arg.page)),
          totalPages,
        };
      },
      providesTags: (result, _error, arg) => [
        { type: 'PeoplePage', id: `${arg.searchFromInput.trim()}::${arg.page}` },
        ...(result?.items.map((item) => ({ type: 'Person' as const, id: item.id })) ??
          []),
      ],
    }),
    getPersonById: builder.query<SearchResultItem, string>({
      query: (id) => `people/${id}/`,
      transformResponse: (response: SwapiPerson): SearchResultItem =>
        personToItem(response),
      providesTags: (_result, _error, id) => [{ type: 'Person', id }],
    }),
  }),
});

export const { useGetPeoplePageQuery, useGetPersonByIdQuery } = swapiApi;
