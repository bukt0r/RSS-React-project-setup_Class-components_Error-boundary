import {
  buildAppDetailsUrl,
  buildSelectedItemsCsvContent,
  downloadSelectedItemsCsv,
  escapeCsvField,
  getSelectedItemsCsvFilename,
} from './selectedItemsCsv';
import type { SearchResultItem } from '../types/item';

const sampleItem: SearchResultItem = {
  id: '10',
  name: 'Han Solo',
  description: 'Smuggler',
  detailsUrl: 'https://swapi.py4e.com/api/people/10/',
};

describe('selectedItemsCsv', () => {
  it('escapes csv fields with commas and quotes', () => {
    expect(escapeCsvField('plain')).toBe('plain');
    expect(escapeCsvField('a,b')).toBe('"a,b"');
    expect(escapeCsvField('say "hi"')).toBe('"say ""hi"""');
  });

  it('builds app details url with details query param', () => {
    expect(buildAppDetailsUrl('https://example.com', '10')).toBe(
      'https://example.com/?details=10',
    );
    expect(buildAppDetailsUrl('https://example.com/', '10')).toBe(
      'https://example.com/?details=10',
    );
  });

  it('builds csv content with headers and item fields', () => {
    const csv = buildSelectedItemsCsvContent([sampleItem], 'https://example.com');

    expect(csv).toContain('id,name,description,app_details_url,api_url');
    expect(csv).toContain(
      '10,Han Solo,Smuggler,https://example.com/?details=10,https://swapi.py4e.com/api/people/10/',
    );
  });

  it('builds filename from selected count', () => {
    expect(getSelectedItemsCsvFilename(15)).toBe('15_items.csv');
    expect(getSelectedItemsCsvFilename(1)).toBe('1_items.csv');
  });

  it('does nothing when items list is empty', () => {
    const createObjectUrl = vi.fn();
    vi.stubGlobal('URL', {
      ...URL,
      createObjectURL: createObjectUrl,
      revokeObjectURL: vi.fn(),
    });

    downloadSelectedItemsCsv([], 'https://example.com');

    expect(createObjectUrl).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });

  it('downloads csv using Blob and temporary anchor link', () => {
    const click = vi.fn();
    const downloadLink = {
      href: '',
      download: '',
      click,
    } as unknown as HTMLAnchorElement;

    const createElement = vi
      .spyOn(document, 'createElement')
      .mockReturnValue(downloadLink);
    const createObjectUrl = vi.fn().mockReturnValue('blob:mock-url');
    const revokeObjectUrl = vi.fn();
    vi.stubGlobal('URL', {
      ...URL,
      createObjectURL: createObjectUrl,
      revokeObjectURL: revokeObjectUrl,
    });

    downloadSelectedItemsCsv([sampleItem], 'https://example.com');

    expect(createObjectUrl).toHaveBeenCalledTimes(1);
    const blob = createObjectUrl.mock.calls[0][0] as Blob;
    expect(blob.type).toBe('text/csv;charset=utf-8');
    expect(downloadLink.href).toBe('blob:mock-url');
    expect(downloadLink.download).toBe('1_items.csv');
    expect(click).toHaveBeenCalledTimes(1);
    expect(revokeObjectUrl).toHaveBeenCalledWith('blob:mock-url');

    createElement.mockRestore();
    vi.unstubAllGlobals();
  });
});
