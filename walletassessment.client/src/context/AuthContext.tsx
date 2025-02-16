import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface User {
  id: string;
  email: string;
    name?: string;
}

interface RegisterFormValues {
  email: string;
  password: string;
  confirmPassword: string;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  register: (values: RegisterFormValues) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  login: async () => {},
  logout: () => {},
  register: async () => {}  
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
        try {
            //console.log('Checking authentication...');
            const refreshToken = localStorage.getItem('refreshToken');
            //console.log('Stored token:', refreshToken?.toString());
            
            if (refreshToken) {
              const response = await api.post('/refresh-token/', { refreshToken });
              //console.log('Current user response:', response);
              setUser(response.data);
              navigate('/profile');
            }
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);
  

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const response = await api.post('/login', credentials);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      setUser(response.data.user);
      navigate('/Dashboard');
      //console.log('User:', localStorage.getItem('refreshToken'));
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  const logout = () => {
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  const register = async (values: RegisterFormValues) => {
    try {
      const response = await api.post('/register', values);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      setUser(response.data.user);
      navigate('/');
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);