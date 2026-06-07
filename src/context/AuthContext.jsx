import { createContext, useContext, useState, useCallback } from 'react';
import equipeService from '../services/equipeService';

const AuthContext = createContext(null);

const loadStoredUser = () => {
  try {
    const raw = localStorage.getItem('claramed_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(loadStoredUser);
  const [erro, setErro] = useState('');

  const login = useCallback(async (email, senha) => {
    setErro('');
    try {
      const { user } = await equipeService.login({ email, senha });
      setUsuario(user);
      localStorage.setItem('claramed_user', JSON.stringify(user));
      return true;
    } catch (error) {
      setErro(error.message || 'E-mail ou senha inválidos.');
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setUsuario(null);
    setErro('');
    localStorage.removeItem('claramed_token');
    localStorage.removeItem('claramed_user');
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, login, logout, erro }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}
