import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Package, Image, CreditCard, TrendingUp, Activity } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  // Mock data - в реальном приложении это будет из API
  const stats = {
    totalUsers: 1247,
    activeSubscriptions: 892,
    totalMaterials: 456,
    totalFurniture: 234,
    monthlyRevenue: 23450,
    newUsersThisMonth: 156
  };

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    description: string;
    icon: React.ReactNode;
    trend?: string;
  }> = ({ title, value, description, icon, trend }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">
          {trend && <span className="text-green-600">{trend}</span>} {description}
        </p>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Панель администратора</h2>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Всего пользователей"
          value={stats.totalUsers.toLocaleString()}
          description="с прошлого месяца"
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          trend="+12%"
        />
        
        <StatCard
          title="Активные подписки"
          value={stats.activeSubscriptions.toLocaleString()}
          description="пользователей с подпиской"
          icon={<CreditCard className="h-4 w-4 text-muted-foreground" />}
          trend="+8%"
        />
        
        <StatCard
          title="Материалы"
          value={stats.totalMaterials.toLocaleString()}
          description="доступных материалов"
          icon={<Image className="h-4 w-4 text-muted-foreground" />}
        />
        
        <StatCard
          title="Мебель"
          value={stats.totalFurniture.toLocaleString()}
          description="3D модели мебели"
          icon={<Package className="h-4 w-4 text-muted-foreground" />}
        />
        
        <StatCard
          title="Месячный доход"
          value={`$${stats.monthlyRevenue.toLocaleString()}`}
          description="в этом месяце"
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
          trend="+15%"
        />
        
        <StatCard
          title="Новые пользователи"
          value={stats.newUsersThisMonth.toLocaleString()}
          description="за этот месяц"
          icon={<Activity className="h-4 w-4 text-muted-foreground" />}
          trend="+23%"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Обзор доходов</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              График доходов (интеграция с charts)
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Последние активности</CardTitle>
            <CardDescription>Недавние действия пользователей</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Новый пользователь зарегистрировался
                  </p>
                  <p className="text-sm text-muted-foreground">
                    2 минуты назад
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Обновлена подписка на Pro
                  </p>
                  <p className="text-sm text-muted-foreground">
                    5 минут назад
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Добавлен новый материал
                  </p>
                  <p className="text-sm text-muted-foreground">
                    10 минут назад
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
