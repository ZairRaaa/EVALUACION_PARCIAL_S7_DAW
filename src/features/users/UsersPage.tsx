import { useState, useEffect } from 'react';
import { registerUser, listUsers } from './usersService';
import { UserForm } from './components/UserForm';
import { UserTable } from './components/UserTable';
import type { LibraryUser, UserType } from '../../shared/types';
import './users.css';

export function UsersPage() {
  const [users, setUsers] = useState<LibraryUser[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const loadUsers = () => {
    setUsers(listUsers());
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSubmit = async (data: {
    fullName: string;
    universityCode: string;
    email: string;
    type: UserType;
  }) => {
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const newUser = registerUser(data);
      setSuccess(`Usuario ${newUser.fullName} registrado exitosamente.`);
      loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrar usuario.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="users-page">
      <header className="page-header">
        <h1>Gestión de usuarios</h1>
        <p>Registra y administra los usuarios de la biblioteca</p>
      </header>

      <div className="page-content">
        <section className="card">
          <h2>Registrar nuevo usuario</h2>
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          <UserForm onSubmit={handleSubmit} disabled={loading} />
        </section>

        <section className="card">
          <h2>Usuarios registrados ({users.length})</h2>
          <UserTable users={users} />
        </section>
      </div>
    </div>
  );
}
