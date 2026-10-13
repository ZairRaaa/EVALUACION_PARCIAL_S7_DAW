import { useState, type FormEvent } from 'react';
import type { Book, Category } from '../../../shared/types';

interface Props {
  book: Book | null;
  categories: Category[];
  onSave: (input: Omit<Book, 'id'> & { id?: string }) => boolean;
  onCancel: () => void;
}
export function BookForm({ book, categories, onSave, onCancel }: Props) {
  const [title, setTitle] = useState(book?.title ?? '');
  const [author, setAuthor] = useState(book?.author ?? '');
  const [isbn, setIsbn] = useState(book?.isbn ?? '');
  const [categoryId, setCategoryId] = useState(book?.categoryId ?? '');
  const [stock, setStock] = useState(String(book?.stock ?? 0));
  function submit(event: FormEvent) {
    event.preventDefault();
    if (onSave({ id: book?.id, title, author, isbn, categoryId, stock: stock.trim() ? Number(stock) : NaN })) {
      setTitle(''); setAuthor(''); setIsbn(''); setCategoryId(''); setStock('0');
    }
  }
  return <form className="inventory-form" onSubmit={submit}>
    <h2>{book ? 'Editar libro' : 'Nuevo libro'}</h2>
    <label htmlFor="book-title">Título</label>
    <input id="book-title" value={title} onChange={e => setTitle(e.target.value)} required maxLength={250} />
    <label htmlFor="book-author">Autor</label>
    <input id="book-author" value={author} onChange={e => setAuthor(e.target.value)} required maxLength={160} />
    <label htmlFor="book-isbn">ISBN</label>
    <input id="book-isbn" value={isbn} onChange={e => setIsbn(e.target.value)} required maxLength={25} aria-describedby="isbn-help" />
    <small id="isbn-help">10 o 13 caracteres. Se permiten espacios y guiones.</small>
    <label htmlFor="book-category">Categoría</label>
    <select id="book-category" value={categoryId} onChange={e => setCategoryId(e.target.value)} required>
      <option value="">Selecciona una categoría</option>
      {categories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}
    </select>
    {!categories.length && <small>Primero registra una categoría.</small>}
    <label htmlFor="book-stock">Stock disponible</label>
    <input id="book-stock" type="number" min="0" step="1" max={Number.MAX_SAFE_INTEGER} value={stock} onChange={e => setStock(e.target.value)} required />
    <small>Ejemplares disponibles para prestar, sin contar los que ya están prestados.</small>
    <div className="inventory-actions">
      <button type="submit" disabled={!categories.length}>{book ? 'Guardar cambios' : 'Agregar libro'}</button>
      {book && <button type="button" className="secondary" onClick={onCancel}>Cancelar</button>}
    </div>
  </form>;
}
