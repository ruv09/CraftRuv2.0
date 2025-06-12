import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Save, 
  Undo, 
  Redo, 
  Play, 
  Pause,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Grid3X3,
  Layers,
  Settings,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Move3D,
  RotateCw,
  Scale,
  ArrowLeft
} from 'lucide-react';
import { useProjects } from '../contexts/ProjectContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Slider } from '../components/ui/slider';
import { Label } from '../components/ui/label';
import { ThreeCanvas } from '../components/3d/ThreeCanvas';
import { AssistantRUV } from '../components/AssistantRUV';

interface Tool {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  shortcut: string;
}

interface Material {
  id: string;
  name: string;
  color: string;
  texture?: string;
  metalness: number;
  roughness: number;
}

export const EditorPage: React.FC = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { currentProject, openProject, saveProject, projects } = useProjects();
  
  const [activeTool, setActiveTool] = useState('select');
  const [isPlaying, setIsPlaying] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [selectedObject, setSelectedObject] = useState<string | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [leftPanelWidth, setLeftPanelWidth] = useState(300);
  const [rightPanelWidth, setRightPanelWidth] = useState(300);

  // Загрузка проекта при монтировании
  useEffect(() => {
    if (projectId && !currentProject) {
      const project = projects.find(p => p.id === projectId);
      if (project) {
        openProject(projectId);
      } else {
        navigate('/dashboard');
      }
    }
  }, [projectId, currentProject, projects, openProject, navigate]);

  const tools: Tool[] = [
    { id: 'select', name: 'Выбрать', icon: Move3D, shortcut: 'V' },
    { id: 'move', name: 'Переместить', icon: Move3D, shortcut: 'G' },
    { id: 'rotate', name: 'Повернуть', icon: RotateCw, shortcut: 'R' },
    { id: 'scale', name: 'Масштаб', icon: Scale, shortcut: 'S' },
  ];

  const furniture = [
    { id: 'chair', name: 'Стул', category: 'Мебель' },
    { id: 'table', name: 'Стол', category: 'Мебель' },
    { id: 'sofa', name: 'Диван', category: 'Мебель' },
    { id: 'cabinet', name: 'Шкаф', category: 'Мебель' },
    { id: 'bookshelf', name: 'Книжная полка', category: 'Мебель' },
    { id: 'coffee-table', name: 'Журнальный столик', category: 'Мебель' },
  ];

  const materials: Material[] = [
    { id: 'wood-oak', name: 'Дуб', color: '#D2B48C', metalness: 0, roughness: 0.8 },
    { id: 'wood-pine', name: 'Сосна', color: '#F5DEB3', metalness: 0, roughness: 0.7 },
    { id: 'metal-steel', name: 'Сталь', color: '#C0C0C0', metalness: 1, roughness: 0.2 },
    { id: 'fabric-cotton', name: 'Хлопок', color: '#F0F8FF', metalness: 0, roughness: 0.9 },
    { id: 'glass-clear', name: 'Стекло прозрачное', color: '#F0F8FF', metalness: 0, roughness: 0.05 },
    { id: 'ceramic-white', name: 'Керамика белая', color: '#FFFEF7', metalness: 0, roughness: 0.3 },
    { id: 'plastic-black', name: 'Пластик чёрный', color: '#1C1C1C', metalness: 0, roughness: 0.1 },
  ];

  const handleSave = async () => {
    if (currentProject) {
      try {
        await saveProject();
        // Показать уведомление об успешном сохранении
      } catch (error) {
        console.error('Ошибка сохранения:', error);
      }
    }
  };

  const handleAddFurniture = (furnitureId: string) => {
    // Добавление мебели в сцену
    console.log('Добавление мебели:', furnitureId);
  };

  const handleToolChange = (toolId: string) => {
    setActiveTool(toolId);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Верхняя панель инструментов */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад
            </Button>
            
            <Separator orientation="vertical" className="h-6" />
            
            <h1 className="text-lg font-semibold">
              {currentProject?.name || 'Загрузка...'}
            </h1>
          </div>

          <div className="flex items-center space-x-2">
            {/* Инструменты */}
            <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              {tools.map((tool) => (
                <Button
                  key={tool.id}
                  variant={activeTool === tool.id ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => handleToolChange(tool.id)}
                  title={`${tool.name} (${tool.shortcut})`}
                  className="w-8 h-8 p-0"
                >
                  <tool.icon className="w-4 h-4" />
                </Button>
              ))}
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Кнопки действий */}
            <Button variant="ghost" size="sm" disabled>
              <Undo className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" disabled>
              <Redo className="w-4 h-4" />
            </Button>

            <Separator orientation="vertical" className="h-6" />

            {/* Воспроизведение */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </Button>

            <Separator orientation="vertical" className="h-6" />

            {/* Настройки вида */}
            <Button
              variant={showGrid ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setShowGrid(!showGrid)}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>

            <Button variant="ghost" size="sm">
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-sm font-mono w-12 text-center">{zoom}%</span>
            <Button variant="ghost" size="sm">
              <ZoomIn className="w-4 h-4" />
            </Button>

            <Separator orientation="vertical" className="h-6" />

            {/* Сохранение */}
            <Button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              Сохранить
            </Button>
          </div>
        </div>
      </header>

      {/* Основная область */}
      <div className="flex-1 flex overflow-hidden">
        {/* Левая панель */}
        <div
          className="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col"
          style={{ width: leftPanelWidth }}
        >
          <Tabs defaultValue="objects" className="flex-1 flex flex-col">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="objects">Объекты</TabsTrigger>
              <TabsTrigger value="materials">Материалы</TabsTrigger>
              <TabsTrigger value="layers">Слои</TabsTrigger>
            </TabsList>
            
            <TabsContent value="objects" className="flex-1 p-4 space-y-4">
              <div>
                <h3 className="font-semibold mb-3">Добавить мебель</h3>
                <div className="space-y-2">
                  {furniture.map((item) => (
                    <Button
                      key={item.id}
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleAddFurniture(item.id)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      {item.name}
                    </Button>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold mb-3">Объекты сцены</h3>
                <div className="space-y-1">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Объекты будут отображаться здесь
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="materials" className="flex-1 p-4 space-y-4">
              <h3 className="font-semibold mb-3">Библиотека материалов</h3>
              <div className="grid grid-cols-2 gap-2">
                {materials.map((material) => (
                  <Button
                    key={material.id}
                    variant="outline"
                    className="h-16 flex flex-col p-2"
                  >
                    <div
                      className="w-8 h-8 rounded mb-1"
                      style={{ backgroundColor: material.color }}
                    />
                    <span className="text-xs">{material.name}</span>
                  </Button>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="layers" className="flex-1 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Слои</h3>
                <Button size="sm" variant="ghost">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                  <Eye className="w-4 h-4" />
                  <span className="flex-1 text-sm">Основной слой</span>
                  <Button size="sm" variant="ghost" className="w-6 h-6 p-0">
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* 3D Холст */}
        <div className="flex-1 relative bg-gray-100 dark:bg-gray-700">
          <ThreeCanvas
            showGrid={showGrid}
            zoom={zoom}
            selectedObject={selectedObject}
            onObjectSelect={setSelectedObject}
          />
          
          {/* Оверлей информации */}
          <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-2 rounded text-sm">
            3D Редактор CraftRuv
          </div>
          
          {/* Элементы управления камерой */}
          <div className="absolute bottom-4 left-4 space-y-2">
            <Button size="sm" variant="secondary">
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Правая панель */}
        <div
          className="bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700"
          style={{ width: rightPanelWidth }}
        >
          <div className="p-4">
            <h3 className="font-semibold mb-4">Свойства</h3>
            
            {selectedObject ? (
              <div className="space-y-4">
                <div>
                  <Label>Позиция X</Label>
                  <Slider
                    defaultValue={[0]}
                    max={10}
                    min={-10}
                    step={0.1}
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label>Позиция Y</Label>
                  <Slider
                    defaultValue={[0]}
                    max={10}
                    min={-10}
                    step={0.1}
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label>Позиция Z</Label>
                  <Slider
                    defaultValue={[0]}
                    max={10}
                    min={-10}
                    step={0.1}
                    className="mt-2"
                  />
                </div>
                
                <Separator />
                
                <div>
                  <Label>Поворот X</Label>
                  <Slider
                    defaultValue={[0]}
                    max={360}
                    min={0}
                    step={1}
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label>Масштаб</Label>
                  <Slider
                    defaultValue={[1]}
                    max={3}
                    min={0.1}
                    step={0.1}
                    className="mt-2"
                  />
                </div>
              </div>
            ) : (
              <div className="text-gray-500 dark:text-gray-400 text-sm">
                Выберите объект для редактирования свойств
              </div>
            )}
          </div>
        </div>
      </div>
      <AssistantRUV />
    </div>
  );
};
