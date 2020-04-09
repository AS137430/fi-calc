export default function formatDate(point) {
  const date = new Date(point.year, point.month - 1, 1);

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
  });
}
