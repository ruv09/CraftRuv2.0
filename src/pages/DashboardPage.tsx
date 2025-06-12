import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  MoreVertical,
  Edit,
  Copy,
  Trash2,
  Calendar,
  Clock,
  Share2,
  Download,
  Eye
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useProjects } from '../contexts/ProjectContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { projects, createProject, deleteProject, duplicateProject, isLoading } = useProjects();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');

  // Фильтрация проектов по поисковому запросу
  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;
    
    try {
      const project = await createProject(newProjectName, newProjectDescription);
      setIsCreateDialogOpen(false);
      setNewProjectName('');
      setNewProjectDescription('');
      navigate(`/editor/${project.id}`);
    } catch (error) {
      console.error('Ошибка создания проекта:', error);
    }
  };

  const handleOpenProject = (projectId: string) => {
    navigate(`/editor/${projectId}`);
  };

  const handleDuplicateProject = async (projectId: string) => {
    try {
      await duplicateProject(projectId);
    } catch (error) {
      console.error('Ошибка дублирования проекта:', error);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этот проект?')) {
      try {
        await deleteProject(projectId);
      } catch (error) {
        console.error('Ошибка удаления проекта:', error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Заголовок и статистика */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Добро пожаловать, {user?.name}!
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Управляйте своими проектами и создавайте новые идеи
              </p>
            </div>
            
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Новый проект
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Создать новый проект</DialogTitle>
                  <DialogDescription>
                    Дайте название и описание вашему новому проекту мебели
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Название проекта</Label>
                    <Input
                      id="name"
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                      placeholder="Мой новый проект"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Описание (опционально)</Label>
                    <Textarea
                      id="description"
                      value={newProjectDescription}
                      onChange={(e) => setNewProjectDescription(e.target.value)}
                      placeholder="Краткое описание проекта..."
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Отмена
                  </Button>
                  <Button
                    onClick={handleCreateProject}
                    disabled={!newProjectName.trim() || isLoading}
                  >
                    Создать проект
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Статистика */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
                    <Grid3X3 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{projects.length}</p>
                    <p className="text-gray-600 dark:text-gray-300">Проектов</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mr-4">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {projects.filter(p => {
                        const daysDiff = (Date.now() - new Date(p.updatedAt).getTime()) / (1000 * 60 * 60 * 24);
                        return daysDiff <= 7;
                      }).length}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">За неделю</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mr-4">
                    <Share2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {projects.filter(p => p.isPublic).length}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">Публичных</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mr-4">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {projects.length > 0 
                        ? formatDate(Math.max(...projects.map(p => new Date(p.updatedAt).getTime())).toString())
                        : 'Нет'
                      }
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">Последний</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Поиск и фильтры */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск проектов..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
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

        {/* Проекты */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Grid3X3 className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {searchQuery ? 'Проекты не найдены' : 'Нет проектов'}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {searchQuery 
                ? 'Попробуйте изменить поисковый запрос'
                : 'Создайте свой первый проект мебели'
              }
            </p>
            {!searchQuery && (
              <Button 
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Создать проект
              </Button>
            )}
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
          }>
            {filteredProjects.map((project) => (
              <Card key={project.id} className="group hover:shadow-lg transition-all duration-300">
                {viewMode === 'grid' ? (
                  <>
                    <div className="relative">
                      {/* Превью проекта */}
                      <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-t-lg flex items-center justify-center">
                        <Grid3X3 className="w-16 h-16 text-gray-400" />
                      </div>
                      
                      {/* Кнопки действий */}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="secondary" className="w-8 h-8 p-0">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleOpenProject(project.id)}>
                              <Eye className="w-4 h-4 mr-2" />
                              Открыть
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Переименовать
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDuplicateProject(project.id)}>
                              <Copy className="w-4 h-4 mr-2" />
                              Дублировать
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Share2 className="w-4 h-4 mr-2" />
                              Поделиться
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="w-4 h-4 mr-2" />
                              Экспорт
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteProject(project.id)}
                              className="text-red-600 dark:text-red-400"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Удалить
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg line-clamp-1">{project.name}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {project.description || 'Без описания'}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <span>Обновлен {formatDate(project.updatedAt)}</span>
                        {project.isPublic && (
                          <span className="text-green-600 dark:text-green-400">Публичный</span>
                        )}
                      </div>
                      
                      <Button 
                        className="w-full mt-4" 
                        onClick={() => handleOpenProject(project.id)}
                      >
                        Открыть проект
                      </Button>
                    </CardContent>
                  </>
                ) : (
                  /* Список вид */
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-lg flex items-center justify-center">
                          <Grid3X3 className="w-6 h-6 text-gray-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{project.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {project.description || 'Без описания'}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Обновлен {formatDate(project.updatedAt)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleOpenProject(project.id)}
                        >
                          Открыть
                        </Button>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="ghost" className="w-8 h-8 p-0">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Переименовать
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDuplicateProject(project.id)}>
                              <Copy className="w-4 h-4 mr-2" />
                              Дублировать
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteProject(project.id)}
                              className="text-red-600 dark:text-red-400"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Удалить
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
