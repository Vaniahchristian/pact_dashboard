
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ClipboardList, ChevronLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import ProjectList from '@/components/project/ProjectList';
import { useProjectContext } from '@/context/project/ProjectContext';

const Projects = () => {
  const navigate = useNavigate();
  const { projects, loading } = useProjectContext();
  
  const handleViewProject = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-background to-muted p-6 rounded-lg shadow-sm">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
            className="hover:bg-background/50"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Projects
            </h1>
            <p className="text-muted-foreground">
              Manage project planning and activity management
            </p>
          </div>
        </div>
        <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300" onClick={() => navigate('/projects/create')}>
          <Plus className="h-4 w-4 mr-2" />
          Create Project
        </Button>
      </div>
      
      <ProjectList 
        projects={projects} 
        onViewProject={handleViewProject}
        loading={loading}
      />
    </div>
  );
};

export default Projects;
