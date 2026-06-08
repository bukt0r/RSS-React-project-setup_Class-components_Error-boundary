import { fileToBase64 } from './fileToBase64';

describe('fileToBase64', () => {
  it('converts a file to a base64 data url', async () => {
    const file = new File(['hello'], 'avatar.png', { type: 'image/png' });

    const result = await fileToBase64(file);

    expect(result).toMatch(/^data:image\/png;base64,/);
  });

  it('rejects when FileReader returns a non-string result', async () => {
    const file = new File(['hello'], 'avatar.png', { type: 'image/png' });
    const readAsDataURL = vi
      .spyOn(FileReader.prototype, 'readAsDataURL')
      .mockImplementation(function readAsDataURLMock(this: FileReader) {
        Object.defineProperty(this, 'result', {
          value: new ArrayBuffer(8),
          configurable: true,
        });
        this.onload?.(new ProgressEvent('load'));
      });

    await expect(fileToBase64(file)).rejects.toThrow('Failed to convert file to base64');

    readAsDataURL.mockRestore();
  });

  it('rejects when FileReader fails', async () => {
    const file = new File(['hello'], 'avatar.png', { type: 'image/png' });
    const readAsDataURL = vi
      .spyOn(FileReader.prototype, 'readAsDataURL')
      .mockImplementation(function readAsDataURLMock(this: FileReader) {
        this.onerror?.(new ProgressEvent('error'));
      });

    await expect(fileToBase64(file)).rejects.toThrow('Failed to read file');

    readAsDataURL.mockRestore();
  });
});
