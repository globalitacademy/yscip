
import React, { createContext } from 'react';
import { useAuthProvider } from './hooks/useAuthProvider';
import { AuthContextType } from './types';
import { AuthStateProvider } from './providers/AuthStateProvider';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuthProvider();

  if (!auth) {
    return null;
  }

  return (
    <AuthContext.Provider value={auth}>
      <AuthStateProvider 
        refreshUser={auth.refreshUser}
        setUser={auth.setUser}
      >
        {children}
      </AuthStateProvider>
    </AuthContext.Provider>
  );
};

export default AuthProvider;
