import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Session type
interface User {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
}

interface Session {
  user: User | null;
  isLoading: boolean;
}

// Context
const SessionContext = createContext<Session>({
  user: null,
  isLoading: true,
});

export function useSession() {
  return useContext(SessionContext);
}

// API URL from environment or default
const API_URL = typeof window !== 'undefined'
  ? (window as any).__ENV__?.API_URL || 'http://localhost:3001'
  : 'http://localhost:3001';

interface RootProps {
  children: ReactNode;
}

export default function Root({ children }: RootProps): JSX.Element {
  const [session, setSession] = useState<Session>({
    user: null,
    isLoading: true,
  });

  useEffect(() => {
    // Fetch session on mount
    const fetchSession = async () => {
      try {
        const response = await fetch(`${API_URL}/api/auth/session`, {
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setSession({
            user: data.user || null,
            isLoading: false,
          });
        } else {
          setSession({
            user: null,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error('Failed to fetch session:', error);
        setSession({
          user: null,
          isLoading: false,
        });
      }
    };

    fetchSession();
  }, []);

  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
}
