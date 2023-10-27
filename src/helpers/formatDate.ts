export function formatDate(date: string) {
  const d = new Date(date).toLocaleDateString('en', {
    day: 'numeric',
    month: 'short',
    year: '2-digit'
  })
  return d
}
