import React, { useState } from 'react';
import { Plus, Grid3X3, List, Camera, Upload, Sparkles, Zap, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';

export function AdaptiveDashboard() {
  const { isMobileView, isDesktopView } = useDeviceDetection();

  if (isMobileView) {
    return <MobileDashboard />;
  }

  return <DesktopDashboard />;
}

// 📱 МОБИЛЬНАЯ ВЕРСИЯ - быстрые действия, касания, свайпы
function MobileDashboard() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const quickActions = [
    {
      icon: Camera,
      title: 'Сканировать',
      description: 'Камера AR',
      color: 'bg-blue-500',
      action: 'scan'
    },
    {
      icon: Plus,
      title: 'Создать',
      description: 'Новый проект',
      color: 'bg-green-500',
      action: 'create'
    },
    {
      icon: Upload,
      title: 'Загрузить',
      description: 'Фото комнаты',
      color: 'bg-purple-500',
      action: 'upload'
    },
    {
      icon: Sparkles,
      title: 'AI Дизайн',
      description: 'Автоматом',
      color: 'bg-orange-500',
      action: 'ai'
    }
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Приветствие */}
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">
          Привет! 👋
        </h1>
        <p className="text-muted-foreground">
          Создавайте дизайн одним касанием
        </p>
      </div>

      {/* Быстрые действия - большие кнопки для пальцев */}
      <div className="grid grid-cols-2 gap-4">
        {quickActions.map((action) => (
          <Card 
            key={action.action} 
            className="cursor-pointer hover:shadow-lg transition-all active:scale-95"
          >
            <CardContent className="p-6 text-center">
              <div className={`w-12 h-12 ${action.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                <action.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-sm mb-1">{action.title}</h3>
              <p className="text-xs text-muted-foreground">{action.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Недавние проекты */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Мои проекты</h2>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Проекты в сетке - оптимизировано для мобильных */}
        <div className={viewMode === 'grid' ? 'grid grid-cols-2 gap-3' : 'space-y-3'}>
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="cursor-pointer hover:shadow-md transition-shadow">
              <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg">🏠</span>
                </div>
              </div>
              <CardContent className="p-3">
                <h3 className="font-medium text-sm mb-1">Проект {i}</h3>
                <p className="text-xs text-muted-foreground">Обновлен сегодня</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Мобильная панель AI помощника */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-4 text-center">
          <Smartphone className="h-8 w-8 mx-auto mb-2 text-blue-600" />
          <h3 className="font-semibold text-sm mb-2">AI на мобильном</h3>
          <p className="text-xs text-muted-foreground mb-3">
            Голосовые команды, AR предпросмотр
          </p>
          <Button size="sm" className="w-full">
            <Zap className="h-4 w-4 mr-2" />
            Попробовать AI
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// 💻 ДЕСКТОПНАЯ ВЕРСИЯ - полная функциональность, множественные окна
function DesktopDashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Заголовок с аналитикой */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Дашборд проектов</h1>
          <p className="text-muted-foreground">
            Управляйте своими дизайн-проектами и командой
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Импорт
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Новый проект
          </Button>
        </div>
      </div>

      {/* Статистики - только на десктопе */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего проектов</CardTitle>
            <Grid3X3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+2 за эту неделю</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Активные</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">В работе</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Генераций</CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">За месяц</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Команда</CardTitle>
            <Camera className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Участников</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Основная область - проекты */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Недавние проекты</CardTitle>
              <CardDescription>
                Ваши последние дизайн-проекты и их статус
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Квартира-студия 45м²', status: 'В работе', progress: 75 },
                  { name: 'Офис стартапа', status: 'Ревизия', progress: 90 },
                  { name: 'Загородный дом', status: 'Планирование', progress: 25 },
                  { name: 'Кафе в центре', status: 'Завершен', progress: 100 }
                ].map((project, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                        🏠
                      </div>
                      <div>
                        <h4 className="font-medium">{project.name}</h4>
                        <p className="text-sm text-muted-foreground">{project.status}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{project.progress}%</p>
                      <div className="w-16 h-2 bg-muted rounded-full">
                        <div 
                          className="h-full bg-primary rounded-full" 
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Боковая панель - инструменты */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">AI Помощник</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Sparkles className="h-4 w-4 mr-2" />
                Генерация дизайна
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Camera className="h-4 w-4 mr-2" />
                Анализ пространства
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Zap className="h-4 w-4 mr-2" />
                Оптимизация
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Быстрые действия</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Создать проект
              </Button>
              <Button className="w-full" variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Загрузить файлы
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}