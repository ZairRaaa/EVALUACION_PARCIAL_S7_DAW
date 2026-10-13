import type { Book, Category } from '../../../shared/types';

interface Props {
  books: Book[];
  categories: Category[];
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
}
export function BookTable({ books, categories, onEdit, onDelete }: Props) {
  if (!books.length) return <p>No hay libros para mostrar.</p>;
  return <div className="inventory-table-scroll" tabIndex={0} role="region" aria-label="Inventario de libros">
    <table className="inventory-table">
      <caption className="sr-only">Libros registrados y stock disponible</caption>
      <thead><tr>{['Libro', 'Categoría', 'Disponibles', 'Acciones'].map(label => <th scope="col" key={label}>{label}</th>)}</tr></thead>
      <tbody>{books.map(book => <tr key={book.id}>
        <td><strong>{book.title}</strong><small>{book.author}</small><small>ISBN: {book.isbn}</small></td>
        <td>{categories.find(category => category.id === book.categoryId)?.name ?? 'Sin categoría'}</td>
        <td><span className={book.stock === 0 ? 'stock-empty' : 'stock-available'}>{book.stock === 0 ? 'Agotado' : book.stock}</span></td>
        <td><div className="inventory-actions">
          <button className="secondary" onClick={() => onEdit(book)}>Editar<span className="sr-only"> {book.title}</span></button>
          <button className="danger" onClick={() => onDelete(book)}>Eliminar<span className="sr-only"> {book.title}</span></button>
        </div></td>
      </tr>)}</tbody>
    </table>
  </div>;
}
