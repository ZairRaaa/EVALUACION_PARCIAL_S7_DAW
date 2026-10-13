import React from 'react';
import { Link } from 'react-router-dom';
import type { Loan } from '../../../shared/types';
import { formatDate } from '../../../shared/utils/formatters';

export interface HistoryTableProps {
  loans: Loan[];
  onReturn: (loanId: string) => void;
}

export const HistoryTable: React.FC<HistoryTableProps> = ({ loans, onReturn }) => {
  return (
    <div className="w-full space-y-4">
      {/* Vista de Tabla para pantallas medianas y grandes */}
      <div className="hidden md:block overflow-hidden bg-white border border-slate-200 rounded-2xl shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-xs tracking-wider">
            <tr>
              <th scope="col" className="px-6 py-4">Código / Libro</th>
              <th scope="col" className="px-6 py-4">F. Préstamo</th>
              <th scope="col" className="px-6 py-4">F. Límite</th>
              <th scope="col" className="px-6 py-4">F. Devolución</th>
              <th scope="col" className="px-6 py-4 text-center">Estado</th>
              <th scope="col" className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {loans.map((loan) => {
              const loanCode = loan.loanCode || (loan as any).code || loan.id;
              const loanDate = loan.loanDate || (loan as any).borrowedAt;
              const isActivo = loan.status === 'ACTIVO';

              return (
                <tr
                  key={loan.id}
                  className="hover:bg-slate-50/80 transition-colors duration-150"
                >
                  {/* Título y código */}
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900 line-clamp-1 max-w-xs">
                      {loan.receipt.bookTitle}
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 font-mono">
                      <span>Cód: {loanCode}</span>
                    </div>
                  </td>

                  {/* Fecha de Préstamo */}
                  <td className="px-6 py-4 text-slate-700 whitespace-nowrap">
                    {formatDate(loanDate)}
                  </td>

                  {/* Fecha Límite */}
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-amber-800">
                    {formatDate(loan.dueAt)}
                  </td>

                  {/* Fecha Devolución */}
                  <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                    {loan.returnedAt ? (
                      <span className="text-emerald-700 font-medium">
                        {formatDate(loan.returnedAt)}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">Pendiente</span>
                    )}
                  </td>

                  {/* Estado con Badge */}
                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    {isActivo ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                        ACTIVO
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        DEVUELTO
                      </span>
                    )}
                  </td>

                  {/* Acciones */}
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      {isActivo && (
                        <button
                          type="button"
                          onClick={() => onReturn(loan.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer"
                          title="Registrar devolución del libro"
                        >
                          Devolver
                        </button>
                      )}

                      <Link
                        to={`/comprobantes/${loan.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg transition-colors"
                        title="Ver comprobante en pantalla o descargar PDF"
                      >
                        Comprobante
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Vista de Tarjetas Responsivas para móviles */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {loans.map((loan) => {
          const loanCode = loan.loanCode || (loan as any).code || loan.id;
          const loanDate = loan.loanDate || (loan as any).borrowedAt;
          const isActivo = loan.status === 'ACTIVO';

          return (
            <div
              key={loan.id}
              className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm leading-snug">
                    {loan.receipt.bookTitle}
                  </h4>
                  <span className="text-xs font-mono text-slate-500">
                    {loanCode}
                  </span>
                </div>

                {isActivo ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
                    ACTIVO
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                    DEVUELTO
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div>
                  <span className="text-slate-400 block">F. Préstamo:</span>
                  <span className="font-medium text-slate-700">
                    {formatDate(loanDate)}
                  </span>
                </div>
                <div>
                  <span className="text-amber-700/80 block">F. Límite:</span>
                  <span className="font-bold text-amber-900">
                    {formatDate(loan.dueAt)}
                  </span>
                </div>
                <div className="col-span-2 pt-1 border-t border-slate-200/60">
                  <span className="text-slate-400 block">F. Devolución:</span>
                  <span className="font-medium text-slate-700">
                    {loan.returnedAt ? formatDate(loan.returnedAt) : 'Pendiente'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                {isActivo && (
                  <button
                    type="button"
                    onClick={() => onReturn(loan.id)}
                    className="flex-1 text-center py-2 px-3 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer"
                  >
                    Devolver
                  </button>
                )}
                <Link
                  to={`/comprobantes/${loan.id}`}
                  className="flex-1 text-center py-2 px-3 text-xs font-semibold text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg transition-colors"
                >
                  Ver Comprobante
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
