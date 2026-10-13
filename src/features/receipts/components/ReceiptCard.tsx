import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Loan } from '../../../shared/types';
import { formatDate } from '../../../shared/utils/formatters';
import { exportReceiptPdf } from '../exportReceiptPdf';

interface ReceiptCardProps {
  loan: Loan;
  onBack?: () => void;
}

export const ReceiptCard: React.FC<ReceiptCardProps> = ({ loan }) => {
  const [isExporting, setIsExporting] = useState(false);

  const loanCode = loan.loanCode || (loan as any).code || loan.id;
  const loanDate = loan.loanDate || (loan as any).borrowedAt;
  const isDevuelto = loan.status === 'DEVUELTO';

  const handleDownloadPdf = () => {
    setIsExporting(true);
    try {
      exportReceiptPdf(loan);
    } finally {
      setTimeout(() => setIsExporting(false), 600);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-2xl">
      {/* Encabezado del comprobante */}
      <div className="bg-gradient-to-r from-sky-900 via-sky-800 to-indigo-900 text-white px-6 py-6 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-white/10 text-white text-xs font-bold">
                ✓
              </span>
              <span className="text-xs font-semibold tracking-wider uppercase text-sky-200">
                Comprobante Oficial
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Préstamo de Biblioteca
            </h2>
          </div>

          {/* Badge de Estado */}
          <div className="self-start sm:self-center">
            {isDevuelto ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                DEVUELTO
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-200 border border-amber-400/30">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                ACTIVO (EN CURSO)
              </span>
            )}
          </div>
        </div>

        {/* Código único de préstamo */}
        <div className="mt-4 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-2 text-xs text-sky-100">
          <span>Código de seguimiento:</span>
          <span className="font-mono bg-white/15 px-2.5 py-1 rounded text-white font-semibold tracking-wider text-sm">
            {loanCode}
          </span>
        </div>
      </div>

      {/* Cuerpo del comprobante */}
      <div className="p-6 sm:p-8 space-y-6">
        {/* Información del libro prestado */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            Material Bibliográfico
          </p>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
            {loan.receipt.bookTitle}
          </h3>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <span>ID Ejemplar:</span>
            <code className="bg-slate-200/70 text-slate-700 px-1.5 py-0.5 rounded text-[11px]">
              {loan.bookId}
            </code>
          </p>
        </div>

        {/* Datos del usuario y fechas en Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Usuario */}
          <div className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm">
            <span className="text-xs font-medium text-slate-400 block mb-1">
              Usuario Beneficiario
            </span>
            <p className="text-base font-semibold text-slate-800">
              {loan.receipt.userName}
            </p>
            <span className="text-xs text-slate-500 block mt-0.5">
              ID Usuario: <span className="font-mono text-slate-600">{loan.userId}</span>
            </span>
          </div>

          {/* Fecha de Préstamo */}
          <div className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm">
            <span className="text-xs font-medium text-slate-400 block mb-1">
              Fecha de Préstamo
            </span>
            <p className="text-base font-semibold text-slate-800">
              {formatDate(loanDate)}
            </p>
            <span className="text-xs text-slate-400 block mt-0.5">
              Registro inicial del préstamo
            </span>
          </div>

          {/* Fecha Límite */}
          <div className="p-4 rounded-xl border border-amber-100 bg-amber-50/40 shadow-sm">
            <span className="text-xs font-medium text-amber-700 block mb-1">
              Fecha Límite de Devolución
            </span>
            <p className="text-base font-bold text-amber-900">
              {formatDate(loan.dueAt)}
            </p>
            <span className="text-xs text-amber-700/80 block mt-0.5">
              Entrega obligatoria antes de esta fecha
            </span>
          </div>

          {/* Fecha de Devolución */}
          <div className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm">
            <span className="text-xs font-medium text-slate-400 block mb-1">
              Fecha de Devolución Efectiva
            </span>
            <p className={`text-base font-semibold ${loan.returnedAt ? 'text-emerald-700 font-bold' : 'text-slate-500'}`}>
              {loan.returnedAt ? formatDate(loan.returnedAt) : 'Pendiente de devolución'}
            </p>
            <span className="text-xs text-slate-400 block mt-0.5">
              {loan.returnedAt ? 'Material recibido conforme' : 'En poder del solicitante'}
            </span>
          </div>
        </div>

        {/* Nota informativa */}
        <div className="bg-sky-50 border-l-4 border-sky-600 p-4 rounded-r-lg text-xs text-sky-900">
          <p className="font-semibold mb-0.5">Aviso Importante:</p>
          <p className="text-sky-800">
            Conserve este comprobante en formato digital o impreso. Será solicitado al momento de realizar la entrega física del libro en la biblioteca central.
          </p>
        </div>

        {/* Acciones principales */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
          <Link
            to="/historial"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            ← Volver al Historial
          </Link>

          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isExporting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-sky-700 hover:bg-sky-800 active:bg-sky-900 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            {isExporting ? 'Generando PDF...' : 'Descargar Comprobante (PDF)'}
          </button>
        </div>
      </div>
    </div>
  );
};
