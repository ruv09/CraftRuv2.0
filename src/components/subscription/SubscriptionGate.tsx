import React from 'react';
import { Lock, Crown, Sparkles, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { SUBSCRIPTION_PLANS, SubscriptionPlan } from '@/types/subscription';
import { useNavigate } from 'react-router-dom';

interface SubscriptionGateProps {
  children: React.ReactNode;
  feature?: keyof SubscriptionPlan['limits']['advancedFeatures'];
  minimumPlan?: 'pro' | 'business' | 'enterprise';
  fallback?: React.ReactNode;
  title?: string;
  description?: string;
  showUpgradeButton?: boolean;
}

export function SubscriptionGate({
  children,
  feature,
  minimumPlan = 'pro',
  fallback,
  title = 'Премиум функция',
  description = 'Эта функция доступна только подписчикам',
  showUpgradeButton = true
}: SubscriptionGateProps) {
  const { subscription, canAccess, currentPlan } = useSubscription();
  const navigate = useNavigate();

  // Проверяем доступ по функции
  const hasFeatureAccess = feature ? canAccess(feature) : true;
  
  // Проверяем доступ по минимальному плану
  const currentPlanIndex = SUBSCRIPTION_PLANS.findIndex(plan => plan.id === currentPlan.id);
  const minimumPlanIndex = SUBSCRIPTION_PLANS.findIndex(plan => plan.id === minimumPlan);
  const hasPlanAccess = currentPlanIndex >= minimumPlanIndex;
  
  // Есть доступ если выполняются оба условия
  const hasAccess = hasFeatureAccess && hasPlanAccess;

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return <UpgradePrompt 
    title={title} 
    description={description} 
    minimumPlan={minimumPlan}
    showUpgradeButton={showUpgradeButton}
  />;
}

// Компонент для блокировки функции с предложением апгрейда
export function UpgradePrompt({ 
  title, 
  description, 
  minimumPlan,
  showUpgradeButton = true
}: {
  title: string;
  description: string;
  minimumPlan: string;
  showUpgradeButton?: boolean;
}) {
  const navigate = useNavigate();
  const { currentPlan } = useSubscription();
  
  const recommendedPlan = SUBSCRIPTION_PLANS.find(plan => plan.id === minimumPlan);
  const upgradeOptions = SUBSCRIPTION_PLANS.filter(plan => 
    SUBSCRIPTION_PLANS.findIndex(p => p.id === plan.id) > 
    SUBSCRIPTION_PLANS.findIndex(p => p.id === currentPlan.id)
  );

  return (
    <Card className="border-dashed border-2 border-gray-300 bg-gray-50/50">
      <CardContent className="flex flex-col items-center text-center p-8">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Lock className="h-8 w-8 text-gray-400" />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6 max-w-md">{description}</p>
        
        {showUpgradeButton && (
          <div className="space-y-4 w-full max-w-sm">
            {recommendedPlan && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Crown className="h-4 w-4 mr-2" />
                    Обновить до {recommendedPlan.displayName}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      Обновите план для доступа
                    </DialogTitle>
                    <DialogDescription>
                      Получите доступ к этой функции и множеству других возможностей
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    {/* Текущий план */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-gray-900">Текущий план</p>
                          <p className="text-sm text-gray-600">{currentPlan.displayName}</p>
                        </div>
                        <Badge variant="outline">Активен</Badge>
                      </div>
                    </div>

                    {/* Рекомендуемый план */}
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-gray-900">{recommendedPlan.displayName}</h4>
                            <Badge className="bg-blue-100 text-blue-800">Рекомендуется</Badge>
                          </div>
                          <p className="text-sm text-gray-600">{recommendedPlan.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">
                            ${recommendedPlan.monthlyPrice}
                          </p>
                          <p className="text-sm text-gray-600">/месяц</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {recommendedPlan.features.slice(0, 4).map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <Check className="h-4 w-4 text-green-600" />
                            <span>{feature}</span>
                          </div>
                        ))}
                        {recommendedPlan.features.length > 4 && (
                          <p className="text-sm text-gray-500">
                            +{recommendedPlan.features.length - 4} дополнительных возможностей
                          </p>
                        )}
                      </div>
                      
                      <Button 
                        className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        onClick={() => navigate('/pricing')}
                      >
                        Обновить план
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>

                    {/* Другие варианты */}
                    {upgradeOptions.length > 1 && (
                      <div className="pt-2 border-t">
                        <p className="text-sm text-gray-600 mb-3">Или выберите другой план:</p>
                        <div className="space-y-2">
                          {upgradeOptions.filter(plan => plan.id !== recommendedPlan.id).map(plan => (
                            <div key={plan.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                              <div>
                                <p className="font-medium">{plan.displayName}</p>
                                <p className="text-sm text-gray-600">${plan.monthlyPrice}/мес</p>
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => navigate('/pricing')}
                              >
                                Выбрать
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            )}
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/pricing')}
            >
              Посмотреть все планы
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Хук для защиты операций
export function useFeatureAccess() {
  const { canAccess, upgradeRequired, updateUsage } = useSubscription();

  const checkAndConsumeUsage = (
    feature: keyof SubscriptionPlan['limits']['advancedFeatures'],
    usageType: 'projects' | 'aiGenerations' | 'storageGB',
    amount: number = 1
  ) => {
    if (upgradeRequired(feature)) {
      return {
        allowed: false,
        reason: 'upgrade_required',
        feature
      };
    }

    // TODO: Дополнительная проверка лимитов
    // Например, проверка количества оставшихся AI генераций

    updateUsage(usageType, amount);
    
    return {
      allowed: true,
      reason: 'success'
    };
  };

  return {
    canAccess,
    upgradeRequired,
    checkAndConsumeUsage
  };
}

// Компонент индикатора статуса подписки
export function SubscriptionStatus({ className }: { className?: string }) {
  const { subscription, currentPlan } = useSubscription();

  if (!subscription || currentPlan.id === 'free') {
    return (
      <Badge variant="secondary" className={className}>
        Бесплатный план
      </Badge>
    );
  }

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    trialing: 'bg-blue-100 text-blue-800',
    past_due: 'bg-yellow-100 text-yellow-800',
    canceled: 'bg-red-100 text-red-800'
  };

  return (
    <Badge 
      className={`${statusColors[subscription.status]} ${className}`}
    >
      {currentPlan.displayName}
      {subscription.status === 'trialing' && ' (Пробный)'}
    </Badge>
  );
}