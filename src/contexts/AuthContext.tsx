import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'owner' | 'user' | null;

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  register: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  logout: () => void;
  demoLogin: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, _password: string, role: UserRole) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    setUser({
      id: '1',
      email,
      name: email.split('@')[0],
      role,
    });
  };

  const register = async (email: string, _password: string, name: string, role: UserRole) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    setUser({
      id: '1',
      email,
      name,
      role,
    });
  };

  const logout = () => {
    setUser(null);
  };

  const demoLogin = (role: UserRole) => {
    setUser({
      id: 'demo',
      email: role === 'owner' ? 'owner@smartpark.demo' : 'user@smartpark.demo',
      name: role === 'owner' ? 'Demo Owner' : 'Demo Driver',
      role,
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      demoLogin,
    }}>
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
