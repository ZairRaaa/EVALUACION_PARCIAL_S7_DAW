import { ModulePlaceholder } from '../../shared/components/ModulePlaceholder';

export function UsersPage() {
  return <ModulePlaceholder title="Registro de usuarios" owner="Angel" tasks={[
    'Registrar nombres, código universitario, correo y tipo de usuario.',
    'Validar formularios y evitar códigos universitarios duplicados.',
    'Crear selector de usuario para las vistas de préstamos e historial.',
  ]} />;
}
