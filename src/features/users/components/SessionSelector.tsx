import { useEffect, useState } from 'react';
import { getSession, setSession, type Session } from '../session';
import { UserSelector } from './UserSelector';

interface SessionSelectorProps {
  onChange?: () => void;
}

export function SessionSelector({ onChange }: SessionSelectorProps) {
  const [session, setSessionState] = useState<Session>(getSession());

  const handleRoleChange = (role: 'ADMIN' | 'USUARIO') => {
    const newSession: Session = {
      role,
      userId: role === 'ADMIN' ? null : session.userId,
    };
    setSession(newSession);
    setSessionState(newSession);
    onChange?.();
  };

  const handleUserChange = (userId: string | null) => {
    const newSession: Session = {
      ...session,
      userId,
    };
    setSession(newSession);
    setSessionState(newSession);
    onChange?.();
  };

  return (
    <div className="session-selector">
      <div className="form-group">
        <label>Modo de uso</label>
        <select
          value={session.role}
          onChange={(e) => handleRoleChange(e.target.value as 'ADMIN' | 'USUARIO')}
        >
          <option value="ADMIN">Administrador</option>
          <option value="USUARIO">Usuario</option>
        </select>
      </div>

      {session.role === 'USUARIO' && (
        <UserSelector
          value={session.userId}
          onChange={handleUserChange}
          label="Usuario activo"
          required={true}
        />
      )}

      <div className="session-info">
        <strong>Sesión actual:</strong> {session.role}
        {session.role === 'USUARIO' && session.userId && (
          <span> (Usuario seleccionado)</span>
        )}
      </div>
    </div>
  );
}
