import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  virtualCash: number;
  level: number;
  xp: number;
  streak?: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUserXP: (xpGain: number) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { firebaseApi } = await import('@/services/firebaseApi');
      const result = await firebaseApi.login(email, password);
      if (result.user) {
        setUser(result.user);
        localStorage.setItem('user', JSON.stringify(result.user));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const { firebaseApi } = await import('@/services/firebaseApi');
      const result = await firebaseApi.register(email, password);
      if (result.user) {
        setUser(result.user);
        localStorage.setItem('user', JSON.stringify(result.user));
        return { success: true };
      }
      return { success: false, error: 'Registration failed' };
    } catch (error: any) {
      console.error('Register error:', error);
      let errorMessage = 'Registration failed';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Email is already registered. Try signing in instead.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Use at least 6 characters.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address format.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateUserXP = (xpGain: number) => {
    if (!user) return;
    
    const { calculateLevelInfo } = require('@/utils/levelSystem');
    const newXP = (user.xp || 0) + xpGain;
    const levelInfo = calculateLevelInfo(newXP);
    
    const updatedUser = {
      ...user,
      xp: newXP,
      level: levelInfo.level
    };
    
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUserXP, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};