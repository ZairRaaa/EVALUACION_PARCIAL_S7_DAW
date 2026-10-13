import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import { InventoryPage } from '../features/inventory/InventoryPage';
import { UsersPage } from '../features/users/UsersPage';
import { LoansPage } from '../features/loans/LoansPage';
import { HistoryPage } from '../features/history/HistoryPage';
import { ReceiptPage } from '../features/receipts/ReceiptPage';

export function App() {
  return (
    <div className="layout">
      <header><strong>Biblioteca universitaria</strong><span>Base de trabajo del equipo</span></header>
      <nav aria-label="Navegación principal">
        <NavLink to="/admin/inventario">Categorías y libros</NavLink>
        <NavLink to="/usuarios">Usuarios</NavLink>
        <NavLink to="/catalogo">Catálogo y préstamos</NavLink>
        <NavLink to="/historial">Historial</NavLink>
      </nav>
      <main><Routes>
        <Route path="/" element={<Navigate to="/catalogo" replace />} />
        <Route path="/admin/inventario" element={<InventoryPage />} />
        <Route path="/usuarios" element={<UsersPage />} />
        <Route path="/catalogo" element={<LoansPage />} />
        <Route path="/historial" element={<HistoryPage />} />
        <Route path="/comprobantes/:loanId" element={<ReceiptPage />} />
        <Route path="*" element={<section className="panel"><h1>Página no encontrada</h1><NavLink to="/">Volver al inicio</NavLink></section>} />
      </Routes></main>
    </div>
  );
}
