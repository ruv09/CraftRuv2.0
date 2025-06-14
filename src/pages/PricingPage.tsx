import React, { useState } from 'react';
import { Check, Sparkles, Crown, Building, Zap, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { SUBSCRIPTION_PLANS } from '@/types/subscription';
import { useSubscription } from '@/contexts/SubscriptionContext';

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const { subscription, createCheckoutSession, isLoading } = useSubscription();

  const handleSubscribe = async (planId: string) => {
    if (planId === 'free') return; // Бесплатный план не требует оплаты

    try {
      const checkoutUrl = await createCheckoutSession(planId, billingCycle);
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Subscription error:', error);
      // TODO: Показать уведомление об ошибке
    }
  };

  const getIconForPlan = (planId: string) => {
    switch (planId) {
      case 'free': return <Zap className="h-6 w-6" />;
      case 'pro': return <Sparkles className="h-6 w-6" />;
      case 'business': return <Crown className="h-6 w-6" />;
      case 'enterprise': return <Building className="h-6 w-6" />;
      default: return <Zap className="h-6 w-6" />;
    }
  };

  const getColorClasses = (color: string, isPopular?: boolean) => {
    const baseClasses = {
      gray: 'border-gray-200 bg-white',
      blue: 'border-blue-200 bg-blue-50/50',
      purple: 'border-purple-200 bg-purple-50/50',
      gold: 'border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50'
    };

    const popularClasses = {
      gray: 'border-gray-300 ring-2 ring-gray-200',
      blue: 'border-blue-300 ring-2 ring-blue-200',
      purple: 'border-purple-300 ring-2 ring-purple-200',
      gold: 'border-yellow-300 ring-2 ring-yellow-200'
    };

    return isPopular ? popularClasses[color as keyof typeof popularClasses] : baseClasses[color as keyof typeof baseClasses];
  };

  const getCurrentPlanId = () => {
    return subscription?.planId || 'free';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Hero секция */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
        <div className="relative container mx-auto px-4 py-16 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Выберите свой план
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Создавайте потрясающие дизайны интерьеров с помощью AI. 
              Начните бесплатно или выберите план для профессиональной работы.
            </p>

            {/* Переключатель тарификации */}
            <div className="flex items-center justify-center gap-4 mb-12">
              <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-foreground' : 'text-muted-foreground'}`}>
                Ежемесячно
              </span>
              <Switch
                checked={billingCycle === 'yearly'}
                onCheckedChange={(checked) => setBillingCycle(checked ? 'yearly' : 'monthly')}
              />
              <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-foreground' : 'text-muted-foreground'}`}>
                Ежегодно
              </span>
              {billingCycle === 'yearly' && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Скидка 2 месяца
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Тарифные планы */}
      <div className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SUBSCRIPTION_PLANS.map((plan) => {
            const isCurrentPlan = getCurrentPlanId() === plan.id;
            const price = billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
            const monthlyPrice = billingCycle === 'yearly' ? plan.yearlyPrice / 12 : plan.monthlyPrice;

            return (
              <Card 
                key={plan.id} 
                className={`relative transition-all duration-300 hover:scale-105 ${getColorClasses(plan.color, plan.popular)}`}
              >
                {/* Популярный план */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1">
                      <Star className="h-3 w-3 mr-1" />
                      Популярный
                    </Badge>
                  </div>
                )}

                {/* Текущий план */}
                {isCurrentPlan && (
                  <div className="absolute -top-3 right-4">
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                      Текущий план
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <div className={`w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center ${
                    plan.color === 'gray' ? 'bg-gray-100 text-gray-600' :
                    plan.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                    plan.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                    'bg-yellow-100 text-yellow-600'
                  }`}>
                    {getIconForPlan(plan.id)}
                  </div>
                  
                  <CardTitle className="text-2xl">{plan.displayName}</CardTitle>
                  <CardDescription className="text-sm">{plan.description}</CardDescription>
                  
                  <div className="mt-4">
                    {price === 0 ? (
                      <div className="text-3xl font-bold">Бесплатно</div>
                    ) : (
                      <div className="space-y-1">
                        <div className="text-3xl font-bold">
                          ${Math.round(monthlyPrice)}
                          <span className="text-base font-normal text-muted-foreground">/мес</span>
                        </div>
                        {billingCycle === 'yearly' && (
                          <div className="text-sm text-muted-foreground">
                            ${plan.yearlyPrice}/год
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Особенности */}
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Кнопка подписки */}
                  <Button
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={isLoading || isCurrentPlan}
                    className={`w-full mt-6 ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' 
                        : ''
                    }`}
                    variant={plan.popular ? 'default' : isCurrentPlan ? 'outline' : 'outline'}
                  >
                    {isCurrentPlan ? 'Текущий план' : 
                     plan.id === 'free' ? 'Начать бесплатно' : 
                     'Выбрать план'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Дополнительная информация */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-semibold mb-6">Часто задаваемые вопросы</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card>
              <CardContent className="p-6">
                <h4 className="font-semibold mb-2">Можно ли изменить план?</h4>
                <p className="text-sm text-muted-foreground">
                  Да, вы можете повысить или понизить тариф в любое время в личном кабинете.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h4 className="font-semibold mb-2">Есть ли пробный период?</h4>
                <p className="text-sm text-muted-foreground">
                  Для всех платных планов доступен 7-дневный пробный период.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h4 className="font-semibold mb-2">Возврат средств</h4>
                <p className="text-sm text-muted-foreground">
                  Полный возврат в течение 14 дней, если сервис вам не подошел.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Корпоративные клиенты */}
        <div className="mt-16 text-center">
          <Card className="max-w-4xl mx-auto bg-gradient-to-r from-gray-900 to-gray-800 text-white">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Нужно индивидуальное решение?</h3>
              <p className="text-gray-300 mb-6">
                Для крупных команд и компаний мы создаем персональные тарифы с особыми условиями.
              </p>
              <Button variant="secondary" size="lg">
                Связаться с отделом продаж
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
