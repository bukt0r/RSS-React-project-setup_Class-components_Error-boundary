import { downloadCsvFile } from './downloadCsvFile';

describe('downloadCsvFile', () => {
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

    downloadCsvFile('id,name\n1,Test', '1_items.csv');

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
