import React from 'react';
import { Monitor, Smartphone, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDeviceDetection, ViewMode } from '@/hooks/useDeviceDetection';

export function ViewModeSwitcher() {
  const { viewMode, setViewMode, activeView, deviceInfo } = useDeviceDetection();

  const viewModes: { value: ViewMode; label: string; icon: React.ReactNode; description: string }[] = [
    {
      value: 'auto',
      label: 'Авто',
      icon: <Settings className="h-4 w-4" />,
      description: 'Автоматический выбор по устройству'
    },
    {
      value: 'desktop',
      label: 'Компьютер',
      icon: <Monitor className="h-4 w-4" />,
      description: 'Полная версия для больших экранов'
    },
    {
      value: 'mobile',
      label: 'Мобильная',
      icon: <Smartphone className="h-4 w-4" />,
      description: 'Упрощенная версия для мобильных'
    }
  ];

  const currentMode = viewModes.find(mode => mode.value === viewMode);

  return (
    <div className="flex items-center gap-2">
      {/* Показываем текущий активный режим */}
      <div className="hidden sm:flex items-center gap-1 text-sm text-muted-foreground">
        {activeView === 'mobile' ? <Smartphone className="h-3 w-3" /> : <Monitor className="h-3 w-3" />}
        <span className="hidden md:inline">
          {activeView === 'mobile' ? 'Мобильная версия' : 'Десктопная версия'}
        </span>
      </div>

      {/* Переключатель */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            {currentMode?.icon}
            <span className="hidden sm:inline">{currentMode?.label}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {viewModes.map((mode) => (
            <DropdownMenuItem
              key={mode.value}
              onClick={() => setViewMode(mode.value)}
              className={`flex items-start gap-3 p-3 ${
                viewMode === mode.value ? 'bg-accent' : ''
              }`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {mode.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{mode.label}</span>
                  {viewMode === mode.value && (
                    <span className="text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded">
                      Активно
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {mode.description}
                </p>
              </div>
            </DropdownMenuItem>
          ))}
          
          {/* Информация об устройстве */}
          <div className="border-t mt-2 pt-2 px-3 pb-2">
            <p className="text-xs text-muted-foreground">
              Устройство: {deviceInfo.type} ({deviceInfo.screenWidth}×{deviceInfo.screenHeight})
            </p>
            {deviceInfo.isTouchDevice && (
              <p className="text-xs text-muted-foreground">
                Сенсорный экран
              </p>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}