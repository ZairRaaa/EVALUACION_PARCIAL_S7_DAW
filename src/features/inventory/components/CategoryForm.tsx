import { useState, type FormEvent } from 'react';
import type { Category } from '../../../shared/types';

interface Props {
  category: Category | null;
  onSave: (input: { id?: string; name: string }) => boolean;
  onCancel: () => void;
}
export function CategoryForm({ category, onSave, onCancel }: Props) {
  const [name, setName] = useState(category?.name ?? '');
  function submit(event: FormEvent) {
    event.preventDefault();
    if (onSave({ id: category?.id, name })) setName('');
  }
  return <form onSubmit={submit} className="inventory-form">
    <h2>{category ? 'Editar categoría' : 'Nueva categoría'}</h2>
    <label htmlFor="category-name">Nombre de la categoría</label>
    <input id="category-name" value={name} onChange={event => setName(event.target.value)} required maxLength={100} placeholder="Ej. Ingeniería" />
    <div className="inventory-actions">
      <button type="submit">{category ? 'Guardar cambios' : 'Agregar categoría'}</button>
      {category && <button type="button" className="secondary" onClick={onCancel}>Cancelar</button>}
    </div>
  </form>;
}
