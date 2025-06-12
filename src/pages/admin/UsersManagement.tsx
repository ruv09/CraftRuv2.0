import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Search, UserCog, Ban, CheckCircle, Mail, Calendar, Package } from 'lucide-react';
import { User } from '@/contexts/AuthContext';

const UsersManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: 'demo-user',
      email: 'demo@craftruv.ru',
      name: 'Демо Пользователь',
      avatar: '',
      role: 'user',
      createdAt: '2024-01-15T10:30:00Z',
      subscription: {
        plan: 'pro',
        status: 'active',
        startDate: '2024-01-15T10:30:00Z',
        endDate: '2024-02-15T10:30:00Z'
      },
      projects: { count: 5, limit: -1 },
      usage: {
        storageUsed: 1024,
        storageLimit: 100 * 1024,
        aiRequestsUsed: 150,
        aiRequestsLimit: 1000
      }
    },
    {
      id: 'user-2',
      email: 'ivan@example.com',
      name: 'Иван Петров',
      avatar: '',
      role: 'user',
      createdAt: '2024-01-10T15:20:00Z',
      subscription: {
        plan: 'basic',
        status: 'active',
        startDate: '2024-01-10T15:20:00Z',
        endDate: '2024-02-10T15:20:00Z'
      },
      projects: { count: 3, limit: 10 },
      usage: {
        storageUsed: 512,
        storageLimit: 10 * 1024,
        aiRequestsUsed: 0,
        aiRequestsLimit: 0
      }
    },
    {
      id: 'user-3',
      email: 'maria@example.com',
      name: 'Мария Сидорова',
      avatar: '',
      role: 'user',
      createdAt: '2024-01-05T09:15:00Z',
      subscription: {
        plan: 'free',
        status: 'trial',
        startDate: '2024-01-05T09:15:00Z',
        endDate: '2024-01-12T09:15:00Z',
        trialEndsAt: '2024-01-12T09:15:00Z'
      },
      projects: { count: 2, limit: 3 },
      usage: {
        storageUsed: 256,
        storageLimit: 1024,
        aiRequestsUsed: 0,
        aiRequestsLimit: 0
      }
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const subscriptionPlans = [
    { value: 'all', label: 'Все планы' },
    { value: 'free', label: 'Free' },
    { value: 'basic', label: 'Basic' },
    { value: 'pro', label: 'Pro' },
    { value: 'enterprise', label: 'Enterprise' }
  ];

  const subscriptionStatuses = [
    { value: 'all', label: 'Все статусы' },
    { value: 'active', label: 'Активная' },
    { value: 'trial', label: 'Пробная' },
    { value: 'expired', label: 'Истекшая' },
    { value: 'inactive', label: 'Неактивная' }
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlan = selectedPlan === 'all' || user.subscription.plan === selectedPlan;
    const matchesStatus = selectedStatus === 'all' || user.subscription.status === selectedStatus;
    return matchesSearch && matchesPlan && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'trial': return 'secondary';
      case 'expired': return 'destructive';
      case 'inactive': return 'outline';
      default: return 'outline';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'free': return 'outline';
      case 'basic': return 'secondary';
      case 'pro': return 'default';
      case 'enterprise': return 'destructive';
      default: return 'outline';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  const formatStorage = (bytes: number) => {
    const gb = bytes / 1024;
    return `${gb.toFixed(1)} ГБ`;
  };

  const handleUpdateSubscription = (userId: string, plan: string) => {
    setUsers(prev => prev.map(user => {
      if (user.id === userId) {
        const now = new Date().toISOString();
        const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
        
        let limits = { count: 0, limit: 3 };
        let usage = { storageUsed: user.usage.storageUsed, storageLimit: 1024, aiRequestsUsed: user.usage.aiRequestsUsed, aiRequestsLimit: 0 };
        
        switch (plan) {
          case 'basic':
            limits = { count: user.projects.count, limit: 10 };
            usage = { ...usage, storageLimit: 10 * 1024, aiRequestsLimit: 0 };
            break;
          case 'pro':
            limits = { count: user.projects.count, limit: -1 };
            usage = { ...usage, storageLimit: 100 * 1024, aiRequestsLimit: 1000 };
            break;
          case 'enterprise':
            limits = { count: user.projects.count, limit: -1 };
            usage = { ...usage, storageLimit: -1, aiRequestsLimit: -1 };
            break;
        }
        
        return {
          ...user,
          subscription: {
            plan: plan as any,
            status: 'active' as any,
            startDate: now,
            endDate: endDate
          },
          projects: limits,
          usage: usage
        };
      }
      return user;
    }));
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(user => {
      if (user.id === userId) {
        const newStatus = user.subscription.status === 'active' ? 'inactive' : 'active';
        return {
          ...user,
          subscription: {
            ...user.subscription,
            status: newStatus as any
          }
        };
      }
      return user;
    }));
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Управление пользователями</h2>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск пользователей..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={selectedPlan} onValueChange={setSelectedPlan}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {subscriptionPlans.map(plan => (
              <SelectItem key={plan.value} value={plan.value}>
                {plan.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {subscriptionStatuses.map(status => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredUsers.map((user) => (
          <Card key={user.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-semibold">{user.name}</h3>
                      <Badge variant={getPlanColor(user.subscription.plan)}>
                        {user.subscription.plan.toUpperCase()}
                      </Badge>
                      <Badge variant={getStatusColor(user.subscription.status)}>
                        {subscriptionStatuses.find(s => s.value === user.subscription.status)?.label}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                      <div className="flex items-center">
                        <Mail className="mr-1 h-3 w-3" />
                        {user.email}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-3 w-3" />
                        Регистрация: {formatDate(user.createdAt)}
                      </div>
                      <div className="flex items-center">
                        <Package className="mr-1 h-3 w-3" />
                        Проектов: {user.projects.count}{user.projects.limit > 0 ? `/${user.projects.limit}` : ''}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <UserCog className="mr-2 h-4 w-4" />
                        Управление
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Управление пользователем</DialogTitle>
                        <DialogDescription>
                          Изменение подписки и статуса пользователя {user.name}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="plan" className="text-right">План</Label>
                          <Select 
                            defaultValue={user.subscription.plan}
                            onValueChange={(value) => handleUpdateSubscription(user.id, value)}
                          >
                            <SelectTrigger className="col-span-3">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="free">Free</SelectItem>
                              <SelectItem value="basic">Basic ($9.99/мес)</SelectItem>
                              <SelectItem value="pro">Pro ($19.99/мес)</SelectItem>
                              <SelectItem value="enterprise">Enterprise ($49.99/мес)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label className="text-right">Хранилище</Label>
                          <div className="col-span-3 text-sm">
                            {formatStorage(user.usage.storageUsed)} / {user.usage.storageLimit === -1 ? 'Безлимит' : formatStorage(user.usage.storageLimit)}
                          </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label className="text-right">AI запросы</Label>
                          <div className="col-span-3 text-sm">
                            {user.usage.aiRequestsUsed} / {user.usage.aiRequestsLimit === -1 ? 'Безлимит' : user.usage.aiRequestsLimit}
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Button
                    variant={user.subscription.status === 'active' ? 'destructive' : 'default'}
                    size="sm"
                    onClick={() => toggleUserStatus(user.id)}
                  >
                    {user.subscription.status === 'active' ? (
                      <>
                        <Ban className="mr-2 h-4 w-4" />
                        Заблокировать
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Активировать
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Подписка активна до:</span>
                  <div className="font-medium">{formatDate(user.subscription.endDate)}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Использование хранилища:</span>
                  <div className="font-medium">
                    {((user.usage.storageUsed / (user.usage.storageLimit === -1 ? user.usage.storageUsed : user.usage.storageLimit)) * 100).toFixed(1)}%
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">AI запросы в месяц:</span>
                  <div className="font-medium">
                    {user.usage.aiRequestsLimit === -1 ? 'Безлимит' : 
                     `${user.usage.aiRequestsUsed}/${user.usage.aiRequestsLimit}`}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Создано проектов:</span>
                  <div className="font-medium">{user.projects.count}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Пользователи не найдены</p>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;
