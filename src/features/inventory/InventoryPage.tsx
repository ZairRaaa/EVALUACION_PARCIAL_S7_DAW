import { useEffect, useState } from 'react';
import type { Book, Category } from '../../shared/types';
import { BookForm } from './components/BookForm';
import { BookTable } from './components/BookTable';
import { CategoryForm } from './components/CategoryForm';
import { deleteBook, deleteCategory, listBooks, listCategories, saveBook, saveCategory } from './inventoryService';
import './inventory.css';

export function InventoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Category | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  function refresh() { setCategories(listCategories()); setBooks(listBooks()); }
  useEffect(() => {
    try { refresh(); } catch { setError('No se pudieron leer los datos guardados.'); }
  }, []);
  function act(action: () => void, success: string) {
    setError(''); setMessage('');
    try { action(); refresh(); setMessage(success); return true; }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'No se pudo guardar el cambio.'); return false; }
  }
  const search = query.trim().toLocaleLowerCase('es');
  const filteredBooks = books.filter(book =>
    (!categoryFilter || book.categoryId === categoryFilter)
    && `${book.title} ${book.author} ${book.isbn}`.toLocaleLowerCase('es').includes(search));
  return <section className="panel inventory">
    <h1>Categorías y libros</h1>
    <p>Administra el inventario de la biblioteca.</p>
    <div className="inventory-summary" aria-label="Resumen del inventario">
      <span><strong>{categories.length}</strong> categorías</span>
      <span><strong>{books.length}</strong> títulos</span>
      <span><strong>{books.reduce((total, book) => total + book.stock, 0)}</strong> ejemplares disponibles</span>
    </div>
    {error && <p role="alert" className="inventory-error">{error}</p>}
    {message && <p role="status" className="inventory-success">{message}</p>}
    <div className="inventory-grid">
      <CategoryForm key={editing?.id ?? 'new'} category={editing} onCancel={() => setEditing(null)} onSave={input => act(() => { saveCategory(input); setEditing(null); }, 'Categoría guardada.')} />
      <div><h2>Categorías ({categories.length})</h2>
        {!categories.length && <p>Aún no hay categorías. Registra la primera para agregar libros.</p>}
        <ul className="category-list">{categories.map(category => <li key={category.id}>
          <span>{category.name}</span><div className="inventory-actions">
            <button className="secondary" onClick={() => setEditing(category)}>Editar<span className="sr-only"> {category.name}</span></button>
            <button className="danger" onClick={() => {
              if (window.confirm(`¿Eliminar la categoría «${category.name}»?`)) act(() => {
                deleteCategory(category.id); if (editing?.id === category.id) setEditing(null);
                if (categoryFilter === category.id) setCategoryFilter('');
              }, 'Categoría eliminada.');
            }}>Eliminar<span className="sr-only"> {category.name}</span></button>
          </div>
        </li>)}</ul>
      </div>
    </div>
    <hr />
    <div className="inventory-grid books-grid">
      <BookForm key={editingBook?.id ?? 'new-book'} book={editingBook} categories={categories} onCancel={() => setEditingBook(null)} onSave={input => act(() => { saveBook(input); setEditingBook(null); }, 'Libro guardado.')} />
      <div><h2>Libros ({books.length})</h2>
        <div className="inventory-filters">
          <label htmlFor="inventory-search">Buscar libro
            <input id="inventory-search" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Título, autor o ISBN" />
          </label>
          <label htmlFor="inventory-filter">Filtrar por categoría
            <select id="inventory-filter" value={categoryFilter} onChange={event => setCategoryFilter(event.target.value)}>
              <option value="">Todas las categorías</option>
              {categories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}
            </select>
          </label>
          {(query || categoryFilter) && <button className="secondary" onClick={() => { setQuery(''); setCategoryFilter(''); }}>Limpiar filtros</button>}
        </div>
        <p className="inventory-count" role="status">{filteredBooks.length} de {books.length} libros</p>
        <BookTable books={filteredBooks} categories={categories} onEdit={setEditingBook} onDelete={book => {
          if (window.confirm(`¿Eliminar el libro «${book.title}»?`)) act(() => {
            deleteBook(book.id); if (editingBook?.id === book.id) setEditingBook(null);
          }, 'Libro eliminado.');
        }} />
      </div>
    </div>
  </section>;
}
