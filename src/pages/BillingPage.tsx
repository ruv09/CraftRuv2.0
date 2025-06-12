import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CreditCard, Download, Calendar, AlertTriangle, CheckCircle, ArrowUpCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const BillingPage: React.FC = () => {
  const { user, updateSubscription } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  if (!user) {
    navigate('/auth');
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatStorage = (bytes: number) => {
    if (bytes === -1) return 'Безлимит';
    const gb = bytes / 1024;
    return `${gb.toFixed(1)} ГБ`;
  };

  const getStoragePercentage = () => {
    if (user.usage.storageLimit === -1) return 0;
    return Math.round((user.usage.storageUsed / user.usage.storageLimit) * 100);
  };

  const getAIUsagePercentage = () => {
    if (user.usage.aiRequestsLimit === -1 || user.usage.aiRequestsLimit === 0) return 0;
    return Math.round((user.usage.aiRequestsUsed / user.usage.aiRequestsLimit) * 100);
  };

  const getPlanPrice = (plan: string) => {
    switch (plan) {
      case 'free': return 0;
      case 'basic': return 9.99;
      case 'pro': return 19.99;
      case 'enterprise': return 49.99;
      default: return 0;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'trial': return 'secondary';
      case 'expired': return 'destructive';
      case 'inactive': return 'outline';
      default: return 'outline';
    }
  };

  const handleCancelSubscription = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      updateSubscription({
        plan: 'free',
        status: 'inactive',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      });
      
      setShowCancelDialog(false);
    } catch (error) {
      console.error('Ошибка при отмене подписки:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isTrialExpiringSoon = () => {
    if (user.subscription.status !== 'trial' || !user.subscription.trialEndsAt) return false;
    const trialEnd = new Date(user.subscription.trialEndsAt);
    const now = new Date();
    const daysLeft = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysLeft <= 2;
  };

  const getTrialDaysLeft = () => {
    if (!user.subscription.trialEndsAt) return 0;
    const trialEnd = new Date(user.subscription.trialEndsAt);
    const now = new Date();
    return Math.max(0, Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
  };

  // Mock billing history
  const billingHistory = [
    {
      id: '1',
      date: '2024-01-15',
      amount: getPlanPrice(user.subscription.plan),
      plan: user.subscription.plan,
      status: 'paid',
      invoice: 'INV-2024-001'
    },
    {
      id: '2',
      date: '2023-12-15',
      amount: getPlanPrice(user.subscription.plan),
      plan: user.subscription.plan,
      status: 'paid',
      invoice: 'INV-2023-012'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Управление подпиской</h1>

          {/* Trial Warning */}
          {isTrialExpiringSoon() && (
            <Card className="mb-6 border-yellow-200 bg-yellow-50">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                  <div>
                    <p className="text-yellow-800 font-medium">
                      Ваш пробный период заканчивается через {getTrialDaysLeft()} дн.
                    </p>
                    <p className="text-yellow-700 text-sm">
                      Выберите план для продолжения использования всех функций
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    className="ml-auto border-yellow-300 text-yellow-700 hover:bg-yellow-100"
                    onClick={() => navigate('/pricing')}
                  >
                    Выбрать план
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Current Subscription */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Текущая подписка</span>
                <Badge variant={getStatusColor(user.subscription.status)}>
                  {user.subscription.status === 'active' ? 'Активна' :
                   user.subscription.status === 'trial' ? 'Пробный период' :
                   user.subscription.status === 'expired' ? 'Истекла' : 'Неактивна'}
                </Badge>
              </CardTitle>
              <CardDescription>
                Управляйте своей подпиской и биллингом
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    План: {user.subscription.plan.toUpperCase()}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    ${getPlanPrice(user.subscription.plan)}/месяц
                  </p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Начало подписки:</span>
                      <span>{formatDate(user.subscription.startDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Следующий платеж:</span>
                      <span>{formatDate(user.subscription.endDate)}</span>
                    </div>
                    {user.subscription.trialEndsAt && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Конец пробного периода:</span>
                        <span>{formatDate(user.subscription.trialEndsAt)}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <Button 
                    className="w-full" 
                    onClick={() => navigate('/pricing')}
                    variant="outline"
                  >
                    <ArrowUpCircle className="mr-2 h-4 w-4" />
                    Изменить план
                  </Button>
                  
                  {user.subscription.plan !== 'free' && user.subscription.status === 'active' && (
                    <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full">
                          Отменить подписку
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Отмена подписки</DialogTitle>
                          <DialogDescription>
                            Вы уверены, что хотите отменить подписку? Вы потеряете доступ к премиум функциям.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
                            Отмена
                          </Button>
                          <Button 
                            variant="destructive" 
                            onClick={handleCancelSubscription}
                            disabled={isLoading}
                          >
                            {isLoading ? 'Отменяем...' : 'Подтвердить отмену'}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Usage Statistics */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Статистика использования</CardTitle>
              <CardDescription>
                Отслеживайте использование ресурсов вашего плана
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Проекты</span>
                    <span className="text-sm text-gray-500">
                      {user.projects.count}/{user.projects.limit === -1 ? '∞' : user.projects.limit}
                    </span>
                  </div>
                  <Progress 
                    value={user.projects.limit === -1 ? 0 : (user.projects.count / user.projects.limit) * 100} 
                    className="h-2"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Хранилище</span>
                    <span className="text-sm text-gray-500">
                      {formatStorage(user.usage.storageUsed)}/{formatStorage(user.usage.storageLimit)}
                    </span>
                  </div>
                  <Progress value={getStoragePercentage()} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">AI запросы</span>
                    <span className="text-sm text-gray-500">
                      {user.usage.aiRequestsUsed}/{user.usage.aiRequestsLimit === -1 ? '∞' : user.usage.aiRequestsLimit}
                    </span>
                  </div>
                  <Progress value={getAIUsagePercentage()} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                Способ оплаты
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center">
                  <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center mr-3">
                    <span className="text-white text-xs font-bold">VISA</span>
                  </div>
                  <div>
                    <p className="font-medium">**** **** **** 4242</p>
                    <p className="text-sm text-gray-500">Истекает 12/27</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Изменить
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Billing History */}
          <Card>
            <CardHeader>
              <CardTitle>История платежей</CardTitle>
              <CardDescription>
                Просмотрите историю ваших платежей и загрузите счета
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {billingHistory.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      <div>
                        <p className="font-medium">${payment.amount} - {payment.plan.toUpperCase()}</p>
                        <p className="text-sm text-gray-500">{formatDate(payment.date)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">Оплачено</Badge>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Счет
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;
