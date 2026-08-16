export function getFileType(fileName: string | null | undefined): string {
  if (!fileName) return 'unknown';
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  const pdfExts = ['pdf'];
  const docExts = ['doc', 'docx'];
  const pptExts = ['ppt', 'pptx'];
  const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
  const videoExts = ['mp4', 'avi', 'mov', 'mkv'];
  const archiveExts = ['zip', 'rar', '7z'];

  if (pdfExts.includes(ext)) return 'pdf';
  if (docExts.includes(ext)) return 'doc';
  if (pptExts.includes(ext)) return 'ppt';
  if (imageExts.includes(ext)) return 'image';
  if (videoExts.includes(ext)) return 'video';
  if (archiveExts.includes(ext)) return 'zip';
  return ext;
}

export function getFileTypeIcon(fileType: string): string {
  const map: Record<string, string> = {
    pdf: 'FileText',
    doc: 'FileType',
    ppt: 'Presentation',
    image: 'Image',
    video: 'Video',
    zip: 'FolderArchive',
  };
  return map[fileType] || 'File';
}

export function getFileTypeLabel(fileType: string): string {
  const map: Record<string, string> = {
    pdf: 'PDF',
    doc: 'Word',
    ppt: 'PowerPoint',
    image: 'صورة',
    video: 'فيديو',
    zip: 'ZIP',
  };
  return map[fileType] || fileType.toUpperCase();
}
