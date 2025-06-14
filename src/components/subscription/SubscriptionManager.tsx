import React, { useState } from 'react';
import { Calendar, CreditCard, AlertTriangle, Check, Crown, Zap, Clock, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useSubscription, useUsageLimits } from '@/contexts/SubscriptionContext';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

export function SubscriptionManager() {
  const { 
    subscription, 
    currentPlan, 
    usage, 
    isLoading, 
    cancelSubscription, 
    resumeSubscription 
  } = useSubscription();
  
  const limits = useUsageLimits();
  const [isProcessing, setIsProcessing] = useState(false);

  const getStatusBadge = () => {
    if (!subscription) {
      return <Badge variant="secondary">Бесплатный план</Badge>;
    }

    switch (subscription.status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Активна</Badge>;
      case 'trialing':
        return <Badge className="bg-blue-100 text-blue-800">Пробный период</Badge>;
      case 'past_due':
        return <Badge className="bg-yellow-100 text-yellow-800">Просрочена</Badge>;
      case 'canceled':
        return <Badge className="bg-red-100 text-red-800">Отменена</Badge>;
      default:
        return <Badge variant="outline">{subscription.status}</Badge>;
    }
  };

  const handleCancelSubscription = async () => {
    setIsProcessing(true);
    try {
      await cancelSubscription();
    } catch (error) {
      console.error('Cancel subscription error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResumeSubscription = async () => {
    setIsProcessing(true);
    try {
      await resumeSubscription();
    } catch (error) {
      console.error('Resume subscription error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDate = (date: Date) => {
    return formatDistanceToNow(new Date(date), { 
      addSuffix: true, 
      locale: ru 
    });
  };

  const UsageCard = ({ 
    title, 
    used, 
    limit, 
    icon: Icon, 
    color = 'blue' 
  }: { 
    title: string; 
    used: number; 
    limit: number; 
    icon: any; 
    color?: string; 
  }) => {
    const isUnlimited = limit === -1;
    const percentage = isUnlimited ? 0 : (used / limit) * 100;
    const isNearLimit = percentage > 80;

    return (
      <Card className={isNearLimit ? 'border-orange-200 bg-orange-50/50' : ''}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{title}</span>
            </div>
            {isNearLimit && (
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Использовано:</span>
              <span className="font-medium">
                {used} {isUnlimited ? '' : `/ ${limit}`}
              </span>
            </div>
            
            {!isUnlimited && (
              <Progress 
                value={percentage} 
                className={`h-2 ${isNearLimit ? 'bg-orange-100' : ''}`}
              />
            )}
            
            {isUnlimited && (
              <Badge variant="secondary" className="text-xs">
                Безлимит
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Управление подпиской</h2>
          <p className="text-muted-foreground">
            Управляйте своим планом и отслеживайте использование
          </p>
        </div>
      </div>

      {/* Текущий план */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {currentPlan.id === 'free' ? (
              <Zap className="h-5 w-5" />
            ) : (
              <Crown className="h-5 w-5" />
            )}
            Текущий план: {currentPlan.displayName}
            {getStatusBadge()}
          </CardTitle>
          <CardDescription>
            {currentPlan.description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {subscription ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Следующее списание</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(subscription.currentPeriodEnd)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Способ оплаты</p>
                  <p className="text-xs text-muted-foreground">
                    {subscription.paymentProvider}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Активна с</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(subscription.currentPeriodStart)}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground mb-4">
                Вы используете бесплатный план
              </p>
              <Button>
                Выбрать платный план
              </Button>
            </div>
          )}

          {/* Действия с подпиской */}
          {subscription && (
            <div className="flex gap-2 pt-4 border-t">
              {subscription.status === 'active' && !subscription.cancelAtPeriodEnd && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline">
                      Отменить подписку
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Отменить подписку?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Ваша подписка будет отменена, но останется активной до конца 
                        текущего периода ({formatDate(subscription.currentPeriodEnd)}). 
                        После этого вы перейдете на бесплатный план.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Оставить подписку</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleCancelSubscription}
                        disabled={isProcessing}
                      >
                        {isProcessing ? 'Отмена...' : 'Отменить подписку'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}

              {subscription.cancelAtPeriodEnd && (
                <Button 
                  onClick={handleResumeSubscription}
                  disabled={isProcessing}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {isProcessing ? 'Возобновление...' : 'Возобновить подписку'}
                </Button>
              )}

              <Button variant="outline">
                Изменить план
              </Button>
              
              <Button variant="outline">
                Управление оплатой
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Использование */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Использование за текущий период</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <UsageCard
            title="Проекты"
            used={usage.projects}
            limit={currentPlan.limits.projects}
            icon={Calendar}
          />
          
          <UsageCard
            title="AI генерации"
            used={usage.aiGenerations}
            limit={currentPlan.limits.aiGenerations}
            icon={Zap}
          />
          
          <UsageCard
            title="Хранилище (GB)"
            used={usage.storageGB}
            limit={currentPlan.limits.storageGB}
            icon={CreditCard}
          />
        </div>
      </div>

      {/* Возможности плана */}
      <Card>
        <CardHeader>
          <CardTitle>Возможности вашего плана</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentPlan.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Предупреждения */}
      {subscription?.cancelAtPeriodEnd && (
        <Card className="border-orange-200 bg-orange-50/50">
          <CardContent className="p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <p className="font-medium text-orange-900">
                  Подписка будет отменена
                </p>
                <p className="text-sm text-orange-800">
                  Ваша подписка завершится {formatDate(subscription.currentPeriodEnd)}. 
                  После этого вы перейдете на бесплатный план.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {subscription?.status === 'past_due' && (
        <Card className="border-red-200 bg-red-50/50">
          <CardContent className="p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <p className="font-medium text-red-900">
                  Проблема с оплатой
                </p>
                <p className="text-sm text-red-800">
                  Не удалось списать средства за подписку. Пожалуйста, 
                  обновите способ оплаты, чтобы избежать приостановки сервиса.
                </p>
                <Button size="sm" className="mt-2">
                  Обновить способ оплаты
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}