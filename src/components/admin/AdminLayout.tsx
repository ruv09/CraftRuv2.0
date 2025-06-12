import React from 'react';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Package, 
  Image, 
  Users, 
  CreditCard, 
  Settings,
  LogOut,
  Home
} from 'lucide-react';

const AdminLayout: React.FC = () => {
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();

  if (!user || !isAdmin) {
    return <Navigate to="/auth" replace />;
  }

  const navigation = [
    { name: 'Дашборд', href: '/admin', icon: LayoutDashboard },
    { name: 'Материалы', href: '/admin/materials', icon: Image },
    { name: 'Мебель', href: '/admin/furniture', icon: Package },
    { name: 'Пользователи', href: '/admin/users', icon: Users },
    { name: 'Подписки', href: '/admin/subscriptions', icon: CreditCard },
    { name: 'Настройки', href: '/admin/settings', icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="flex flex-col w-64 bg-white shadow-lg">
        <div className="flex items-center justify-center h-16 bg-purple-600 text-white">
          <h1 className="text-xl font-bold">CraftRuv Admin</h1>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                  isActive(item.href)
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                )}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <Link to="/">
            <Button variant="outline" className="w-full mb-2" size="sm">
              <Home className="mr-2 h-4 w-4" />
              Вернуться на сайт
            </Button>
          </Link>
          <Button 
            variant="outline" 
            className="w-full" 
            size="sm"
            onClick={logout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Выйти
          </Button>
        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {user.name.charAt(0)}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500">Администратор</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Панель администратора
            </h2>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
