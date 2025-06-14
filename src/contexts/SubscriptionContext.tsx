import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserSubscription, SubscriptionPlan, getPlanById, canAccessFeature, getRemainingUsage, SUBSCRIPTION_PLANS } from '@/types/subscription';

interface SubscriptionContextType {
  subscription: UserSubscription | null;
  currentPlan: SubscriptionPlan;
  usage: {
    projects: number;
    aiGenerations: number;
    storageGB: number;
  };
  remaining: {
    projects: number;
    aiGenerations: number;
    storageGB: number;
  } | null;
  isLoading: boolean;
  canAccess: (feature: keyof SubscriptionPlan['limits']['advancedFeatures']) => boolean;
  upgradeRequired: (feature: keyof SubscriptionPlan['limits']['advancedFeatures']) => boolean;
  createCheckoutSession: (planId: string, billingCycle: 'monthly' | 'yearly') => Promise<string>;
  cancelSubscription: () => Promise<void>;
  resumeSubscription: () => Promise<void>;
  updateUsage: (type: 'projects' | 'aiGenerations' | 'storageGB', amount: number) => void;
  refreshSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

interface SubscriptionProviderProps {
  children: ReactNode;
  userId?: string;
}

export function SubscriptionProvider({ children, userId }: SubscriptionProviderProps) {
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [usage, setUsage] = useState({
    projects: 0,
    aiGenerations: 0,
    storageGB: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  // Получаем текущий план (бесплатный если нет подписки)
  const currentPlan = subscription ? 
    getPlanById(subscription.planId) || SUBSCRIPTION_PLANS[0] : 
    SUBSCRIPTION_PLANS[0]; // Бесплатный план

  // Оставшееся использование
  const remaining = getRemainingUsage(subscription, usage);

  // Проверка доступа к функции
  const canAccess = (feature: keyof SubscriptionPlan['limits']['advancedFeatures']) => {
    return canAccessFeature(subscription, feature);
  };

  // Проверка, нужна ли подписка для функции
  const upgradeRequired = (feature: keyof SubscriptionPlan['limits']['advancedFeatures']) => {
    return !canAccess(feature);
  };

  // Загрузка данных подписки
  const loadSubscription = async () => {
    if (!userId) {
      setSubscription(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      // TODO: Заменить на реальный API вызов
      const response = await fetch(`/api/subscriptions/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSubscription(data.subscription);
        setUsage(data.usage);
      } else {
        setSubscription(null);
      }
    } catch (error) {
      console.error('Failed to load subscription:', error);
      setSubscription(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Создание сессии оплаты Stripe
  const createCheckoutSession = async (planId: string, billingCycle: 'monthly' | 'yearly'): Promise<string> => {
    if (!userId) throw new Error('User not authenticated');

    const response = await fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      },
      body: JSON.stringify({
        planId,
        billingCycle,
        userId,
        successUrl: `${window.location.origin}/subscription/success`,
        cancelUrl: `${window.location.origin}/pricing`
      })
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    const { checkoutUrl } = await response.json();
    return checkoutUrl;
  };

  // Отмена подписки
  const cancelSubscription = async () => {
    if (!subscription || !userId) return;

    const response = await fetch(`/api/subscriptions/${subscription.id}/cancel`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      }
    });

    if (response.ok) {
      await refreshSubscription();
    } else {
      throw new Error('Failed to cancel subscription');
    }
  };

  // Возобновление подписки
  const resumeSubscription = async () => {
    if (!subscription || !userId) return;

    const response = await fetch(`/api/subscriptions/${subscription.id}/resume`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      }
    });

    if (response.ok) {
      await refreshSubscription();
    } else {
      throw new Error('Failed to resume subscription');
    }
  };

  // Обновление использования
  const updateUsage = (type: 'projects' | 'aiGenerations' | 'storageGB', amount: number) => {
    setUsage(prev => ({
      ...prev,
      [type]: prev[type] + amount
    }));

    // Синхронизация с сервером в фоне
    if (userId) {
      fetch('/api/usage/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({ type, amount })
      }).catch(console.error);
    }
  };

  // Обновление данных подписки
  const refreshSubscription = async () => {
    await loadSubscription();
  };

  useEffect(() => {
    loadSubscription();
  }, [userId]);

  // Проверка статуса подписки каждые 5 минут
  useEffect(() => {
    if (!userId) return;

    const interval = setInterval(() => {
      loadSubscription();
    }, 5 * 60 * 1000); // 5 минут

    return () => clearInterval(interval);
  }, [userId]);

  const value: SubscriptionContextType = {
    subscription,
    currentPlan,
    usage,
    remaining,
    isLoading,
    canAccess,
    upgradeRequired,
    createCheckoutSession,
    cancelSubscription,
    resumeSubscription,
    updateUsage,
    refreshSubscription
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}

// Хук для проверки лимитов
export function useUsageLimits() {
  const { currentPlan, usage, remaining } = useSubscription();

  const checkLimit = (type: 'projects' | 'aiGenerations' | 'storageGB'): {
    canUse: boolean;
    remaining: number;
    isUnlimited: boolean;
    percentUsed: number;
  } => {
    const limit = currentPlan.limits[type];
    const used = usage[type];
    const isUnlimited = limit === -1;
    
    if (isUnlimited) {
      return {
        canUse: true,
        remaining: -1,
        isUnlimited: true,
        percentUsed: 0
      };
    }

    const remainingAmount = Math.max(0, limit - used);
    const percentUsed = (used / limit) * 100;

    return {
      canUse: remainingAmount > 0,
      remaining: remainingAmount,
      isUnlimited: false,
      percentUsed: Math.min(100, percentUsed)
    };
  };

  return {
    projects: checkLimit('projects'),
    aiGenerations: checkLimit('aiGenerations'),
    storageGB: checkLimit('storageGB')
  };
}