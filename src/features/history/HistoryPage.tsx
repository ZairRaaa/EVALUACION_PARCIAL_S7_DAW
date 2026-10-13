import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Loan, LoanStatus } from '../../shared/types';
import { listLoans, returnLoan } from '../loans/loansService';
import { useSession } from '../users/useSession';
import { HistoryTable } from './components/HistoryTable';

export function HistoryPage() {
  const session = useSession();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [status, setStatus] = useState<LoanStatus | ''>('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  function reload() {
    setLoans(session.role === 'ADMIN' ? listLoans() : session.userId ? listLoans(session.userId) : []);
  }
  useEffect(() => {
    try { reload(); } catch { setError('No se pudo cargar el historial.'); }
  }, [session.role, session.userId]);
  function handleReturn(id: string) {
    if (!window.confirm('¿Registrar la devolución y reponer una unidad al inventario?')) return;
    try {
      returnLoan(id); reload(); setError(''); setMessage('Devolución registrada. Stock actualizado.');
    } catch (cause) { setMessage(''); setError(cause instanceof Error ? cause.message : 'No se pudo registrar la devolución.'); }
  }
  const visible = loans.filter(loan => !status || loan.status === status);
  return <section className="panel">
    <h1>Historial de préstamos</h1>
    <p>{session.role === 'ADMIN' ? 'Consulta los préstamos de todos los usuarios.' : 'Consulta tus libros prestados y sus fechas de devolución.'}</p>
    {session.role === 'USUARIO' && !session.userId && <p>Selecciona tu usuario en la parte superior.</p>}
    {error && <p role="alert" className="alert alert-danger">{error}</p>}
    {message && <p role="status" className="alert alert-success">{message}</p>}
    <div className="form-group history-filter"><label htmlFor="history-status">Estado del préstamo</label>
      <select id="history-status" value={status} onChange={event => setStatus(event.target.value as LoanStatus | '')}>
        <option value="">Todos</option><option value="ACTIVO">Activo</option><option value="DEVUELTO">Devuelto</option>
      </select>
    </div>
    <p>{visible.length} préstamos</p>
    {visible.length ? <HistoryTable loans={visible} onReturn={handleReturn} /> : <p>No hay préstamos para mostrar. <Link to="/catalogo">Ver catálogo</Link></p>}
  </section>;
}
