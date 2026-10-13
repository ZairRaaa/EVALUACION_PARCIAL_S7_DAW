import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Loan } from '../../../shared/types';
import { formatDate } from '../../../shared/utils/formatters';
import { exportReceiptPdf } from '../exportReceiptPdf';

export function ReceiptCard({ loan }: { loan: Loan }) {
  const [error, setError] = useState('');
  return <section className="panel receipt-card">
    <span className="badge">{loan.status}</span><h1>Comprobante de préstamo</h1>
    <p>Biblioteca universitaria</p>
    <dl className="receipt-details">
      <div><dt>Código único</dt><dd>{loan.code}</dd></div>
      <div><dt>Usuario</dt><dd>{loan.receipt.userName}</dd></div>
      <div><dt>Libro prestado</dt><dd>{loan.receipt.bookTitle}</dd></div>
      <div><dt>Fecha de préstamo</dt><dd>{formatDate(loan.borrowedAt)}</dd></div>
      <div><dt>Fecha límite de devolución</dt><dd>{formatDate(loan.dueAt)}</dd></div>
      <div><dt>Devolución efectiva</dt><dd>{loan.returnedAt ? formatDate(loan.returnedAt) : 'Pendiente'}</dd></div>
    </dl>
    {error && <p role="alert" className="alert alert-danger">{error}</p>}
    <div className="actions-cell"><Link className="btn btn-outline" to="/historial">Volver al historial</Link>
      <button className="btn btn-primary" onClick={() => {
        try { exportReceiptPdf(loan); setError(''); } catch { setError('No se pudo descargar el PDF. Intenta nuevamente.'); }
      }}>Descargar PDF</button>
    </div>
  </section>;
}
