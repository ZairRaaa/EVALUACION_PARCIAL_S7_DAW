import { useEffect, useState } from 'react';
import { getSession, SESSION_CHANGED } from './session';

export function useSession() {
  const [session, updateSession] = useState(getSession);
  useEffect(() => {
    const refresh = () => updateSession(getSession());
    window.addEventListener(SESSION_CHANGED, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(SESSION_CHANGED, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);
  return session;
}
