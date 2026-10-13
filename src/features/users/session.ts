export const SESSION_KEY = 'biblioteca:session:v1';

export type Session = {
  role: 'ADMIN' | 'USUARIO';
  userId: string | null;
};

function defaultSession(): Session {
  return { role: 'ADMIN', userId: null };
}

export function getSession(): Session {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return defaultSession();
  try {
    const parsed = JSON.parse(raw) as Session;
    if (!parsed.role || (parsed.role !== 'ADMIN' && parsed.role !== 'USUARIO')) {
      return defaultSession();
    }
    return parsed;
  } catch {
    return defaultSession();
  }
}

export function setSession(session: Session): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}
