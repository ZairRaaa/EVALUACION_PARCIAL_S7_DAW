export interface Session {
  role: 'ADMIN' | 'USUARIO';
  userId: string | null;
}

const SESSION_STORAGE_KEY = 'biblioteca:session';

/**
 * Retorna la sesión actual del sistema.
 * Si no hay sesión explícita almacenada, devuelve un usuario predeterminado para pruebas.
 */
export function getSession(): Session {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && (parsed.role === 'ADMIN' || parsed.role === 'USUARIO')) {
        return parsed;
      }
    }
  } catch {
    // Si falla el parseo, se recurre a la sesión por defecto
  }

  // Sesión predeterminada para el entorno del examen
  return {
    role: 'USUARIO',
    userId: 'user-001',
  };
}

/**
 * Permite cambiar la sesión actual en memoria/almacenamiento para propósitos de prueba y desarrollo.
 */
export function setSession(session: Session): void {
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}
