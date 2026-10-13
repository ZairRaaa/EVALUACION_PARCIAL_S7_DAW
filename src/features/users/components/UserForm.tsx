import { useState } from 'react';
import type { UserType } from '../../../shared/types';

interface UserFormProps {
  onSubmit: (data: {
    fullName: string;
    universityCode: string;
    email: string;
    type: UserType;
  }) => boolean;
  disabled?: boolean;
}

export function UserForm({ onSubmit, disabled = false }: UserFormProps) {
  const [fullName, setFullName] = useState('');
  const [universityCode, setUniversityCode] = useState('');
  const [email, setEmail] = useState('');
  const [type, setType] = useState<UserType>('ESTUDIANTE');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onSubmit({ fullName, universityCode, email, type })) return;
    // Limpiar formulario después de enviar
    setFullName('');
    setUniversityCode('');
    setEmail('');
    setType('ESTUDIANTE');
  };

  return (
    <form onSubmit={handleSubmit} className="user-form">
      <div className="form-group">
        <label htmlFor="fullName">Nombre completo *</label>
        <input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          disabled={disabled}
          required
          placeholder="Ej: Juan Pérez García"
        />
      </div>

      <div className="form-group">
        <label htmlFor="universityCode">Código universitario *</label>
        <input
          id="universityCode"
          type="text"
          value={universityCode}
          onChange={(e) => setUniversityCode(e.target.value)}
          disabled={disabled}
          required
          placeholder="Ej: 2021100123"
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">Correo electrónico *</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={disabled}
          required
          placeholder="Ej: usuario@uncp.edu.pe"
        />
      </div>

      <div className="form-group">
        <label htmlFor="type">Tipo de usuario *</label>
        <select
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value as UserType)}
          disabled={disabled}
          required
        >
          <option value="ESTUDIANTE">Estudiante</option>
          <option value="DOCENTE">Docente</option>
        </select>
      </div>

      <button type="submit" disabled={disabled} className="btn-primary">
        Registrar usuario
      </button>
    </form>
  );
}
