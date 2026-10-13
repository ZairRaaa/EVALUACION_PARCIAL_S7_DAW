import { readDatabase, updateDatabase } from '../../shared/storage/database';
import type { LibraryUser } from '../../shared/types';
export const USERS_CHANGED = 'biblioteca:users-changed';

export function listUsers(): LibraryUser[] {
  const db = readDatabase();
  return db.users;
}

export function registerUser(input: Omit<LibraryUser, 'id'>): LibraryUser {
  // Normalizar datos
  const normalizedFullName = input.fullName.trim().replace(/\s+/g, ' ').toUpperCase();
  const normalizedCode = input.universityCode.trim().toUpperCase();
  const normalizedEmail = input.email.trim().toLowerCase();

  // Validaciones
  if (!normalizedFullName) {
    throw new Error('El nombre completo es obligatorio.');
  }
  if (!normalizedCode) {
    throw new Error('El código universitario es obligatorio.');
  }
  if (!normalizedEmail) {
    throw new Error('El correo electrónico es obligatorio.');
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    throw new Error('El formato del correo electrónico no es válido.');
  }
  if (input.type !== 'ESTUDIANTE' && input.type !== 'DOCENTE') {
    throw new Error('El tipo de usuario es obligatorio.');
  }

  const newUser: LibraryUser = {
    id: crypto.randomUUID(),
    fullName: normalizedFullName,
    universityCode: normalizedCode,
    email: normalizedEmail,
    type: input.type,
  };

  updateDatabase(draft => {
    // Verificar duplicados
    const duplicate = draft.users.find(
      u => u.universityCode === normalizedCode
    );
    if (duplicate) {
      throw new Error(`Ya existe un usuario con el código universitario ${normalizedCode}.`);
    }
    draft.users.push(newUser);
  });

  window.dispatchEvent(new Event(USERS_CHANGED));
  return newUser;
}
