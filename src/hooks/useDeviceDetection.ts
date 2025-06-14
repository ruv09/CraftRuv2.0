import { useState, useEffect } from 'react';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';
export type ViewMode = 'auto' | 'mobile' | 'desktop';

interface DeviceInfo {
  type: DeviceType;
  isTouchDevice: boolean;
  screenWidth: number;
  screenHeight: number;
  userAgent: string;
}

export function useDeviceDetection() {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    type: 'desktop',
    isTouchDevice: false,
    screenWidth: 1920,
    screenHeight: 1080,
    userAgent: ''
  });

  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    // Проверяем сохраненные настройки пользователя
    const saved = localStorage.getItem('craftruv-view-mode');
    return (saved as ViewMode) || 'auto';
  });

  useEffect(() => {
    const detectDevice = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const userAgent = navigator.userAgent;
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

      let type: DeviceType = 'desktop';
      
      // Определяем тип устройства по размеру экрана
      if (width <= 768) {
        type = 'mobile';
      } else if (width <= 1024) {
        type = 'tablet';
      } else {
        type = 'desktop';
      }

      // Дополнительная проверка по User Agent
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      if (mobileRegex.test(userAgent)) {
        type = width <= 1024 ? 'mobile' : 'tablet';
      }

      setDeviceInfo({
        type,
        isTouchDevice,
        screenWidth: width,
        screenHeight: height,
        userAgent
      });
    };

    detectDevice();
    window.addEventListener('resize', detectDevice);
    
    return () => window.removeEventListener('resize', detectDevice);
  }, []);

  // Сохраняем выбор пользователя
  useEffect(() => {
    localStorage.setItem('craftruv-view-mode', viewMode);
  }, [viewMode]);

  // Определяем активную версию интерфейса
  const getActiveView = (): 'mobile' | 'desktop' => {
    if (viewMode === 'mobile') return 'mobile';
    if (viewMode === 'desktop') return 'desktop';
    
    // Автоматический режим
    return deviceInfo.type === 'desktop' ? 'desktop' : 'mobile';
  };

  const activeView = getActiveView();

  return {
    deviceInfo,
    viewMode,
    activeView,
    setViewMode,
    isMobileView: activeView === 'mobile',
    isDesktopView: activeView === 'desktop',
    canSwitchViews: true // Всегда позволяем переключение
  };
}