const FAVORITES_KEY = 'khulasa_favorites';

export function getFavorites(): string[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function isFavorite(id: string): boolean {
  return getFavorites().includes(id);
}

export function toggleFavorite(id: string): boolean {
  const favorites = getFavorites();
  const index = favorites.indexOf(id);
  if (index >= 0) {
    favorites.splice(index, 1);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    return false;
  }
  favorites.push(id);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  return true;
}
