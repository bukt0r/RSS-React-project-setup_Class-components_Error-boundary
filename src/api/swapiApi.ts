import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { getSwapiCacheTtlSeconds } from '../config/queryConfig';
import { fetchPeoplePage, fetchPersonById } from '../services/swapiPeople';
import type { SearchResultItem } from '../types/item';

export interface PeoplePageResult {
  items: SearchResultItem[];
  currentPage: number;
  totalPages: number;
}

export interface PeoplePageQueryArg {
  searchFromInput: string;
  page: number;
}

export const swapiApi = createApi({
  reducerPath: 'swapiApi',
  baseQuery: fakeBaseQuery<Error>(),
  tagTypes: ['PeoplePage', 'Person'],
  keepUnusedDataFor: getSwapiCacheTtlSeconds(),
  endpoints: (builder) => ({
    getPeoplePage: builder.query<PeoplePageResult, PeoplePageQueryArg>({
      async queryFn({ searchFromInput, page }) {
        try {
          const data = await fetchPeoplePage(searchFromInput, page);
          return { data };
        } catch (error: unknown) {
          return { error: error as Error };
        }
      },
      providesTags: (result, _error, arg) => [
        { type: 'PeoplePage', id: `${arg.searchFromInput.trim()}::${arg.page}` },
        ...(result?.items.map((item) => ({ type: 'Person' as const, id: item.id })) ??
          []),
      ],
    }),
    getPersonById: builder.query<SearchResultItem, string>({
      async queryFn(id) {
        try {
          const data = await fetchPersonById(id);
          return { data };
        } catch (error: unknown) {
          return { error: error as Error };
        }
      },
      providesTags: (_result, _error, id) => [{ type: 'Person', id }],
    }),
  }),
});

export const { useGetPeoplePageQuery, useGetPersonByIdQuery } = swapiApi;
