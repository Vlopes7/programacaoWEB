import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface AuthContextData {
  signed: boolean;
  userId: string | null;
  login: (id: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storagedUser = localStorage.getItem('@CRUDMundo:userId');
    if (storagedUser) {
      setUserId(storagedUser);
    }
    setLoading(false);
  }, []);

  const login = (id: string) => {
    setUserId(id);
    localStorage.setItem('@CRUDMundo:userId', id);
  };

  const logout = () => {
    setUserId(null);
    localStorage.removeItem('@CRUDMundo:userId');
  };

  if (loading) {
    return <div>Carregando o mundo...</div>;
  }

  return (
    <AuthContext.Provider value={{ signed: !!userId, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};