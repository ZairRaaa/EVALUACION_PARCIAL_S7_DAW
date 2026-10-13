import { readDatabase, updateDatabase } from '../../shared/storage/database';
import type { Book, Category } from '../../shared/types';

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

export function listBooks() { return readDatabase().books; }

export function saveBook(input: Omit<Book, 'id'> & { id?: string }): Book {
  const book: Book = {
    ...input, id: input.id ?? crypto.randomUUID(), title: input.title.trim(),
    author: input.author.trim(), isbn: input.isbn.replace(/[\s-]/g, '').toUpperCase(),
  };
  if (!book.title || !book.author) throw new Error('Completa el título y el autor.');
  if (!/^(\d{9}[\dX]|\d{13})$/.test(book.isbn)) throw new Error('El ISBN debe tener 10 o 13 caracteres; puedes usar espacios o guiones.');
  if (!Number.isSafeInteger(book.stock) || book.stock < 0) throw new Error('El stock debe ser un número entero mayor o igual a cero.');
  updateDatabase(db => {
    if (!db.categories.some(category => category.id === book.categoryId)) throw new Error('Selecciona una categoría existente.');
    if (db.books.some(item => item.id !== book.id && item.isbn.replace(/[\s-]/g, '').toUpperCase() === book.isbn)) throw new Error('Ya existe un libro con ese ISBN.');
    const index = db.books.findIndex(item => item.id === book.id);
    if (input.id && index === -1) throw new Error('El libro ya no existe.');
    if (index === -1) db.books.push(book);
    else db.books[index] = book;
  });
  return book;
}

export function deleteBook(id: string) {
  updateDatabase(db => {
    if (!db.books.some(book => book.id === id)) throw new Error('El libro ya no existe.');
    if (db.loans.some(loan => loan.bookId === id && loan.status === 'ACTIVO')) throw new Error('No puedes eliminar un libro con préstamos activos.');
    db.books = db.books.filter(book => book.id !== id);
  });
}
