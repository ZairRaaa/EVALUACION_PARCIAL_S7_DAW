import { readDatabase, updateDatabase } from '../../shared/storage/database';
import type { Category } from '../../shared/types';

export function listCategories() { return readDatabase().categories; }
export function saveCategory(input: { id?: string; name: string }): Category {
  const name = input.name.trim();
  if (!name) throw new Error('Escribe el nombre de la categoría.');
  const category = { id: input.id ?? crypto.randomUUID(), name };
  updateDatabase(db => {
    if (db.categories.some(item => item.id !== category.id && item.name.toLocaleLowerCase('es') === name.toLocaleLowerCase('es'))) throw new Error('Ya existe una categoría con ese nombre.');
    const index = db.categories.findIndex(item => item.id === category.id);
    if (input.id && index === -1) throw new Error('La categoría ya no existe.');
    if (index === -1) db.categories.push(category);
    else db.categories[index] = category;
  });
  return category;
}
export function deleteCategory(id: string) {
  updateDatabase(db => {
    if (!db.categories.some(item => item.id === id)) throw new Error('La categoría ya no existe.');
    if (db.books.some(book => book.categoryId === id)) throw new Error('No puedes eliminar una categoría que tiene libros.');
    db.categories = db.categories.filter(item => item.id !== id);
  });
}
