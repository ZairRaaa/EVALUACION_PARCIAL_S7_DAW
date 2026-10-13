import { useParams, Link } from 'react-router-dom';
import { readDatabase } from '../../shared/storage/database';
import { useSession } from '../users/useSession';
import { ReceiptCard } from './components/ReceiptCard';

export function ReceiptPage() {
  const { loanId } = useParams();
  const session = useSession();
  try {
    const loan = readDatabase().loans.find(item => item.id === loanId || item.code === loanId);
    if (!loan || (session.role !== 'ADMIN' && loan.userId !== session.userId)) {
      return <section className="panel"><h1>Comprobante no disponible</h1><p>No existe o no pertenece al usuario seleccionado.</p><Link to="/historial">Volver al historial</Link></section>;
    }
    return <ReceiptCard loan={loan} />;
  } catch {
    return <section className="panel"><h1>No se pudo cargar el comprobante</h1><p>Revisa el almacenamiento del navegador.</p><Link to="/historial">Volver al historial</Link></section>;
  }
}
