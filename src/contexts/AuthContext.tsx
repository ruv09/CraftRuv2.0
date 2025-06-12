import React, { createContext, useContext, useEffect, useState } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'user' | 'admin';
  createdAt: string;
  subscription: {
    plan: 'free' | 'basic' | 'pro' | 'enterprise';
    status: 'active' | 'inactive' | 'trial' | 'expired';
    startDate: string;
    endDate: string;
    trialEndsAt?: string;
  };
  projects: {
    count: number;
    limit: number;
  };
  usage: {
    storageUsed: number;
    storageLimit: number;
    aiRequestsUsed: number;
    aiRequestsLimit: number;
  };
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  updateSubscription: (subscription: User['subscription']) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth должен использоваться внутри AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Проверка сохраненной сессии при загрузке
    const savedUser = localStorage.getItem('craftruv_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Ошибка загрузки данных пользователя:', error);
        localStorage.removeItem('craftruv_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      // Симуляция API вызова
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Проверка админ-аккаунта
      if (email === 'admin@craftruv.ru' && password === 'admin123') {
        const adminUser: User = {
          id: 'admin-user',
          email: 'admin@craftruv.ru',
          name: 'Администратор',
          avatar: '',
          role: 'admin',
          createdAt: new Date().toISOString(),
          subscription: {
            plan: 'enterprise',
            status: 'active',
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
          },
          projects: {
            count: 0,
            limit: -1 // unlimited
          },
          usage: {
            storageUsed: 0,
            storageLimit: -1, // unlimited
            aiRequestsUsed: 0,
            aiRequestsLimit: -1 // unlimited
          }
        };
        setUser(adminUser);
        localStorage.setItem('craftruv_user', JSON.stringify(adminUser));
        return;
      }

      // Проверка демо-аккаунта
      if (email === 'demo@craftruv.ru' && password === 'demo123') {
        const demoUser: User = {
          id: 'demo-user',
          email: 'demo@craftruv.ru',
          name: 'Демо Пользователь',
          avatar: '',
          role: 'user',
          createdAt: new Date().toISOString(),
          subscription: {
            plan: 'pro',
            status: 'active',
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          },
          projects: {
            count: 5,
            limit: -1 // unlimited for pro
          },
          usage: {
            storageUsed: 1024, // 1GB used
            storageLimit: 100 * 1024, // 100GB limit
            aiRequestsUsed: 150,
            aiRequestsLimit: 1000
          }
        };
        setUser(demoUser);
        localStorage.setItem('craftruv_user', JSON.stringify(demoUser));
        return;
      }

      // Проверка существующих пользователей в localStorage
      const users = JSON.parse(localStorage.getItem('craftruv_users') || '[]');
      const existingUser = users.find((u: any) => u.email === email && u.password === password);
      
      if (existingUser) {
        const { password: _, ...userWithoutPassword } = existingUser;
        setUser(userWithoutPassword);
        localStorage.setItem('craftruv_user', JSON.stringify(userWithoutPassword));
      } else {
        throw new Error('Неверный email или пароль');
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string): Promise<void> => {
    setIsLoading(true);
    try {
      // Симуляция API вызова
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Проверка существующих пользователей
      const users = JSON.parse(localStorage.getItem('craftruv_users') || '[]');
      const existingUser = users.find((u: any) => u.email === email);
      
      if (existingUser) {
        throw new Error('Пользователь с таким email уже существует');
      }

      const trialEndDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      const newUser: User = {
        id: crypto.randomUUID(),
        email,
        name,
        avatar: '',
        role: 'user',
        createdAt: new Date().toISOString(),
        subscription: {
          plan: 'free',
          status: 'trial',
          startDate: new Date().toISOString(),
          endDate: trialEndDate.toISOString(),
          trialEndsAt: trialEndDate.toISOString()
        },
        projects: {
          count: 0,
          limit: 3 // free plan limit
        },
        usage: {
          storageUsed: 0,
          storageLimit: 1024, // 1GB for free
          aiRequestsUsed: 0,
          aiRequestsLimit: 0 // no AI for free
        }
      };

      // Сохранение пользователя с паролем в список всех пользователей
      const userWithPassword = { ...newUser, password };
      users.push(userWithPassword);
      localStorage.setItem('craftruv_users', JSON.stringify(users));

      // Установка текущего пользователя без пароля
      setUser(newUser);
      localStorage.setItem('craftruv_user', JSON.stringify(newUser));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('craftruv_user');
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('craftruv_user', JSON.stringify(updatedUser));

    // Обновление в списке всех пользователей
    const users = JSON.parse(localStorage.getItem('craftruv_users') || '[]');
    const userIndex = users.findIndex((u: any) => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updates };
      localStorage.setItem('craftruv_users', JSON.stringify(users));
    }
  };

  const updateSubscription = (subscription: User['subscription']) => {
    if (!user) return;
    
    const updatedUser = { ...user, subscription };
    setUser(updatedUser);
    localStorage.setItem('craftruv_user', JSON.stringify(updatedUser));

    // Обновление в списке всех пользователей
    const users = JSON.parse(localStorage.getItem('craftruv_users') || '[]');
    const userIndex = users.findIndex((u: any) => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], subscription };
      localStorage.setItem('craftruv_users', JSON.stringify(users));
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: !!user && user.role === 'admin',
    login,
    register,
    logout,
    updateProfile,
    updateSubscription,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
