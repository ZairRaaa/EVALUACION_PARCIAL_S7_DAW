import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { readDatabase } from '../../shared/storage/database';
import { ReceiptCard } from './components/ReceiptCard';

export function ReceiptPage() {
  const { loanId } = useParams<{ loanId: string }>();

  // Búsqueda del préstamo en la base de datos simulada
  const loan = useMemo(() => {
    if (!loanId) return null;
    try {
      const db = readDatabase();
      return (
        db.loans.find(
          (item) =>
            item.id === loanId ||
            item.loanCode === loanId ||
            (item as any).code === loanId
        ) || null
      );
    } catch (err) {
      console.error('Error al consultar readDatabase():', err);
      return null;
    }
  }, [loanId]);

  // Si el préstamo no existe o el ID es inválido
  if (!loan) {
    return (
      <div className="w-full max-w-xl mx-auto my-8 p-8 bg-white border border-rose-200 rounded-2xl shadow-md text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 text-2xl font-bold">
          !
        </div>
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 mb-2">
          Comprobante no encontrado
        </span>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">
          Préstamo inexistente
        </h1>
        <p className="text-slate-600 text-sm mb-6 max-w-md mx-auto">
          No se encontró ningún registro de préstamo asociado al identificador:{' '}
          <code className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-medium">
            {loanId || 'N/A'}
          </code>
          . Es posible que el préstamo haya sido eliminado o el enlace sea incorrecto.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/historial"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-xl transition-colors shadow-sm"
          >
            ← Volver al Historial
          </Link>
          <Link
            to="/catalogo"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Ir al Catálogo
          </Link>
        </div>
      </div>
    );
  }

  // Renderizar el comprobante si fue encontrado con éxito
  return (
    <div className="py-6 sm:py-8 px-4 sm:px-0">
      <div className="max-w-2xl mx-auto mb-4 flex items-center justify-between text-xs text-slate-500">
        <span>Sistema de Biblioteca &gt; Comprobante</span>
        <span>ID: {loan.id}</span>
      </div>
      <ReceiptCard loan={loan} />
    </div>
  );
}
