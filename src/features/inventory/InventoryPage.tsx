import { useEffect, useState } from 'react';
import type { Category } from '../../shared/types';
import { CategoryForm } from './components/CategoryForm';
import { deleteCategory, listCategories, saveCategory } from './inventoryService';
import './inventory.css';

export function InventoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Category | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  function refresh() { setCategories(listCategories()); }
  useEffect(() => {
    try { refresh(); } catch { setError('No se pudieron leer los datos guardados.'); }
  }, []);
  function act(action: () => void, success: string) {
    setError(''); setMessage('');
    try { action(); refresh(); setMessage(success); return true; }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'No se pudo guardar el cambio.'); return false; }
  }
  return <section className="panel inventory">
    <h1>Categorías y libros</h1>
    <p>Administra el inventario de la biblioteca.</p>
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
              }, 'Categoría eliminada.');
            }}>Eliminar<span className="sr-only"> {category.name}</span></button>
          </div>
        </li>)}</ul>
      </div>
    </div>
  </section>;
}
