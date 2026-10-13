import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Loan } from '../../../shared/types';
import { returnLoan } from '../loansService';

interface LoanListProps {
  loans: Loan[];
  onLoanReturned: (loan: Loan) => void;
}

export function LoanList({ loans, onLoanReturned }: LoanListProps) {
  const [filterText, setFilterText] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const activeLoans = loans.filter((loan) => loan.status === 'ACTIVO');

  const filteredLoans = activeLoans.filter((loan) => {
    const text = filterText.toLowerCase();
    return (
      loan.code.toLowerCase().includes(text) ||
      loan.receipt.bookTitle.toLowerCase().includes(text) ||
      loan.receipt.userName.toLowerCase().includes(text)
    );
  });

  const handleReturn = (loan: Loan) => {
    setErrorMsg('');
    setSuccessMsg('');

    const confirmed = window.confirm(
      `¿Registrar devolución del libro "${loan.receipt.bookTitle}" prestado a ${loan.receipt.userName}? Se repondrá 1 unidad al stock.`
    );
    if (!confirmed) return;

    try {
      setProcessingId(loan.id);
      const updatedLoan = returnLoan(loan.id);
      setSuccessMsg(`Devolución registrada con éxito para el préstamo ${updatedLoan.code}. Stock repuesto.`);
      onLoanReturned(updatedLoan);
    } catch (err) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('Error desconocido al procesar la devolución.');
      }
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-PE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="loan-list-container">
      {errorMsg && (
        <div className="alert alert-danger" role="alert">
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="alert alert-success" role="alert">
          {successMsg}
        </div>
      )}

      <div className="list-header-bar">
        <div className="form-group flex-1">
          <input
            type="search"
            placeholder="Filtrar préstamos activos por código, libro o usuario..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="input-control"
          />
        </div>
        <div className="list-stats">
          Préstamos activos: <strong>{activeLoans.length}</strong>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Libro</th>
              <th>Usuario</th>
              <th>Fecha Préstamo</th>
              <th>Fecha Límite</th>
              <th>Estado</th>
              <th style={{ textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredLoans.length === 0 ? (
              <tr>
                <td colSpan={7} className="empty-message">
                  {activeLoans.length === 0
                    ? 'No hay préstamos activos registrados en el sistema.'
                    : 'No se encontraron préstamos con los criterios ingresados.'}
                </td>
              </tr>
            ) : (
              filteredLoans.map((loan) => {
                const isOverdue = new Date(loan.dueAt).getTime() < Date.now();
                const isBusy = processingId === loan.id;

                return (
                  <tr key={loan.id} className={isOverdue ? 'row-overdue' : ''}>
                    <td>
                      <code className="loan-code-badge" title={loan.code}>
                        {loan.code.slice(0, 12)}...
                      </code>
                    </td>
                    <td>
                      <strong>{loan.receipt.bookTitle}</strong>
                    </td>
                    <td>{loan.receipt.userName}</td>
                    <td>{formatDate(loan.borrowedAt)}</td>
                    <td>
                      <span className={isOverdue ? 'text-overdue' : ''}>
                        {formatDate(loan.dueAt)}
                      </span>
                      {isOverdue && <span className="tag-warning">Vencido</span>}
                    </td>
                    <td>
                      <span className="badge-status badge-active">ACTIVO</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="actions-cell">
                        <Link
                          to={`/comprobantes/${loan.id}`}
                          className="btn btn-outline btn-sm"
                        >
                          Comprobante
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleReturn(loan)}
                          disabled={isBusy}
                          className="btn btn-success btn-sm"
                        >
                          {isBusy ? 'Guardando...' : 'Devolver'}
                        </button>
                      </div>
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
