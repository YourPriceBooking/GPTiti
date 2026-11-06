// Only native file transfers are intercepted; text and URL dragging remain native.
export const isFileDrag = (transfer: Pick<DataTransfer, 'types'> | null) =>
  Boolean(transfer && Array.from(transfer.types).includes('Files'));

export function droppedFiles(transfer: Pick<DataTransfer, 'files' | 'items'>): File[] {
  const items = Array.from(transfer.items);
  if (items.some(item => item.kind === 'file' && item.webkitGetAsEntry?.()?.isDirectory)) {
    throw new Error('Folders cannot be attached. Select individual files or create a ZIP archive.');
  }
  const files = Array.from(transfer.files);
  if (!files.length) throw new Error('No readable files were dropped. Try Add files instead.');
  return files;
}
