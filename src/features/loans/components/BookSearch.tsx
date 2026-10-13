import { useState } from 'react';
import type { Book, Category, Loan } from '../../../shared/types';
import { createLoan } from '../loansService';

interface BookSearchProps {
  books: Book[];
  categories: Category[];
  selectedUserId: string | null;
  onLoanCreated: (loan: Loan) => void;
}

export function BookSearch({
  books,
  categories,
  selectedUserId,
  onLoanCreated,
}: BookSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const categoryMap = new Map<string, string>();
  for (const cat of categories) {
    categoryMap.set(cat.id, cat.name);
  }

  const filteredBooks = books.filter((book) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      book.title.toLowerCase().includes(term) ||
      book.author.toLowerCase().includes(term) ||
      book.isbn.toLowerCase().includes(term);

    const matchesCategory = selectedCategory === '' || book.categoryId === selectedCategory;
    const matchesStock = !onlyAvailable || book.stock > 0;

    return matchesSearch && matchesCategory && matchesStock;
  });

  const handleRequestLoan = (book: Book) => {
    setErrorMsg('');

    if (!selectedUserId) {
      setErrorMsg('Debe seleccionar a un usuario solicitante antes de pedir el préstamo.');
      return;
    }

    if (book.stock < 1) {
      setErrorMsg(`El libro "${book.title}" no cuenta con ejemplares disponibles.`);
      return;
    }

    try {
      setProcessingId(book.id);
      const newLoan = createLoan({
        userId: selectedUserId,
        bookId: book.id,
      });
      onLoanCreated(newLoan);
    } catch (err) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('Error desconocido al solicitar el préstamo.');
      }
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="book-search-container">
      {errorMsg && (
        <div className="alert alert-danger" role="alert">
          {errorMsg}
        </div>
      )}

      <div className="filters-bar">
        <div className="form-group flex-2">
          <label htmlFor="search-input">Buscar por título, autor o ISBN:</label>
          <input
            id="search-input"
            type="search"
            placeholder="Ej: Cálculo, Clean Code, 978-..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-control"
          />
        </div>

        <div className="form-group flex-1">
          <label htmlFor="category-select">Categoría:</label>
          <select
            id="category-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input-control"
          >
            <option value="">Todas las categorías</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={onlyAvailable}
              onChange={(e) => setOnlyAvailable(e.target.checked)}
            />
            Solo con stock disponible
          </label>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Título y Autor</th>
              <th>Categoría</th>
              <th>ISBN</th>
              <th>Disponibilidad</th>
              <th style={{ textAlign: 'right' }}>Acción</th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.length === 0 ? (
              <tr>
                <td colSpan={5} className="empty-message">
                  No se encontraron libros disponibles con los criterios seleccionados.
                </td>
              </tr>
            ) : (
              filteredBooks.map((book) => {
                const categoryName = categoryMap.get(book.categoryId) || 'Sin categoría';
                const hasStock = book.stock >= 1;
                const isProcessing = processingId === book.id;

                return (
                  <tr key={book.id}>
                    <td>
                      <div className="book-title">{book.title}</div>
                      <div className="book-author">{book.author}</div>
                    </td>
                    <td>
                      <span className="badge-category">{categoryName}</span>
                    </td>
                    <td className="isbn-code">{book.isbn}</td>
                    <td>
                      {hasStock ? (
                        <span className="badge-stock badge-available">
                          Disponible ({book.stock})
                        </span>
                      ) : (
                        <span className="badge-stock badge-exhausted">
                          Agotado (0)
                        </span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => handleRequestLoan(book)}
                        disabled={!hasStock || isProcessing || !selectedUserId}
                        className={`btn ${hasStock && selectedUserId ? 'btn-primary' : 'btn-disabled'}`}
                        title={
                          !selectedUserId
                            ? 'Seleccione un usuario arriba para continuar'
                            : !hasStock
                            ? 'No hay stock disponible'
                            : 'Solicitar préstamo'
                        }
                      >
                        {isProcessing ? 'Guardando...' : 'Solicitar préstamo'}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
