import { ModulePlaceholder } from '../../shared/components/ModulePlaceholder';

export function LoansPage() {
  return <ModulePlaceholder title="Catálogo y préstamos" owner="Chahuayo" tasks={[
    'Buscar libros por título o categoría y mostrar disponibilidad.',
    'Solicitar préstamos y descontar stock en la misma operación.',
    'Consultar préstamos activos y registrar devolución una sola vez.',
  ]} />;
}
