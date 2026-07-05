import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import type { User, LoginRequest, RegisterRequest } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('nexevent_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        localStorage.removeItem('nexevent_token');
        localStorage.removeItem('nexevent_user');
      }
    }
    return null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('nexevent_token');
  });
  const isLoading = false;

  const login = useCallback(async (data: LoginRequest) => {
    const response = await authService.login(data);
    const userData: User = {
      username: response.username,
      email: response.email,
      fullName: response.fullName,
      role: response.role as User['role'],
    };
    setToken(response.token);
    setUser(userData);
    localStorage.setItem('nexevent_token', response.token);
    localStorage.setItem('nexevent_user', JSON.stringify(userData));
  }, []);

  const register = useCallback(async (data: RegisterRequest) => {
    const response = await authService.register(data);
    const userData: User = {
      username: response.username,
      email: response.email,
      fullName: response.fullName,
      role: response.role as User['role'],
    };
    setToken(response.token);
    setUser(userData);
    localStorage.setItem('nexevent_token', response.token);
    localStorage.setItem('nexevent_user', JSON.stringify(userData));
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated: !!token, isLoading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de un AuthProvider');
  return context;
};
