import type { LibraryUser } from '../../../shared/types';

interface UserTableProps {
  users: LibraryUser[];
}

export function UserTable({ users }: UserTableProps) {
  if (users.length === 0) {
    return (
      <div className="empty-state">
        <p>No hay usuarios registrados todavía.</p>
        <p>Completa el formulario para registrar el primer usuario.</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Nombre completo</th>
            <th>Código universitario</th>
            <th>Correo electrónico</th>
            <th>Tipo</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.fullName}</td>
              <td>{user.universityCode}</td>
              <td>{user.email}</td>
              <td>
                <span className={`badge badge-${user.type.toLowerCase()}`}>
                  {user.type}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
