'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { mockAuth } from './mock/services';

type User = {
  id: string;
  email: string;
  displayName: string;
  role: 'admin' | 'user';
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(mockAuth.currentUser);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check local storage for saved user session
    const savedUser = localStorage.getItem('mockUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      mockAuth.currentUser = JSON.parse(savedUser);
    }
    setLoading(false);
  }, []);

  // Watch for auth changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('mockUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('mockUser');
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);