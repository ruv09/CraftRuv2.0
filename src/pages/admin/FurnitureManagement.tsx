import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2, Upload, Box } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

interface FurnitureItem {
  id: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  modelUrl: string;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  materials: string[];
  tags: string[];
  price?: number;
  isActive: boolean;
  createdAt: string;
}

const FurnitureManagement: React.FC = () => {
  const [furniture, setFurniture] = useState<FurnitureItem[]>([
    {
      id: '1',
      name: 'Современный диван',
      category: 'seating',
      description: 'Элегантный трехместный диван в современном стиле',
      imageUrl: '/images/furniture/modern-sofa.jpeg',
      modelUrl: '/models/sofa.glb',
      dimensions: { width: 220, height: 85, depth: 95 },
      materials: ['fabric', 'wood'],
      tags: ['современный', 'диван', 'гостиная'],
      price: 1299.99,
      isActive: true,
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Обеденный стол',
      category: 'tables',
      description: 'Круглый обеденный стол из массива дуба',
      imageUrl: '/images/furniture/dining-table.jpg',
      modelUrl: '/models/table.glb',
      dimensions: { width: 120, height: 75, depth: 120 },
      materials: ['wood'],
      tags: ['стол', 'дуб', 'обеденная'],
      price: 899.99,
      isActive: true,
      createdAt: '2024-01-10'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const [newFurniture, setNewFurniture] = useState({
    name: '',
    category: '',
    description: '',
    imageFile: null as File | null,
    modelFile: null as File | null,
    dimensions: { width: 0, height: 0, depth: 0 },
    materials: '',
    tags: '',
    price: 0
  });

  const categories = [
    { value: 'all', label: 'Все категории' },
    { value: 'seating', label: 'Мягкая мебель' },
    { value: 'tables', label: 'Столы' },
    { value: 'storage', label: 'Системы хранения' },
    { value: 'lighting', label: 'Освещение' },
    { value: 'decoration', label: 'Декор' }
  ];

  const availableMaterials = [
    'wood', 'metal', 'fabric', 'leather', 'glass', 'plastic'
  ];

  const filteredFurniture = furniture.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const { 
    getRootProps: getImageRootProps, 
    getInputProps: getImageInputProps, 
    isDragActive: isImageDragActive 
  } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setNewFurniture(prev => ({ ...prev, imageFile: acceptedFiles[0] }));
      }
    }
  });

  const { 
    getRootProps: getModelRootProps, 
    getInputProps: getModelInputProps, 
    isDragActive: isModelDragActive 
  } = useDropzone({
    accept: {
      'model/gltf-binary': ['.glb'],
      'model/gltf+json': ['.gltf'],
      'application/octet-stream': ['.obj']
    },
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setNewFurniture(prev => ({ ...prev, modelFile: acceptedFiles[0] }));
      }
    }
  });

  const handleCreateFurniture = () => {
    if (!newFurniture.name || !newFurniture.category || !newFurniture.imageFile || !newFurniture.modelFile) return;

    const furnitureItem: FurnitureItem = {
      id: crypto.randomUUID(),
      name: newFurniture.name,
      category: newFurniture.category,
      description: newFurniture.description,
      imageUrl: URL.createObjectURL(newFurniture.imageFile),
      modelUrl: URL.createObjectURL(newFurniture.modelFile),
      dimensions: newFurniture.dimensions,
      materials: newFurniture.materials.split(',').map(m => m.trim()).filter(Boolean),
      tags: newFurniture.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      price: newFurniture.price || undefined,
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setFurniture(prev => [...prev, furnitureItem]);
    setNewFurniture({
      name: '',
      category: '',
      description: '',
      imageFile: null,
      modelFile: null,
      dimensions: { width: 0, height: 0, depth: 0 },
      materials: '',
      tags: '',
      price: 0
    });
    setIsCreateDialogOpen(false);
  };

  const handleDeleteFurniture = (id: string) => {
    setFurniture(prev => prev.filter(item => item.id !== id));
  };

  const toggleFurnitureStatus = (id: string) => {
    setFurniture(prev => prev.map(item => 
      item.id === id ? { ...item, isActive: !item.isActive } : item
    ));
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Управление мебелью</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Добавить мебель
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Добавить новую мебель</DialogTitle>
              <DialogDescription>
                Создайте новый предмет мебели для каталога
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Название</Label>
                <Input
                  id="name"
                  value={newFurniture.name}
                  onChange={(e) => setNewFurniture(prev => ({ ...prev, name: e.target.value }))}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">Категория</Label>
                <Select onValueChange={(value) => setNewFurniture(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Выберите категорию" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="seating">Мягкая мебель</SelectItem>
                    <SelectItem value="tables">Столы</SelectItem>
                    <SelectItem value="storage">Системы хранения</SelectItem>
                    <SelectItem value="lighting">Освещение</SelectItem>
                    <SelectItem value="decoration">Декор</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Описание</Label>
                <Textarea
                  id="description"
                  value={newFurniture.description}
                  onChange={(e) => setNewFurniture(prev => ({ ...prev, description: e.target.value }))}
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Изображение</Label>
                <div {...getImageRootProps()} className="col-span-3 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400">
                  <input {...getImageInputProps()} />
                  {newFurniture.imageFile ? (
                    <div>
                      <Upload className="mx-auto h-6 w-6 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">
                        Выбрано: {newFurniture.imageFile.name}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <Upload className="mx-auto h-6 w-6 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">
                        {isImageDragActive ? 'Отпустите изображение здесь' : 'Перетащите изображение или нажмите'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">3D модель</Label>
                <div {...getModelRootProps()} className="col-span-3 border-2 border-dashed border-blue-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-400">
                  <input {...getModelInputProps()} />
                  {newFurniture.modelFile ? (
                    <div>
                      <Box className="mx-auto h-6 w-6 text-blue-400" />
                      <p className="mt-2 text-sm text-blue-600">
                        Выбрана: {newFurniture.modelFile.name}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <Box className="mx-auto h-6 w-6 text-blue-400" />
                      <p className="mt-2 text-sm text-blue-600">
                        {isModelDragActive ? 'Отпустите 3D модель здесь' : 'Перетащите .glb/.gltf/.obj файл'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Размеры (см)</Label>
                <div className="col-span-3 grid grid-cols-3 gap-2">
                  <div>
                    <Label htmlFor="width" className="text-xs">Ширина</Label>
                    <Input
                      id="width"
                      type="number"
                      value={newFurniture.dimensions.width || ''}
                      onChange={(e) => setNewFurniture(prev => ({ 
                        ...prev, 
                        dimensions: { ...prev.dimensions, width: Number(e.target.value) }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="height" className="text-xs">Высота</Label>
                    <Input
                      id="height"
                      type="number"
                      value={newFurniture.dimensions.height || ''}
                      onChange={(e) => setNewFurniture(prev => ({ 
                        ...prev, 
                        dimensions: { ...prev.dimensions, height: Number(e.target.value) }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="depth" className="text-xs">Глубина</Label>
                    <Input
                      id="depth"
                      type="number"
                      value={newFurniture.dimensions.depth || ''}
                      onChange={(e) => setNewFurniture(prev => ({ 
                        ...prev, 
                        dimensions: { ...prev.dimensions, depth: Number(e.target.value) }
                      }))}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="materials" className="text-right">Материалы</Label>
                <Input
                  id="materials"
                  value={newFurniture.materials}
                  onChange={(e) => setNewFurniture(prev => ({ ...prev, materials: e.target.value }))}
                  placeholder="дерево, металл, ткань"
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">Цена ($)</Label>
                <Input
                  id="price"
                  type="number"
                  value={newFurniture.price || ''}
                  onChange={(e) => setNewFurniture(prev => ({ ...prev, price: Number(e.target.value) }))}
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tags" className="text-right">Теги</Label>
                <Input
                  id="tags"
                  value={newFurniture.tags}
                  onChange={(e) => setNewFurniture(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="тег1, тег2, тег3"
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleCreateFurniture}>
                Создать мебель
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск мебели..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredFurniture.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <div className="aspect-square relative">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/placeholders/furniture-placeholder.jpg';
                }}
              />
              <div className="absolute top-2 right-2">
                <Badge variant={item.isActive ? 'default' : 'secondary'}>
                  {item.isActive ? 'Активна' : 'Неактивна'}
                </Badge>
              </div>
            </div>
            <CardHeader className="p-4">
              <CardTitle className="text-lg">{item.name}</CardTitle>
              <CardDescription className="text-sm">
                {item.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Размеры: {item.dimensions.width}×{item.dimensions.height}×{item.dimensions.depth} см
                  </p>
                  {item.price && (
                    <p className="text-sm font-semibold text-green-600">
                      ${item.price}
                    </p>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {item.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {categories.find(c => c.value === item.category)?.label}
                  </span>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleFurnitureStatus(item.id)}
                    >
                      {item.isActive ? 'Деактивировать' : 'Активировать'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteFurniture(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredFurniture.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Мебель не найдена</p>
        </div>
      )}
    </div>
  );
};

export default FurnitureManagement;
