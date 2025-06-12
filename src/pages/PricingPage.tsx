import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Zap, Crown, Building } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface PricingTier {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  limitations: string[];
  recommended?: boolean;
  popular?: boolean;
}

const PricingPage: React.FC = () => {
  const { user, updateSubscription } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const pricingTiers: PricingTier[] = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      period: '7 дней пробный',
      description: 'Идеально для знакомства с платформой',
      icon: <Star className="h-6 w-6" />,
      features: [
        'До 3 проектов',
        'Базовая библиотека материалов',
        'Основные инструменты дизайна',
        '1 ГБ облачного хранилища',
        'Экспорт в стандартном качестве'
      ],
      limitations: [
        'Нет AI помощника',
        'Ограниченная библиотека мебели',
        'Базовая поддержка'
      ]
    },
    {
      id: 'basic',
      name: 'Basic',
      price: 9.99,
      period: 'в месяц',
      description: 'Для индивидуальных дизайнеров',
      icon: <Zap className="h-6 w-6" />,
      features: [
        'До 10 проектов',
        'Полная библиотека материалов',
        'Расширенные инструменты дизайна',
        '10 ГБ облачного хранилища',
        'Экспорт в высоком качестве',
        'Приоритетная поддержка'
      ],
      limitations: [
        'Нет AI помощника',
        'Ограниченное количество проектов'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 19.99,
      period: 'в месяц',
      description: 'Для профессиональных дизайнеров',
      icon: <Crown className="h-6 w-6" />,
      features: [
        'Неограниченное количество проектов',
        'Полная библиотека материалов и мебели',
        'AI помощник для дизайна',
        'Продвинутые инструменты освещения',
        '100 ГБ облачного хранилища',
        '1000 AI запросов в месяц',
        'Экспорт в профессиональном качестве',
        'Приоритетная поддержка',
        'Совместная работа (до 3 человек)'
      ],
      limitations: [],
      popular: true,
      recommended: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 49.99,
      period: 'в месяц',
      description: 'Для команд и студий',
      icon: <Building className="h-6 w-6" />,
      features: [
        'Все функции Pro',
        'Неограниченное облачное хранилище',
        'Неограниченные AI запросы',
        'Командная работа (неограниченно)',
        'Кастомная библиотека материалов',
        'API доступ',
        'Персональный менеджер',
        'SLA 99.9%',
        'Кастомные интеграции',
        'Обучение команды'
      ],
      limitations: []
    }
  ];

  const handleSelectPlan = async (planId: string) => {
    if (!user) {
      navigate('/auth');
      return;
    }

    setIsLoading(planId);
    
    try {
      // Симуляция API вызова для обновления подписки
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const selectedPlan = pricingTiers.find(tier => tier.id === planId);
      if (selectedPlan) {
        const now = new Date();
        const endDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        
        updateSubscription({
          plan: planId as any,
          status: 'active',
          startDate: now.toISOString(),
          endDate: endDate.toISOString()
        });
        
        // Перенаправление на страницу успеха или дашборд
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Ошибка при обновлении подписки:', error);
    } finally {
      setIsLoading(null);
    }
  };

  const isCurrentPlan = (planId: string) => {
    return user?.subscription.plan === planId;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Выберите подходящий план
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Создавайте потрясающие интерьеры с помощью нашей платформы. 
            Начните с бесплатного пробного периода и выберите план, который подходит именно вам.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {pricingTiers.map((tier) => (
            <Card 
              key={tier.id} 
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl ${
                tier.popular ? 'ring-2 ring-purple-500 shadow-lg scale-105' : 'hover:scale-105'
              }`}
            >
              {tier.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-center py-2 text-sm font-semibold">
                  Самый популярный
                </div>
              )}
              
              <CardHeader className={`text-center ${tier.popular ? 'pt-12' : 'pt-6'}`}>
                <div className="flex justify-center mb-4">
                  <div className={`p-3 rounded-full ${
                    tier.id === 'free' ? 'bg-gray-100 text-gray-600' :
                    tier.id === 'basic' ? 'bg-blue-100 text-blue-600' :
                    tier.id === 'pro' ? 'bg-purple-100 text-purple-600' :
                    'bg-yellow-100 text-yellow-600'
                  }`}>
                    {tier.icon}
                  </div>
                </div>
                
                <CardTitle className="text-2xl font-bold">{tier.name}</CardTitle>
                <CardDescription className="text-sm text-gray-600 mt-2">
                  {tier.description}
                </CardDescription>
                
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">
                    ${tier.price}
                  </span>
                  <span className="text-gray-600 ml-1">/{tier.period}</span>
                </div>

                {tier.recommended && (
                  <Badge className="mt-2 bg-green-100 text-green-800 hover:bg-green-100">
                    Рекомендуется
                  </Badge>
                )}
              </CardHeader>

              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-green-700 mb-2">Включено:</h4>
                    <ul className="space-y-2">
                      {tier.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {tier.limitations.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-500 mb-2">Ограничения:</h4>
                      <ul className="space-y-1">
                        {tier.limitations.map((limitation, index) => (
                          <li key={index} className="text-sm text-gray-500">
                            • {limitation}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <Button
                  className={`w-full mt-6 ${
                    tier.popular 
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white'
                      : tier.id === 'enterprise'
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white'
                      : ''
                  }`}
                  variant={isCurrentPlan(tier.id) ? 'outline' : 'default'}
                  disabled={isCurrentPlan(tier.id) || isLoading === tier.id}
                  onClick={() => handleSelectPlan(tier.id)}
                >
                  {isLoading === tier.id ? (
                    'Обработка...'
                  ) : isCurrentPlan(tier.id) ? (
                    'Текущий план'
                  ) : tier.id === 'free' ? (
                    'Начать пробный период'
                  ) : (
                    `Выбрать ${tier.name}`
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Часто задаваемые вопросы
          </h3>
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            <div className="text-left">
              <h4 className="font-semibold text-gray-900 mb-2">
                Можно ли изменить план в любое время?
              </h4>
              <p className="text-gray-600">
                Да, вы можете повысить или понизить свой план в любое время. 
                Изменения вступают в силу немедленно.
              </p>
            </div>
            <div className="text-left">
              <h4 className="font-semibold text-gray-900 mb-2">
                Что происходит после окончания пробного периода?
              </h4>
              <p className="text-gray-600">
                После 7-дневного пробного периода вам нужно будет выбрать платный план 
                или ваш аккаунт перейдет в режим только для просмотра.
              </p>
            </div>
            <div className="text-left">
              <h4 className="font-semibold text-gray-900 mb-2">
                Есть ли возврат средств?
              </h4>
              <p className="text-gray-600">
                Мы предлагаем 30-дневную гарантию возврата средств для всех планов. 
                Никаких вопросов не задаем.
              </p>
            </div>
            <div className="text-left">
              <h4 className="font-semibold text-gray-900 mb-2">
                Нужна помощь в выборе плана?
              </h4>
              <p className="text-gray-600">
                Свяжитесь с нашей командой поддержки, и мы поможем вам выбрать 
                идеальный план для ваших потребностей.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
