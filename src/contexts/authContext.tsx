// authContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';

type AuthState = {
  isAuthenticated: boolean;
  token: string | null;
  user: any | null;
};

type AuthContextType = {
  authState: AuthState;
  setAuthState: (state: AuthState) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    token: null,
    user: null,
  });

  // Check for token on initial load
  useEffect(() => {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (token) {
      // Here you might want to validate the token with your backend
      setAuthState({
        isAuthenticated: true,
        token,
        user: null, // You might want to fetch user data here
      });
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
    setAuthState({
      isAuthenticated: false,
      token: null,
      user: null,
    });
  };

  return (
    <AuthContext.Provider value={{ authState, setAuthState, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};