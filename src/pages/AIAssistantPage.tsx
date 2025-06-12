import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Lightbulb, Sparkles, Download, Share2, Copy } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface Suggestion {
  id: string;
  title: string;
  description: string;
  category: string;
}

export const AIAssistantPage: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestions: Suggestion[] = [
    {
      id: '1',
      title: 'Подбор материалов',
      description: 'Какие материалы лучше использовать для кухонного стола?',
      category: 'материалы'
    },
    {
      id: '2',
      title: 'Размеры мебели',
      description: 'Какие стандартные размеры для обеденного стола на 6 человек?',
      category: 'размеры'
    },
    {
      id: '3',
      title: 'Стилевые решения',
      description: 'Помоги создать мебель в скандинавском стиле',
      category: 'стиль'
    },
    {
      id: '4',
      title: 'Цветовые сочетания',
      description: 'Какие цвета сочетаются с темным дубом?',
      category: 'цвет'
    }
  ];

  const welcomeMessage: Message = {
    id: 'welcome',
    type: 'assistant',
    content: `Привет, ${user?.name}! Я РУВ - ваш AI помощник по дизайну мебели. Я помогу вам с выбором материалов, размеров, стилей и цветовых решений. Чем могу помочь?`,
    timestamp: new Date(),
    suggestions: suggestions.map(s => s.description)
  };

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([welcomeMessage]);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Симуляция ответа AI
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputValue);
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        type: 'assistant',
        content: aiResponse.content,
        timestamp: new Date(),
        suggestions: aiResponse.suggestions
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000 + Math.random() * 2000);
  };

  const generateAIResponse = (input: string): { content: string; suggestions?: string[] } => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('материал') || lowerInput.includes('дерево') || lowerInput.includes('металл')) {
      return {
        content: 'Для выбора материалов рекомендую учитывать несколько факторов:\n\n🌳 **Дерево**: Дуб и ясень отлично подходят для столешниц - прочные и красивые. Сосна хороша для каркасов.\n\n🔧 **Металл**: Нержавеющая сталь для современного стиля, чугун для лофта.\n\n💡 **Совет**: Комбинируйте материалы - например, деревянная столешница с металлическими ножками создает интересный контраст.',
        suggestions: [
          'Расскажи про свойства дуба',
          'Какие виды металла лучше для ножек стола?',
          'Как сочетать дерево и металл?'
        ]
      };
    }
    
    if (lowerInput.includes('размер') || lowerInput.includes('стол') || lowerInput.includes('стул')) {
      return {
        content: 'Вот стандартные размеры мебели:\n\n📏 **Обеденный стол**:\n• На 4 человека: 120x80 см\n• На 6 человек: 160x90 см\n• На 8 человек: 200x100 см\n• Высота: 72-75 см\n\n🪑 **Стулья**:\n• Высота сиденья: 42-45 см\n• Ширина: 40-50 см\n• Глубина: 40-45 см\n\n💡 **Важно**: Оставляйте 60 см свободного пространства вокруг стола для комфортного перемещения.',
        suggestions: [
          'Какие размеры для барной стойки?',
          'Стандарты для офисной мебели',
          'Размеры детской мебели'
        ]
      };
    }
    
    if (lowerInput.includes('стиль') || lowerInput.includes('скандинавский') || lowerInput.includes('минимализм')) {
      return {
        content: 'Скандинавский стиль - отличный выбор! Вот основные принципы:\n\n🎨 **Цвета**: Белый, светло-серый, бежевый как основа. Акценты - приглушенные пастельные тона.\n\n🌳 **Материалы**: Светлые породы дерева (сосна, береза, дуб беленый), натуральные ткани.\n\n✨ **Формы**: Простые, чистые линии, функциональность превыше всего.\n\n💡 **Особенности**: Минимум декора, максимум функциональности, уют через текстуру и свет.',
        suggestions: [
          'Создай дизайн стула в скандинавском стиле',
          'Какие текстуры использовать?',
          'Примеры скандинавской мебели'
        ]
      };
    }
    
    return {
      content: 'Интересный вопрос! Я готов помочь с любыми аспектами дизайна мебели:\n\n• 🎨 Выбор цветов и материалов\n• 📐 Расчет размеров и пропорций\n• 🏠 Стилевые решения\n• 🔧 Технические аспекты\n• 💡 Креативные идеи\n\nУточните, пожалуйста, что именно вас интересует?',
      suggestions: [
        'Помоги выбрать материал для стола',
        'Какие размеры нужны для дивана?',
        'Создай дизайн в современном стиле'
      ]
    };
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Заголовок */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
              <Bot className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            AI Помощник РУВ
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Умный помощник для создания идеальной мебели
          </p>
        </div>

        {/* Быстрые действия */}
        {messages.length <= 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {suggestions.map((suggestion) => (
              <Card 
                key={suggestion.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleSuggestionClick(suggestion.description)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{suggestion.title}</CardTitle>
                    <Badge variant="secondary">{suggestion.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{suggestion.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Чат */}
        <Card className="min-h-[500px] flex flex-col">
          <CardHeader className="border-b">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                  РУВ
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">РУВ AI Помощник</CardTitle>
                <CardDescription>Онлайн • Готов помочь с дизайном</CardDescription>
              </div>
            </div>
          </CardHeader>

          {/* Сообщения */}
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex space-x-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className={message.type === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
                    }>
                      {message.type === 'user' ? <User className="w-4 h-4" /> : 'РУВ'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className={`space-y-2 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                    <div
                      className={`inline-block px-4 py-3 rounded-2xl ${
                        message.type === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-white dark:bg-gray-800 border'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{message.content}</div>
                      
                      {/* Кнопки действий для сообщений ассистента */}
                      {message.type === 'assistant' && (
                        <div className="flex space-x-2 mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyMessage(message.content)}
                            className="h-6 px-2 text-xs"
                          >
                            <Copy className="w-3 h-3 mr-1" />
                            Копировать
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 px-2 text-xs"
                          >
                            <Share2 className="w-3 h-3 mr-1" />
                            Поделиться
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    {/* Предложения */}
                    {message.suggestions && (
                      <div className="space-y-1">
                        {message.suggestions.map((suggestion, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="block text-left text-xs h-auto py-2 px-3 whitespace-normal"
                          >
                            <Lightbulb className="w-3 h-3 mr-1 inline flex-shrink-0" />
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    )}
                    
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {message.timestamp.toLocaleTimeString('ru-RU', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Индикатор загрузки */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                      РУВ
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-white dark:bg-gray-800 border rounded-2xl px-4 py-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </CardContent>

          {/* Поле ввода */}
          <div className="border-t p-4">
            <div className="flex space-x-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Задайте вопрос о дизайне мебели..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
              РУВ может допускать ошибки. Проверяйте важную информацию.
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
