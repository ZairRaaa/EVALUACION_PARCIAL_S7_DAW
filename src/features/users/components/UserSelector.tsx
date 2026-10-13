import { useEffect, useState } from 'react';
import { readDatabase } from '../../../shared/storage/database';
import type { LibraryUser } from '../../../shared/types';

interface UserSelectorProps {
  value: string | null;
  onChange: (id: string) => void;
}

export function UserSelector({ value, onChange }: UserSelectorProps) {
  const [users, setUsers] = useState<LibraryUser[]>([]);

  useEffect(() => {
    try {
      const db = readDatabase();
      setUsers(db.users || []);
    } catch {
      setUsers([]);
    }
  }, []);

  return (
    <div className="form-group flex-1">
      <label htmlFor="user-selector"><strong>Usuario solicitante:</strong></label>
      <select
        id="user-selector"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="input-control"
      >
        <option value="">-- Seleccione un estudiante o docente --</option>
        {users.map((u) => (
          <option key={u.id} value={u.id}>
            {u.fullName} ({u.universityCode}) - {u.type}
          </option>
        ))}
      </select>
    </div>
  );
}
