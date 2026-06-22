import {
  buildAppDetailsUrl,
  buildSelectedItemsCsvContent,
  escapeCsvField,
  getSelectedItemsCsvFilename,
} from './selectedItemsCsv';
import type { SearchResultItem } from '../types/item';

const sampleItem: SearchResultItem = {
  id: '10',
  name: 'Han Solo',
  description: 'Smuggler',
  detailsUrl: 'https://swapi.py4e.com/api/people/10/',
  imageUrl: 'https://starwars-visualguide.com/assets/img/character/10.jpg',
};

describe('selectedItemsCsv', () => {
  it('escapes csv fields with commas and quotes', () => {
    expect(escapeCsvField('plain')).toBe('plain');
    expect(escapeCsvField('a,b')).toBe('"a,b"');
    expect(escapeCsvField('say "hi"')).toBe('"say ""hi"""');
  });

  it('builds app details url with locale-prefixed path and details query param', () => {
    expect(buildAppDetailsUrl('https://example.com', '10', 'en')).toBe(
      'https://example.com/en?page=1&details=10',
    );
    expect(buildAppDetailsUrl('https://example.com/', '10', 'ru')).toBe(
      'https://example.com/ru?page=1&details=10',
    );
  });

  it('builds csv content with headers and item fields', () => {
    const csv = buildSelectedItemsCsvContent(
      [sampleItem],
      'https://example.com',
      'en',
    );

    expect(csv).toContain('id,name,description,app_details_url,api_url');
    expect(csv).toContain(
      '10,Han Solo,Smuggler,https://example.com/en?page=1&details=10,https://swapi.py4e.com/api/people/10/',
    );
  });

  it('builds filename from selected count', () => {
    expect(getSelectedItemsCsvFilename(15)).toBe('15_items.csv');
    expect(getSelectedItemsCsvFilename(1)).toBe('1_items.csv');
  });
});
