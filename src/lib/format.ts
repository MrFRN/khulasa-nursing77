export function formatFileSize(bytes: number | null | undefined): string {
  if (!bytes || bytes === 0) return '—';
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  return date.toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatNumber(n: number | null | undefined): string {
  if (!n) return '0';
  return n.toLocaleString('ar-EG');
}

export function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 30) return formatDate(dateStr);
  if (diffDays > 0) return `منذ ${diffDays} يوم`;
  if (diffHours > 0) return `منذ ${diffHours} ساعة`;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  if (diffMins > 0) return `منذ ${diffMins} دقيقة`;
  return 'الآن';
}
