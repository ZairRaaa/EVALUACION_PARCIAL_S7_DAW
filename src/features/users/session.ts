import { readDatabase } from '../../shared/storage/database';

export const SESSION_KEY = 'biblioteca:session:v1';
export const SESSION_CHANGED = 'biblioteca:session-changed';

export type Session = {
  role: 'ADMIN' | 'USUARIO';
  userId: string | null;
};

function defaultSession(): Session {
  return { role: 'ADMIN', userId: null };
}

export function getSession(): Session {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return defaultSession();
    const parsed = JSON.parse(raw) as Session;
    if (!parsed.role || (parsed.role !== 'ADMIN' && parsed.role !== 'USUARIO')) {
      return defaultSession();
    }
    const userId = typeof parsed.userId === 'string'
      && readDatabase().users.some(user => user.id === parsed.userId) ? parsed.userId : null;
    return { role: parsed.role, userId };
  } catch {
    return defaultSession();
  }
}

export function setSession(session: Session): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  window.dispatchEvent(new Event(SESSION_CHANGED));
}
