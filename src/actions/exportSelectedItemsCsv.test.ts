import { exportSelectedItemsCsv } from '@/actions/exportSelectedItemsCsv';
import type { SearchResultItem } from '@/types/item';

const sampleItem: SearchResultItem = {
  id: '10',
  name: 'Han Solo',
  description: 'Smuggler',
  detailsUrl: 'https://swapi.py4e.com/api/people/10/',
  imageUrl: 'https://starwars-visualguide.com/assets/img/character/10.jpg',
};

describe('exportSelectedItemsCsv', () => {
  it('returns null when no items are selected', async () => {
    await expect(
      exportSelectedItemsCsv([], 'https://example.com', 'en'),
    ).resolves.toBeNull();
  });

  it('generates csv content and filename on the server', async () => {
    const result = await exportSelectedItemsCsv(
      [sampleItem],
      'https://example.com',
      'en',
    );

    expect(result).toEqual({
      filename: '1_items.csv',
      content:
        'id,name,description,app_details_url,api_url\n10,Han Solo,Smuggler,https://example.com/en?page=1&details=10,https://swapi.py4e.com/api/people/10/',
    });
  });

  it('builds locale-aware app detail links in server csv output', async () => {
    const result = await exportSelectedItemsCsv(
      [sampleItem],
      'https://example.com',
      'ru',
    );

    expect(result?.content).toContain(
      'https://example.com/ru?page=1&details=10',
    );
  });
});
