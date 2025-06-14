import React from 'react';
import { Menu, Search, User, Bell, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ViewModeSwitcher } from '@/components/ViewModeSwitcher';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';

interface AdaptiveHeaderProps {
  onMenuToggle?: () => void;
  onSearchToggle?: () => void;
}

export function AdaptiveHeader({ onMenuToggle, onSearchToggle }: AdaptiveHeaderProps) {
  const { isMobileView, isDesktopView } = useDeviceDetection();

  if (isMobileView) {
    return <MobileHeader onMenuToggle={onMenuToggle} onSearchToggle={onSearchToggle} />;
  }

  return <DesktopHeader />;
}

// 📱 МОБИЛЬНАЯ ВЕРСИЯ - упрощенная, компактная
function MobileHeader({ onMenuToggle, onSearchToggle }: AdaptiveHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        {/* Меню бургер */}
        <Button
          variant="ghost"
          size="sm"
          className="mr-2 px-2"
          onClick={onMenuToggle}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Меню</span>
        </Button>

        {/* Логотип */}
        <div className="mr-4">
          <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            CraftRuv
          </h1>
        </div>

        {/* Центральная область - поиск на мобильном скрыт */}
        <div className="flex-1" />

        {/* Мобильные действия */}
        <div className="flex items-center gap-1">
          {/* Поиск */}
          <Button
            variant="ghost"
            size="sm"
            className="px-2"
            onClick={onSearchToggle}
          >
            <Search className="h-4 w-4" />
          </Button>

          {/* Уведомления */}
          <Button
            variant="ghost"
            size="sm"
            className="px-2 relative"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
              3
            </span>
          </Button>

          {/* Переключатель версий */}
          <ViewModeSwitcher />
        </div>
      </div>
    </header>
  );
}

// 💻 ДЕСКТОПНАЯ ВЕРСИЯ - полная функциональность
function DesktopHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Логотип и навигация */}
        <div className="mr-6 flex items-center space-x-6">
          <div className="flex items-center">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              CraftRuv Web
            </h1>
            <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
              Pro
            </span>
          </div>

          {/* Основная навигация */}
          <nav className="hidden lg:flex items-center space-x-6 text-sm font-medium">
            <a href="/dashboard" className="transition-colors hover:text-primary">
              Дашборд
            </a>
            <a href="/editor" className="transition-colors hover:text-primary">
              Редактор
            </a>
            <a href="/materials" className="transition-colors hover:text-primary">
              Материалы
            </a>
            <a href="/ai-assistant" className="transition-colors hover:text-primary">
              AI Помощник
            </a>
          </nav>
        </div>

        {/* Центральная область - поиск */}
        <div className="flex-1 max-w-md mx-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Поиск проектов, материалов, шаблонов..."
              className="pl-10 bg-muted/50"
            />
          </div>
        </div>

        {/* Правая область - действия */}
        <div className="flex items-center space-x-4">
          {/* Уведомления */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
              3
            </span>
            <span className="ml-2 hidden xl:inline">Уведомления</span>
          </Button>

          {/* Настройки */}
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
            <span className="ml-2 hidden xl:inline">Настройки</span>
          </Button>

          {/* Переключатель версий */}
          <ViewModeSwitcher />

          {/* Профиль */}
          <Button variant="ghost" size="sm" className="gap-2">
            <User className="h-4 w-4" />
            <span className="hidden md:inline">Профиль</span>
          </Button>
        </div>
      </div>
    </header>
  );
}