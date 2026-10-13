import { ModulePlaceholder } from '../../shared/components/ModulePlaceholder';

export function HistoryPage() {
  return <ModulePlaceholder title="Historial de préstamos" owner="Alvitrez" tasks={[
    'Filtrar préstamos por usuario y estado.',
    'Mostrar fechas de préstamo, vencimiento y devolución real.',
    'Abrir el comprobante de cada préstamo.',
  ]} />;
}
