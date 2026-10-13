import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Book, Category, Loan } from '../../shared/types';
import { UserSelector } from '../users/components/UserSelector';
import { getSession } from '../users/session';
import { useSession } from '../users/useSession';
import { BookSearch } from './components/BookSearch';
import { LoanList } from './components/LoanList';
import {
  listBooks,
  listCategories,
  listLoans,
} from './loansService';

export function LoansPage() {
  const session = useSession();
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'catalog' | 'loans'>('catalog');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(() => getSession().userId);
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [recentLoan, setRecentLoan] = useState<Loan | null>(null);

  const reloadData = () => {
    try {
    setBooks(listBooks());
    setCategories(listCategories());
    setLoans(session.role === 'ADMIN' ? listLoans() : session.userId ? listLoans(session.userId) : []);
    setError('');
    } catch { setError('No se pudieron cargar los datos de la biblioteca.'); }
  };

  useEffect(() => {
    reloadData();
  }, []);

  const handleUserChange = (newUserId: string | null) => {
    const val = newUserId || null;
    setSelectedUserId(val);
  };

  const handleLoanCreated = (newLoan: Loan) => {
    setRecentLoan(newLoan);
    reloadData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoanReturned = () => {
    reloadData();
  };

  const activeLoansCount = loans.filter((l) => l.status === 'ACTIVO').length;

  return (
    <section className="panel loans-module">
      <div className="module-topbar">
        <div>
          <h1>Catálogo y Solicitud de Préstamos</h1>
          <p>Búsqueda en catálogo, control de stock disponible, solicitud de préstamos y devoluciones.</p>
        </div>
      </div>

      {error && <p role="alert" className="alert alert-danger">{error}</p>}
      {session.role === 'ADMIN' && <div className="loan-user-bar">
        <UserSelector
          value={selectedUserId}
          onChange={handleUserChange}
        />
      </div>}

      {recentLoan && (
        <div className="alert alert-success loan-success-banner">
          <div>
            <strong>¡Préstamo registrado exitosamente!</strong>
            <div>
              Libro: <em>{recentLoan.receipt.bookTitle}</em> · Usuario: <em>{recentLoan.receipt.userName}</em>
            </div>
            <div>
              Código único: <code>{recentLoan.code}</code>
            </div>
          </div>
          <div className="banner-actions">
            <Link
              to={`/comprobantes/${recentLoan.id}`}
              className="btn btn-primary btn-sm"
            >
              Ver comprobante digital
            </Link>
            <button
              type="button"
              onClick={() => setRecentLoan(null)}
              className="btn btn-outline btn-sm"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      <div className="tabs-header">
        <button
          type="button"
          className={`tab-btn ${activeTab === 'catalog' ? 'tab-btn-active' : ''}`}
          onClick={() => setActiveTab('catalog')}
        >
          Catálogo ({books.length} libros)
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'loans' ? 'tab-btn-active' : ''}`}
          onClick={() => setActiveTab('loans')}
        >
          Préstamos Activos ({activeLoansCount})
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'catalog' ? (
          <BookSearch
            books={books}
            categories={categories}
            selectedUserId={selectedUserId}
            onLoanCreated={handleLoanCreated}
          />
        ) : (
          <LoanList
            loans={loans}
            onLoanReturned={handleLoanReturned}
          />
        )}
      </div>
    </section>
  );
}
