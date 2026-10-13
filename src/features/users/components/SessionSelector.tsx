import { useState } from 'react';
import { setSession, type Session } from '../session';
import { useSession } from '../useSession';
import { UserSelector } from './UserSelector';

interface SessionSelectorProps {
  onChange?: () => void;
}

export function SessionSelector({ onChange }: SessionSelectorProps) {
  const session = useSession();
  const [error, setError] = useState('');
  const save = (value: Session) => {
    try { setSession(value); setError(''); onChange?.(); }
    catch { setError('No se pudo guardar la sesión. Revisa el almacenamiento del navegador.'); }
  };

  const handleRoleChange = (role: 'ADMIN' | 'USUARIO') => {
    const newSession: Session = {
      role,
      userId: role === 'ADMIN' ? null : session.userId,
    };
    save(newSession);
  };

  const handleUserChange = (userId: string | null) => {
    const newSession: Session = {
      ...session,
      userId,
    };
    save(newSession);
  };

  return (
    <div className="session-selector">
      <div className="form-group">
        <label htmlFor="session-role">Modo de uso</label>
        <select
          id="session-role"
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
      {error && <p role="alert">{error}</p>}
      {session.role === 'USUARIO' && !session.userId && <p role="status">Selecciona un usuario registrado para consultar sus préstamos.</p>}
    </div>
  );
}
