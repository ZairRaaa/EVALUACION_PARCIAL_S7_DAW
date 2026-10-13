import { useEffect, useState } from 'react';
import { listUsers } from '../usersService';
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

  useEffect(() => {
    setUsers(listUsers());
  }, []);

  return (
    <div className="form-group">
      <label>{label} {required && '*'}</label>
      <select
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
    </div>
  );
}
