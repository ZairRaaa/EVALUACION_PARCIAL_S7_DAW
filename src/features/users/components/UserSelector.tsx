import { useEffect, useId, useState } from 'react';
import { listUsers, USERS_CHANGED } from '../usersService';
import type { LibraryUser } from '../../../shared/types';

interface UserSelectorProps {
  value: string | null;
  onChange: (id: string | null) => void;
  label?: string;
  required?: boolean;
}

export function UserSelector({ 
  value, 
  onChange, 
  label = 'Seleccionar usuario',
  required = false 
}: UserSelectorProps) {
  const [users, setUsers] = useState<LibraryUser[]>([]);
  const [error, setError] = useState('');
  const id = useId();

  useEffect(() => {
    const refresh = () => {
      try { setUsers(listUsers()); setError(''); }
      catch { setError('No se pudieron cargar los usuarios.'); }
    };
    refresh();
    window.addEventListener(USERS_CHANGED, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(USERS_CHANGED, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  return (
    <div className="form-group">
      <label htmlFor={id}>{label} {required && '*'}</label>
      <select
        id={id}
        value={value || ''}
        onChange={(e) => onChange(e.target.value || null)}
        required={required}
      >
        <option value="">-- Seleccione un usuario --</option>
        {users.length === 0 && (
          <option value="" disabled>No hay usuarios registrados</option>
        )}
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.fullName} - {user.universityCode} ({user.type})
          </option>
        ))}
      </select>
      {error && <p role="alert">{error}</p>}
    </div>
  );
}
