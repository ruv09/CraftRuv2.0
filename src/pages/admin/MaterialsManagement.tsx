import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2, Upload } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

interface Material {
  id: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  properties: {
    roughness: number;
    metalness: number;
    normalScale: number;
  };
  tags: string[];
  isActive: boolean;
  createdAt: string;
}

const MaterialsManagement: React.FC = () => {
  const [materials, setMaterials] = useState<Material[]>([
    {
      id: '1',
      name: 'Дуб натуральный',
      category: 'wood',
      description: 'Натуральная текстура дуба высокого качества',
      imageUrl: '/images/materials/oak-texture.jpg',
      properties: { roughness: 0.8, metalness: 0.0, normalScale: 1.0 },
      tags: ['натуральный', 'дерево', 'классический'],
      isActive: true,
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Мрамор каррарский',
      category: 'stone',
      description: 'Белый мрамор с характерными прожилками',
      imageUrl: '/images/materials/marble-texture.jpg',
      properties: { roughness: 0.1, metalness: 0.0, normalScale: 0.5 },
      tags: ['мрамор', 'премиум', 'белый'],
      isActive: true,
      createdAt: '2024-01-10'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);

  const [newMaterial, setNewMaterial] = useState({
    name: '',
    category: '',
    description: '',
    imageFile: null as File | null,
    properties: { roughness: 0.5, metalness: 0.0, normalScale: 1.0 },
    tags: ''
  });

  const categories = [
    { value: 'all', label: 'Все категории' },
    { value: 'wood', label: 'Дерево' },
    { value: 'stone', label: 'Камень' },
    { value: 'metal', label: 'Металл' },
    { value: 'fabric', label: 'Ткань' },
    { value: 'plastic', label: 'Пластик' }
  ];

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || material.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setNewMaterial(prev => ({ ...prev, imageFile: acceptedFiles[0] }));
      }
    }
  });

  const handleCreateMaterial = () => {
    if (!newMaterial.name || !newMaterial.category || !newMaterial.imageFile) return;

    const material: Material = {
      id: crypto.randomUUID(),
      name: newMaterial.name,
      category: newMaterial.category,
      description: newMaterial.description,
      imageUrl: URL.createObjectURL(newMaterial.imageFile),
      properties: newMaterial.properties,
      tags: newMaterial.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setMaterials(prev => [...prev, material]);
    setNewMaterial({
      name: '',
      category: '',
      description: '',
      imageFile: null,
      properties: { roughness: 0.5, metalness: 0.0, normalScale: 1.0 },
      tags: ''
    });
    setIsCreateDialogOpen(false);
  };

  const handleDeleteMaterial = (id: string) => {
    setMaterials(prev => prev.filter(material => material.id !== id));
  };

  const toggleMaterialStatus = (id: string) => {
    setMaterials(prev => prev.map(material => 
      material.id === id ? { ...material, isActive: !material.isActive } : material
    ));
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Управление материалами</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Добавить материал
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Добавить новый материал</DialogTitle>
              <DialogDescription>
                Создайте новый материал для библиотеки
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Название</Label>
                <Input
                  id="name"
                  value={newMaterial.name}
                  onChange={(e) => setNewMaterial(prev => ({ ...prev, name: e.target.value }))}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">Категория</Label>
                <Select onValueChange={(value) => setNewMaterial(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Выберите категорию" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wood">Дерево</SelectItem>
                    <SelectItem value="stone">Камень</SelectItem>
                    <SelectItem value="metal">Металл</SelectItem>
                    <SelectItem value="fabric">Ткань</SelectItem>
                    <SelectItem value="plastic">Пластик</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Описание</Label>
                <Textarea
                  id="description"
                  value={newMaterial.description}
                  onChange={(e) => setNewMaterial(prev => ({ ...prev, description: e.target.value }))}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Изображение</Label>
                <div {...getRootProps()} className="col-span-3 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400">
                  <input {...getInputProps()} />
                  {newMaterial.imageFile ? (
                    <div>
                      <Upload className="mx-auto h-8 w-8 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">
                        Выбран: {newMaterial.imageFile.name}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <Upload className="mx-auto h-8 w-8 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">
                        {isDragActive ? 'Отпустите файлы здесь' : 'Перетащите изображение или нажмите для выбора'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tags" className="text-right">Теги</Label>
                <Input
                  id="tags"
                  value={newMaterial.tags}
                  onChange={(e) => setNewMaterial(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="тег1, тег2, тег3"
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleCreateMaterial}>
                Создать материал
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск материалов..."
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
        {filteredMaterials.map((material) => (
          <Card key={material.id} className="overflow-hidden">
            <div className="aspect-square relative">
              <img
                src={material.imageUrl}
                alt={material.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/placeholders/material-placeholder.webp';
                }}
              />
              <div className="absolute top-2 right-2">
                <Badge variant={material.isActive ? 'default' : 'secondary'}>
                  {material.isActive ? 'Активен' : 'Неактивен'}
                </Badge>
              </div>
            </div>
            <CardHeader className="p-4">
              <CardTitle className="text-lg">{material.name}</CardTitle>
              <CardDescription className="text-sm">
                {material.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex flex-wrap gap-1 mb-3">
                {material.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {categories.find(c => c.value === material.category)?.label}
                </span>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleMaterialStatus(material.id)}
                  >
                    {material.isActive ? 'Деактивировать' : 'Активировать'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingMaterial(material)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteMaterial(material.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMaterials.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Материалы не найдены</p>
        </div>
      )}
    </div>
  );
};

export default MaterialsManagement;
