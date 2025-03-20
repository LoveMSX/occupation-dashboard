export const getStatusEmoji = (status: string): string => {
  const statusMap: Record<string, string> = {
    'ongoing': '🟢',
    'completed': '✅',
    'planned': '🟡',
    'standby': '🟠',
    'error': '❌',
    'success': '✅',
    'warning': '⚠️',
    'info': 'ℹ️'
  };
  return statusMap[status.toLowerCase()] || '🔵';
};

export const formatDateTime = (date: string): string => {
  return new Date(date).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatSection = (title: string, content: string): string => {
  const separator = '─'.repeat(50);
  return [
    title,
    separator,
    content,
    separator
  ].join('\n');
};