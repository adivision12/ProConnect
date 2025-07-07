export function getTimeAgo(dateString) {
  const now = new Date();
  const posted = new Date(dateString);
  const diff = Math.floor((now - posted) / 1000); // difference in seconds

  if (diff < 60) return `Just Now`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
  if (diff < 31536000) return `${Math.floor(diff / 2592000)}mo ago`;
  
  return `${Math.floor(diff / 31536000)}y ago`;
}