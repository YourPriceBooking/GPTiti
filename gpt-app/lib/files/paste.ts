// Read synchronously in the paste event; browsers protect the transfer afterwards.
// null means ordinary paste: leave text insertion and the current selection to the browser.
export function pastedFiles(data: Pick<DataTransfer, 'files' | 'items' | 'types'>): File[] | null {
  const items = Array.from(data.items).filter(item => item.kind === 'file');
  if (items.some(item => item.webkitGetAsEntry?.()?.isDirectory)) {
    throw new Error('Folders cannot be attached. Select individual files or create a ZIP archive.');
  }

  // files and items normally describe the same entries. Pick one source; do
  // not add both or deduplicate by name (different files may share a name).
  if (data.files.length) return Array.from(data.files);
  if (!items.length && !Array.from(data.types).includes('Files')) return null;

  const unreadable = 'The clipboard did not provide readable files. Try dragging them here or use Add files.';
  if (!items.length) throw new Error(unreadable);
  return items.map(item => {
    const file = item.getAsFile();
    if (!file) throw new Error(unreadable);
    return file;
  });
}
