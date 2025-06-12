import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

interface AIAssistantProps {
  onModelGenerated?: (model: THREE.Object3D) => void;
  onAdviceGenerated?: (advice: string) => void;
}

interface SearchResult {
  title: string;
  link: string;
  snippet: string;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ onModelGenerated, onAdviceGenerated }) => {
  const [query, setQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [conversation, setConversation] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);

  // Функция для поиска информации в интернете
  const searchWeb = async (searchQuery: string): Promise<SearchResult[]> => {
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error('Error searching web:', error);
      return [];
    }
  };

  // Функция для генерации 3D моделей
  const generateModel = async (description: string): Promise<THREE.Object3D> => {
    setIsGenerating(true);
    try {
      // Здесь будет интеграция с API для генерации 3D моделей
      const response = await fetch('/api/generate-model', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description }),
      });
      const modelData = await response.json();
      
      // Загрузка модели
      const loader = new GLTFLoader();
      const model = await loader.parseAsync(modelData);
      return model.scene;
    } catch (error) {
      console.error('Error generating model:', error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  // Функция для генерации советов
  const generateAdvice = async (context: string): Promise<string> => {
    try {
      const response = await fetch('/api/generate-advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context }),
      });
      const data = await response.json();
      return data.advice;
    } catch (error) {
      console.error('Error generating advice:', error);
      return 'Извините, не удалось сгенерировать совет.';
    }
  };

  // Обработка запроса пользователя
  const handleQuery = async () => {
    if (!query.trim()) return;

    // Добавляем запрос пользователя в историю
    setConversation(prev => [...prev, { role: 'user', content: query }]);

    try {
      // Анализируем запрос и определяем тип действия
      if (query.toLowerCase().includes('создай модель') || query.toLowerCase().includes('сгенерируй модель')) {
        const model = await generateModel(query);
        onModelGenerated?.(model);
        setConversation(prev => [...prev, { 
          role: 'assistant', 
          content: 'Модель успешно создана и добавлена в сцену.' 
        }]);
      } else if (query.toLowerCase().includes('совет') || query.toLowerCase().includes('рекомендация')) {
        const advice = await generateAdvice(query);
        onAdviceGenerated?.(advice);
        setConversation(prev => [...prev, { 
          role: 'assistant', 
          content: advice 
        }]);
      } else {
        // Поиск информации в интернете
        const searchResults = await searchWeb(query);
        const response = searchResults.length > 0
          ? `Вот что я нашел:\n${searchResults.map(r => `- ${r.title}\n${r.snippet}`).join('\n')}`
          : 'К сожалению, я не нашел релевантной информации.';
        
        setConversation(prev => [...prev, { 
          role: 'assistant', 
          content: response 
        }]);
      }
    } catch (error) {
      console.error('Error processing query:', error);
      setConversation(prev => [...prev, { 
        role: 'assistant', 
        content: 'Извините, произошла ошибка при обработке вашего запроса.' 
      }]);
    }

    setQuery('');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversation.map((message, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg ${
              message.role === 'user'
                ? 'bg-blue-100 ml-auto'
                : 'bg-gray-100'
            } max-w-[80%]`}
          >
            {message.content}
          </div>
        ))}
        {isGenerating && (
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>
      
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleQuery()}
            placeholder="Задайте вопрос или опишите, что нужно сделать..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleQuery}
            disabled={isGenerating}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            Отправить
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant; 