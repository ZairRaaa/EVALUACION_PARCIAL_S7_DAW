export type Session = {
  role: 'ADMIN' | 'USUARIO';
  userId: string | null;
};

const SESSION_KEY = 'biblioteca:session:v1';

export function getSession(): Session {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) {
    return { role: 'USUARIO', userId: null };
  }
  try {
    const data = JSON.parse(raw) as Session;
    if (data && (data.role === 'ADMIN' || data.role === 'USUARIO')) {
      return data;
    }
    return { role: 'USUARIO', userId: null };
  } catch {
    return { role: 'USUARIO', userId: null };
  }
}

export function setSession(session: Session): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}
