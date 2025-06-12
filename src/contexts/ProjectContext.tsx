import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

export interface Project {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  isPublic: boolean;
  tags: string[];
  data: {
    furniture: any[];
    materials: any[];
    scene: any;
  };
}

interface ProjectContextType {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  createProject: (name: string, description?: string) => Promise<Project>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  openProject: (id: string) => void;
  closeProject: () => void;
  saveProject: () => Promise<void>;
  duplicateProject: (id: string) => Promise<Project>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects должен использоваться внутри ProjectProvider');
  }
  return context;
};

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Загрузка проектов пользователя
  useEffect(() => {
    if (user) {
      loadProjects();
    } else {
      setProjects([]);
      setCurrentProject(null);
    }
  }, [user]);

  const loadProjects = () => {
    if (!user) return;
    
    const allProjects = JSON.parse(localStorage.getItem('craftruv_projects') || '[]');
    const userProjects = allProjects.filter((p: Project) => p.userId === user.id);
    setProjects(userProjects);
  };

  const saveProjectsToStorage = (updatedProjects: Project[]) => {
    const allProjects = JSON.parse(localStorage.getItem('craftruv_projects') || '[]');
    const otherUsersProjects = allProjects.filter((p: Project) => p.userId !== user?.id);
    const newAllProjects = [...otherUsersProjects, ...updatedProjects];
    localStorage.setItem('craftruv_projects', JSON.stringify(newAllProjects));
  };

  const createProject = async (name: string, description: string = ''): Promise<Project> => {
    if (!user) throw new Error('Пользователь не авторизован');
    
    setIsLoading(true);
    try {
      const newProject: Project = {
        id: crypto.randomUUID(),
        name,
        description,
        thumbnail: '', // Будет генерироваться из 3D сцены
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: user.id,
        isPublic: false,
        tags: [],
        data: {
          furniture: [],
          materials: [],
          scene: {
            camera: { position: [0, 5, 10], target: [0, 0, 0] },
            lighting: { ambient: 0.4, directional: 0.8 },
            environment: 'studio'
          }
        }
      };

      const updatedProjects = [...projects, newProject];
      setProjects(updatedProjects);
      saveProjectsToStorage(updatedProjects);
      
      return newProject;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>): Promise<void> => {
    if (!user) throw new Error('Пользователь не авторизован');
    
    setIsLoading(true);
    try {
      const updatedProjects = projects.map(project => 
        project.id === id 
          ? { ...project, ...updates, updatedAt: new Date().toISOString() }
          : project
      );
      
      setProjects(updatedProjects);
      saveProjectsToStorage(updatedProjects);
      
      // Обновление текущего проекта, если он открыт
      if (currentProject && currentProject.id === id) {
        setCurrentProject({ ...currentProject, ...updates, updatedAt: new Date().toISOString() });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProject = async (id: string): Promise<void> => {
    if (!user) throw new Error('Пользователь не авторизован');
    
    setIsLoading(true);
    try {
      const updatedProjects = projects.filter(project => project.id !== id);
      setProjects(updatedProjects);
      saveProjectsToStorage(updatedProjects);
      
      // Закрытие проекта, если он был открыт
      if (currentProject && currentProject.id === id) {
        setCurrentProject(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const openProject = (id: string) => {
    const project = projects.find(p => p.id === id);
    if (project) {
      setCurrentProject(project);
    }
  };

  const closeProject = () => {
    setCurrentProject(null);
  };

  const saveProject = async (): Promise<void> => {
    if (!currentProject) return;
    await updateProject(currentProject.id, currentProject);
  };

  const duplicateProject = async (id: string): Promise<Project> => {
    if (!user) throw new Error('Пользователь не авторизован');
    
    const originalProject = projects.find(p => p.id === id);
    if (!originalProject) throw new Error('Проект не найден');
    
    const duplicatedProject: Project = {
      ...originalProject,
      id: crypto.randomUUID(),
      name: `${originalProject.name} (копия)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedProjects = [...projects, duplicatedProject];
    setProjects(updatedProjects);
    saveProjectsToStorage(updatedProjects);
    
    return duplicatedProject;
  };

  const value: ProjectContextType = {
    projects,
    currentProject,
    isLoading,
    createProject,
    updateProject,
    deleteProject,
    openProject,
    closeProject,
    saveProject,
    duplicateProject,
  };

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
};
