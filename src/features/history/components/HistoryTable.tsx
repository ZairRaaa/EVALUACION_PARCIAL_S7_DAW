import { Link } from 'react-router-dom';
import type { Loan } from '../../../shared/types';
import { formatDate } from '../../../shared/utils/formatters';

export function HistoryTable({ loans, onReturn }: { loans: Loan[]; onReturn: (id: string) => void }) {
  return <div className="table-wrapper"><table className="custom-table">
    <caption className="sr-only">Historial de préstamos</caption>
    <thead><tr>{['Libro y usuario', 'Código', 'Préstamo', 'Fecha límite', 'Devolución', 'Estado', 'Acciones'].map(title => <th scope="col" key={title}>{title}</th>)}</tr></thead>
    <tbody>{loans.map(loan => <tr key={loan.id}>
      <td><strong>{loan.receipt.bookTitle}</strong><div>{loan.receipt.userName}</div></td>
      <td><code className="history-code">{loan.code}</code></td>
      <td>{formatDate(loan.borrowedAt)}</td><td>{formatDate(loan.dueAt)}</td>
      <td>{loan.returnedAt ? formatDate(loan.returnedAt) : 'Pendiente'}</td>
      <td>{loan.status}</td><td><div className="actions-cell">
        <Link className="btn btn-outline btn-sm" to={`/comprobantes/${loan.id}`}>Comprobante</Link>
        {loan.status === 'ACTIVO' && <button className="btn btn-success btn-sm" onClick={() => onReturn(loan.id)}>Devolver</button>}
      </div></td>
    </tr>)}</tbody>
  </table></div>;
}
