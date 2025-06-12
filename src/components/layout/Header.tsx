import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Moon, 
  Sun, 
  User, 
  LogOut, 
  Settings,
  Home,
  Palette,
  Bot,
  FolderOpen,
  Sparkles,
  CreditCard,
  Shield,
  DollarSign
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Главная', href: '/', icon: Home },
    { name: 'Проекты', href: '/dashboard', icon: FolderOpen, authRequired: true },
    { name: 'Редактор', href: '/editor', icon: Sparkles, authRequired: true },
    { name: 'Материалы', href: '/materials', icon: Palette },
    { name: 'AI Помощник', href: '/ai-assistant', icon: Bot, authRequired: true },
    { name: 'Тарифы', href: '/pricing', icon: DollarSign },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const visibleNavItems = navItems.filter(item => 
    !item.authRequired || isAuthenticated
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Логотип */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-orange-400 to-red-500 rounded-full"></div>
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              CraftRuv
            </span>
          </Link>

          {/* Навигация для десктопа */}
          <nav className="hidden md:flex items-center space-x-1">
            {visibleNavItems.map((item) => {
              const isActive = location.pathname === item.href ||
                (item.href !== '/' && location.pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors
                    ${isActive 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }
                  `}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Кнопки справа */}
          <div className="flex items-center space-x-2">
            {/* Переключатель темы */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="w-9 h-9 p-0"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>

            {/* Аутентификация */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                      <User className="w-3 h-3 text-white" />
                    </div>
                    <span className="hidden sm:inline text-sm">{user?.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                    <FolderOpen className="w-4 h-4 mr-2" />
                    Мои проекты
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/billing')}>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Подписка и оплата
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="w-4 h-4 mr-2" />
                    Настройки
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate('/admin')}>
                        <Shield className="w-4 h-4 mr-2" />
                        Админ-панель
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Выйти
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={() => navigate('/auth')}
                size="sm"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                Войти
              </Button>
            )}

            {/* Мобильное меню */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden w-9 h-9 p-0"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Мобильная навигация */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-1">
              {visibleNavItems.map((item) => {
                const isActive = location.pathname === item.href ||
                  (item.href !== '/' && location.pathname.startsWith(item.href));
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`
                      flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors
                      ${isActive 
                        ? 'bg-primary text-primary-foreground' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                      }
                    `}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              
              {!isAuthenticated && (
                <Button
                  onClick={() => {
                    navigate('/auth');
                    setMobileMenuOpen(false);
                  }}
                  className="mt-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  Войти в систему
                </Button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
