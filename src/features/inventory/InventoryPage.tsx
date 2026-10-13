import { ModulePlaceholder } from '../../shared/components/ModulePlaceholder';

export function InventoryPage() {
  return <ModulePlaceholder title="Categorías y libros" owner="Rojas" tasks={[
    'Crear, editar y eliminar categorías y libros.',
    'Validar título, autor, ISBN, categoría y stock entero no negativo.',
    'Persistir cambios y proteger registros relacionados con préstamos.',
  ]} />;
}
