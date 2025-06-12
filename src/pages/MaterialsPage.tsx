import React, { useState } from 'react';
import { Search, Filter, Download, Heart, Eye, Grid3X3, List } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

interface Material {
  id: string;
  name: string;
  category: string;
  description: string;
  color: string;
  texture?: string;
  properties: {
    roughness: number;
    metalness: number;
    opacity: number;
  };
  tags: string[];
  isPremium: boolean;
  downloads: number;
  likes: number;
}

export const MaterialsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [likedMaterials, setLikedMaterials] = useState<string[]>([]);

  const materials: Material[] = [
    {
      id: '1',
      name: 'Дуб классический',
      category: 'wood',
      description: 'Натуральная текстура дуба с выраженной структурой',
      color: '#D2B48C',
      properties: { roughness: 0.8, metalness: 0, opacity: 1 },
      tags: ['натуральный', 'классический', 'текстура'],
      isPremium: false,
      downloads: 1250,
      likes: 89
    },
    {
      id: '2',
      name: 'Сосна скандинавская',
      category: 'wood',
      description: 'Светлая древесина с минимальной обработкой',
      color: '#F5DEB3',
      properties: { roughness: 0.7, metalness: 0, opacity: 1 },
      tags: ['светлый', 'скандинавский', 'минимализм'],
      isPremium: false,
      downloads: 980,
      likes: 67
    },
    {
      id: '3',
      name: 'Нержавеющая сталь',
      category: 'metal',
      description: 'Матовая нержавеющая сталь премиум качества',
      color: '#C0C0C0',
      properties: { roughness: 0.2, metalness: 1, opacity: 1 },
      tags: ['металл', 'современный', 'прочный'],
      isPremium: true,
      downloads: 750,
      likes: 45
    },
    {
      id: '4',
      name: 'Хлопок белоснежный',
      category: 'fabric',
      description: 'Мягкий хлопковый материал для обивки',
      color: '#F8F8FF',
      properties: { roughness: 0.9, metalness: 0, opacity: 1 },
      tags: ['ткань', 'мягкий', 'обивка'],
      isPremium: false,
      downloads: 620,
      likes: 34
    },
    {
      id: '5',
      name: 'Мрамор каррарский',
      category: 'stone',
      description: 'Элитный белый мрамор с натуральными прожилками',
      color: '#F5F5DC',
      properties: { roughness: 0.1, metalness: 0, opacity: 1 },
      tags: ['камень', 'роскошь', 'прожилки'],
      isPremium: true,
      downloads: 890,
      likes: 78
    },
    {
      id: '6',
      name: 'Кожа натуральная',
      category: 'leather',
      description: 'Высококачественная натуральная кожа',
      color: '#8B4513',
      properties: { roughness: 0.6, metalness: 0, opacity: 1 },
      tags: ['кожа', 'натуральный', 'качество'],
      isPremium: true,
      downloads: 540,
      likes: 42
    },
    {
      id: '7',
      name: 'Стекло прозрачное',
      category: 'glass',
      description: 'Кристально чистое прозрачное стекло для современного дизайна',
      color: '#F0F8FF',
      properties: { roughness: 0.05, metalness: 0, opacity: 0.9 },
      tags: ['стекло', 'прозрачный', 'современный', 'блеск'],
      isPremium: false,
      downloads: 320,
      likes: 28
    },
    {
      id: '8',
      name: 'Керамика белая',
      category: 'ceramic',
      description: 'Классическая белая керамика с матовой поверхностью',
      color: '#FFFEF7',
      properties: { roughness: 0.3, metalness: 0, opacity: 1 },
      tags: ['керамика', 'белый', 'матовый', 'классический'],
      isPremium: false,
      downloads: 450,
      likes: 35
    },
    {
      id: '9',
      name: 'Пластик чёрный',
      category: 'plastic',
      description: 'Глянцевый чёрный пластик для современной мебели',
      color: '#1C1C1C',
      properties: { roughness: 0.1, metalness: 0, opacity: 1 },
      tags: ['пластик', 'чёрный', 'глянцевый', 'современный'],
      isPremium: false,
      downloads: 280,
      likes: 22
    }
  ];

  const categories = [
    { value: 'all', label: 'Все материалы' },
    { value: 'wood', label: 'Дерево' },
    { value: 'metal', label: 'Металл' },
    { value: 'fabric', label: 'Ткань' },
    { value: 'stone', label: 'Камень' },
    { value: 'leather', label: 'Кожа' },
    { value: 'glass', label: 'Стекло' },
    { value: 'ceramic', label: 'Керамика' },
    { value: 'plastic', label: 'Пластик' },
  ];

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         material.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         material.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || material.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const toggleLike = (materialId: string) => {
    setLikedMaterials(prev => 
      prev.includes(materialId) 
        ? prev.filter(id => id !== materialId)
        : [...prev, materialId]
    );
  };

  const handleDownload = (material: Material) => {
    // Симуляция скачивания материала
    console.log('Скачивание материала:', material.name);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Заголовок */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Библиотека материалов
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Обширная коллекция высококачественных материалов для ваших проектов
          </p>
        </div>

        {/* Поиск и фильтры */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-8 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Поиск материалов..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Категория" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Фильтры
              </Button>

              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Результаты */}
        <div className="mb-4 text-gray-600 dark:text-gray-300">
          Найдено материалов: {filteredMaterials.length}
        </div>

        {/* Сетка материалов */}
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
          : 'space-y-4'
        }>
          {filteredMaterials.map((material) => (
            <Card key={material.id} className="group hover:shadow-lg transition-all duration-300">
              {viewMode === 'grid' ? (
                <>
                  <div className="relative">
                    {/* Превью материала */}
                    <div 
                      className="h-48 rounded-t-lg"
                      style={{ 
                        background: `linear-gradient(135deg, ${material.color}, ${material.color}CC)` 
                      }}
                    />
                    
                    {/* Премиум бейдж */}
                    {material.isPremium && (
                      <Badge className="absolute top-2 left-2 bg-yellow-500 text-yellow-900">
                        Premium
                      </Badge>
                    )}
                    
                    {/* Кнопки действий */}
                    <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="w-8 h-8 p-0"
                        onClick={() => toggleLike(material.id)}
                      >
                        <Heart 
                          className={`w-4 h-4 ${
                            likedMaterials.includes(material.id) 
                              ? 'fill-red-500 text-red-500' 
                              : ''
                          }`} 
                        />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="w-8 h-8 p-0"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg line-clamp-1">{material.name}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {material.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pt-0">
                    {/* Теги */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {material.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Свойства */}
                    <div className="grid grid-cols-3 gap-2 text-xs text-gray-500 dark:text-gray-400 mb-3">
                      <div>Шерох: {material.properties.roughness}</div>
                      <div>Металл: {material.properties.metalness}</div>
                      <div>Прозр: {material.properties.opacity}</div>
                    </div>

                    {/* Статистика и кнопка */}
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <span>{material.downloads} скач.</span>
                      <span>{material.likes} ♥</span>
                    </div>
                    
                    <Button 
                      className="w-full" 
                      onClick={() => handleDownload(material)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Скачать
                    </Button>
                  </CardContent>
                </>
              ) : (
                /* Список вид */
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div 
                      className="w-16 h-16 rounded-lg flex-shrink-0"
                      style={{ backgroundColor: material.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold truncate">{material.name}</h3>
                        {material.isPremium && (
                          <Badge className="bg-yellow-500 text-yellow-900">Premium</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                        {material.description}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {material.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-center">
                        <div className="text-sm font-medium">{material.downloads}</div>
                        <div className="text-xs text-gray-500">скач.</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium">{material.likes}</div>
                        <div className="text-xs text-gray-500">♥</div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleDownload(material)}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Скачать
                      </Button>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Пустое состояние */}
        {filteredMaterials.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Материалы не найдены</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Попробуйте изменить поисковый запрос или выбрать другую категорию
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
