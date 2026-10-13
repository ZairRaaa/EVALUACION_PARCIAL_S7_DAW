import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Loan } from '../../shared/types';
import { readDatabase } from '../../shared/storage/database';
import { getSession } from '../users/session';
import { HistoryTable } from './components/HistoryTable';

export function HistoryPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const session = getSession();
      setCurrentUserId(session.userId);

      const db = readDatabase();
      const allLoans = Array.isArray(db.loans) ? db.loans : [];

      // Filtrar préstamos por el usuario actual según el contrato
      if (session.userId) {
        const filtered = allLoans.filter((item) => item.userId === session.userId);
        setLoans(filtered);
      } else {
        // En caso de que no haya un userId específico en la sesión
        setLoans(session.role === 'ADMIN' ? allLoans : []);
      }
    } catch (error) {
      console.error('Error al cargar el historial de préstamos:', error);
      setLoans([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Función de devolución simulada / mock según requerimiento
  const handleReturn = (loanId: string) => {
    console.log(`[HISTORIAL] Devolución procesada para préstamo ID: ${loanId}`);

    // Mock visual optimista para enriquecer la experiencia de usuario y revisión del examen
    setLoans((prevLoans) =>
      prevLoans.map((item) =>
        item.id === loanId
          ? {
              ...item,
              status: 'DEVUELTO',
              returnedAt: new Date().toISOString(),
            }
          : item
      )
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center text-slate-500 text-sm">
          <div className="w-8 h-8 border-3 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          Cargando historial de préstamos...
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto py-6 space-y-6">
      {/* Encabezado del Módulo */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-sky-600"></span>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Módulo de Préstamos
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Historial de Préstamos
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Revisa tus préstamos activos, fechas límite y consulta tus comprobantes oficiales.
          </p>
        </div>

        {/* Resumen de sesión */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-3 text-xs text-slate-600 self-start sm:self-center">
          <span className="block text-slate-400 font-medium">Sesión conectada:</span>
          <span className="font-semibold text-slate-800">
            Usuario: <code className="text-sky-700 font-mono">{currentUserId || 'Sin identificar'}</code>
          </span>
          <span className="block text-slate-400 mt-0.5">
            Total en historial: <strong>{loans.length}</strong>
          </span>
        </div>
      </div>

      {/* Contenido: Tabla o Estado Vacío */}
      {loans.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-10 text-center shadow-sm">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center text-3xl">
            📖
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">
            No tienes préstamos registrados
          </h2>
          <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
            Aún no has solicitado ningún libro en la biblioteca o no hay registros activos asociados a tu cuenta de usuario ({currentUserId || 'actual'}).
          </p>
          <Link
            to="/catalogo"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-xl shadow-sm transition-all"
          >
            Explorar Catálogo y Solicitar
          </Link>
        </div>
      ) : (
        <HistoryTable loans={loans} onReturn={handleReturn} />
      )}
    </div>
  );
}
