import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles, 
  Palette, 
  Bot, 
  Layers3,
  Users,
  Zap,
  CheckCircle,
  Star
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

export const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const features = [
    {
      icon: Layers3,
      title: '3D Редактор',
      description: 'Создавайте мебель в интерактивном 3D пространстве с профессиональными инструментами',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Bot,
      title: 'AI Помощник РУВ',
      description: 'Получайте умные рекомендации по дизайну и материалам от нашего ИИ-ассистента',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Palette,
      title: 'Библиотека Материалов',
      description: 'Обширная коллекция текстур, цветов и материалов для реалистичной визуализации',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: Sparkles,
      title: 'AR Визуализация',
      description: 'Просматривайте свои проекты в дополненной реальности прямо в вашем пространстве',
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  const benefits = [
    'Интуитивно понятный интерфейс',
    'Профессиональные инструменты',
    'Облачное хранение проектов',
    'Экспорт в различные форматы',
    'Команная работа над проектами',
    'Техническая поддержка 24/7'
  ];

  return (
    <div className="min-h-screen">
      {/* Hero секция */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]"></div>
        
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            {/* Логотип и заголовок */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-orange-400 to-red-500 rounded-full"></div>
              </div>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                CraftRuv
              </span>
              <br />
              <span className="text-gray-900 dark:text-white">
                Проектирование мебели нового поколения
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Создавайте, визуализируйте и воплощайте свои идеи в жизнь с помощью мощного 3D редактора 
              и умного AI помощника РУВ
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-6 text-lg"
                onClick={() => navigate(isAuthenticated ? '/dashboard' : '/auth')}
              >
                {isAuthenticated ? 'Открыть проекты' : 'Начать создавать'}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-6 text-lg border-2"
                onClick={() => navigate('/materials')}
              >
                Посмотреть материалы
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Особенности */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Почему выбирают CraftRuv?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Мощные инструменты для профессиональных дизайнеров и любителей
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="relative overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity`}></div>
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Преимущества */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Всё что нужно для создания идеальной мебели
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                CraftRuv объединяет передовые технологии 3D моделирования, искусственный интеллект 
                и обширную библиотеку материалов в одной платформе.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mr-4">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">10,000+</h3>
                    <p className="text-blue-100">Довольных пользователей</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">500+</div>
                    <div className="text-blue-100">Готовых шаблонов</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">1000+</div>
                    <div className="text-blue-100">Материалов</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA секция */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Готовы начать создавать?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Присоединяйтесь к тысячам дизайнеров, которые уже создают потрясающую мебель с CraftRuv
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="px-8 py-6 text-lg bg-white text-blue-600 hover:bg-gray-100"
              onClick={() => navigate(isAuthenticated ? '/dashboard' : '/auth')}
            >
              <Zap className="mr-2 w-5 h-5" />
              {isAuthenticated ? 'Начать проект' : 'Регистрация бесплатно'}
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-6 text-lg border-white text-white hover:bg-white/10"
              onClick={() => navigate('/materials')}
            >
              Попробовать демо
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
