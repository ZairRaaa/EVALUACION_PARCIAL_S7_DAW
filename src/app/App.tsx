import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import { InventoryPage } from '../features/inventory/InventoryPage';
import { UsersPage } from '../features/users/UsersPage';
import { LoansPage } from '../features/loans/LoansPage';
import { HistoryPage } from '../features/history/HistoryPage';
import { ReceiptPage } from '../features/receipts/ReceiptPage';
import { SessionSelector } from '../features/users/components/SessionSelector';
import { useSession } from '../features/users/useSession';

export function App() {
  const session = useSession();
  return (
    <div className="layout">
      <header><strong>Biblioteca universitaria</strong><span>Gestión de libros y usuarios</span></header>
      <section className="card app-session" aria-label="Sesión de biblioteca"><SessionSelector /></section>
      <nav aria-label="Navegación principal">
        {session.role === 'ADMIN' && <NavLink to="/admin/inventario">Categorías y libros</NavLink>}
        <NavLink to="/usuarios">Usuarios</NavLink>
        <NavLink to="/catalogo">Catálogo y préstamos</NavLink>
        <NavLink to="/historial">Historial</NavLink>
      </nav>
      <main><Routes key={`${session.role}:${session.userId ?? ''}`}>
        <Route path="/" element={<Navigate to="/catalogo" replace />} />
        <Route path="/admin/inventario" element={session.role === 'ADMIN' ? <InventoryPage /> : <Navigate to="/catalogo" replace />} />
        <Route path="/usuarios" element={<UsersPage />} />
        <Route path="/catalogo" element={<LoansPage />} />
        <Route path="/historial" element={<HistoryPage />} />
        <Route path="/comprobantes/:loanId" element={<ReceiptPage />} />
        <Route path="*" element={<section className="panel"><h1>Página no encontrada</h1><NavLink to="/">Volver al inicio</NavLink></section>} />
      </Routes></main>
    </div>
  );
}
