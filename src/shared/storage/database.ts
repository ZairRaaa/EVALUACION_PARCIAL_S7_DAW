import type { LibraryDatabase } from '../types';

export const DATABASE_KEY = 'biblioteca:v1';

function emptyDatabase(): LibraryDatabase {
  return { schemaVersion: 1, categories: [], books: [], users: [], loans: [] };
}

export function readDatabase(): LibraryDatabase {
  const raw = localStorage.getItem(DATABASE_KEY);
  if (raw === null) return emptyDatabase();
  const data = JSON.parse(raw) as LibraryDatabase;
  if (data.schemaVersion !== 1 || !Array.isArray(data.categories)
    || !Array.isArray(data.books) || !Array.isArray(data.users)
    || !Array.isArray(data.loans)) {
    throw new Error('Los datos de la biblioteca tienen un formato incompatible.');
  }
  return data;
}

// Una sola escritura permite guardar préstamo e inventario juntos.
// Los módulos deben releer el estado al mutar, sin guardar copias antiguas.
export function updateDatabase(mutate: (draft: LibraryDatabase) => void): LibraryDatabase {
  const draft = readDatabase();
  mutate(draft);
  localStorage.setItem(DATABASE_KEY, JSON.stringify(draft));
  return draft;
}
