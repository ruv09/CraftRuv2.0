export interface SubscriptionPlan {
  id: string;
  name: string;
  displayName: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  limits: PlanLimits;
  popular?: boolean;
  color: string;
  stripePriceId: {
    monthly: string;
    yearly: string;
  };
}

export interface PlanLimits {
  projects: number; // Количество проектов
  aiGenerations: number; // AI генераций в месяц
  storageGB: number; // Хранилище в GB
  teamMembers: number; // Участников команды
  renderResolution: '720p' | '1080p' | '4k';
  supportLevel: 'community' | 'email' | 'priority' | 'dedicated';
  advancedFeatures: {
    arScanning: boolean;
    voiceCommands: boolean;
    apiAccess: boolean;
    whiteLabel: boolean;
    customBranding: boolean;
    analytics: boolean;
  };
}

export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  status: SubscriptionStatus;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  paymentProvider: 'stripe' | 'paypal' | 'yookassa';
  providerSubscriptionId: string;
  providerCustomerId: string;
  trialEnd?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type SubscriptionStatus = 
  | 'active' 
  | 'trialing' 
  | 'past_due' 
  | 'canceled' 
  | 'unpaid' 
  | 'incomplete'
  | 'incomplete_expired';

export interface BillingHistory {
  id: string;
  userId: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'failed' | 'pending';
  invoiceId: string;
  paymentDate: Date;
  description: string;
}

// Конфигурация тарифных планов
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'free',
    displayName: 'Бесплатный',
    description: 'Для знакомства с платформой',
    monthlyPrice: 0,
    yearlyPrice: 0,
    color: 'gray',
    features: [
      '3 проекта',
      '10 AI генераций в месяц',
      'Базовые материалы',
      'Экспорт в HD',
      'Сообщество поддержки'
    ],
    limits: {
      projects: 3,
      aiGenerations: 10,
      storageGB: 1,
      teamMembers: 1,
      renderResolution: '720p',
      supportLevel: 'community',
      advancedFeatures: {
        arScanning: false,
        voiceCommands: false,
        apiAccess: false,
        whiteLabel: false,
        customBranding: false,
        analytics: false
      }
    },
    stripePriceId: {
      monthly: '',
      yearly: ''
    }
  },
  {
    id: 'pro',
    name: 'pro',
    displayName: 'Профессиональный',
    description: 'Для дизайнеров и малого бизнеса',
    monthlyPrice: 29,
    yearlyPrice: 290, // 2 месяца бесплатно
    color: 'blue',
    popular: true,
    features: [
      'Безлимит проектов',
      '500 AI генераций в месяц',
      'Премиум материалы',
      'AR сканирование',
      'Экспорт в Full HD',
      'Голосовые команды',
      'Email поддержка',
      '50 GB хранилища'
    ],
    limits: {
      projects: -1, // Безлимит
      aiGenerations: 500,
      storageGB: 50,
      teamMembers: 5,
      renderResolution: '1080p',
      supportLevel: 'email',
      advancedFeatures: {
        arScanning: true,
        voiceCommands: true,
        apiAccess: false,
        whiteLabel: false,
        customBranding: false,
        analytics: true
      }
    },
    stripePriceId: {
      monthly: 'price_pro_monthly',
      yearly: 'price_pro_yearly'
    }
  },
  {
    id: 'business',
    name: 'business',
    displayName: 'Бизнес',
    description: 'Для команд и студий',
    monthlyPrice: 99,
    yearlyPrice: 990,
    color: 'purple',
    features: [
      'Все из Pro +',
      '2000 AI генераций в месяц',
      'Командная работа',
      'API доступ',
      'Экспорт в 4K',
      'Приоритетная поддержка',
      '200 GB хранилища',
      'Аналитика проектов'
    ],
    limits: {
      projects: -1,
      aiGenerations: 2000,
      storageGB: 200,
      teamMembers: 25,
      renderResolution: '4k',
      supportLevel: 'priority',
      advancedFeatures: {
        arScanning: true,
        voiceCommands: true,
        apiAccess: true,
        whiteLabel: false,
        customBranding: true,
        analytics: true
      }
    },
    stripePriceId: {
      monthly: 'price_business_monthly',
      yearly: 'price_business_yearly'
    }
  },
  {
    id: 'enterprise',
    name: 'enterprise',
    displayName: 'Корпоративный',
    description: 'Для крупных компаний',
    monthlyPrice: 299,
    yearlyPrice: 2990,
    color: 'gold',
    features: [
      'Все из Бизнес +',
      'Безлимит AI генераций',
      'White-label решение',
      'Персональный менеджер',
      'Безлимит хранилища',
      'SLA 99.9%',
      'Кастомная интеграция',
      'Обучение команды'
    ],
    limits: {
      projects: -1,
      aiGenerations: -1,
      storageGB: -1,
      teamMembers: -1,
      renderResolution: '4k',
      supportLevel: 'dedicated',
      advancedFeatures: {
        arScanning: true,
        voiceCommands: true,
        apiAccess: true,
        whiteLabel: true,
        customBranding: true,
        analytics: true
      }
    },
    stripePriceId: {
      monthly: 'price_enterprise_monthly',
      yearly: 'price_enterprise_yearly'
    }
  }
];

// Утилиты для работы с подписками
export function getPlanById(planId: string): SubscriptionPlan | undefined {
  return SUBSCRIPTION_PLANS.find(plan => plan.id === planId);
}

export function canAccessFeature(
  subscription: UserSubscription | null, 
  feature: keyof PlanLimits['advancedFeatures']
): boolean {
  if (!subscription || subscription.status !== 'active') {
    const freePlan = getPlanById('free');
    return freePlan?.limits.advancedFeatures[feature] || false;
  }
  
  const plan = getPlanById(subscription.planId);
  return plan?.limits.advancedFeatures[feature] || false;
}

export function getRemainingUsage(
  subscription: UserSubscription | null,
  currentUsage: {
    projects: number;
    aiGenerations: number;
    storageGB: number;
  }
) {
  const plan = subscription ? getPlanById(subscription.planId) : getPlanById('free');
  if (!plan) return null;

  return {
    projects: plan.limits.projects === -1 ? -1 : Math.max(0, plan.limits.projects - currentUsage.projects),
    aiGenerations: plan.limits.aiGenerations === -1 ? -1 : Math.max(0, plan.limits.aiGenerations - currentUsage.aiGenerations),
    storageGB: plan.limits.storageGB === -1 ? -1 : Math.max(0, plan.limits.storageGB - currentUsage.storageGB)
  };
}