export function downloadCsvFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8' });
  const objectUrl = URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');

  downloadLink.href = objectUrl;
  downloadLink.download = filename;
  downloadLink.click();
  URL.revokeObjectURL(objectUrl);
}
