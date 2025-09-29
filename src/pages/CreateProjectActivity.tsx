
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ActivityForm from '@/components/project/activity/ActivityForm';
import { useProjectContext } from '@/context/project/ProjectContext';
import { ProjectActivity, Project } from '@/types/project';
import { useToast } from '@/hooks/toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const CreateProjectActivity = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { getProjectById, updateProject, fetchProjects, projects, loading } = useProjectContext();
  const { toast } = useToast();
  const [project, setProject] = useState<Project | undefined>(undefined);
  
  useEffect(() => {
    if (projectId) {
      const foundProject = getProjectById(projectId);
      setProject(foundProject);
      
      if (!foundProject) {
        fetchProjects().then(() => {
          setProject(getProjectById(projectId));
        });
      }
    }
  }, [projectId, getProjectById, fetchProjects]);
  
  if (loading && !project) {
    return <div>Loading...</div>;
  }
  
  if (!project && !loading) {
    return (
      <Alert>
        <AlertTitle>Project Not Found</AlertTitle>
        <AlertDescription>
          The project you are trying to add an activity to does not exist or has been removed.
          <div className="mt-4">
            <Button variant="outline" onClick={() => navigate('/projects')}>
              Back to Projects
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  const handleSubmit = async (activity: ProjectActivity) => {
    if (!project) return;
    
    // Update the project with the new activity
    const updatedProject = {
      ...project,
      activities: [...project.activities, activity]
    };
    
    await updateProject(updatedProject);
    toast({
      title: "Activity Created",
      description: "The activity has been added to the project successfully.",
      variant: "success",
    });
    navigate(`/projects/${projectId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(`/projects/${projectId}`)}
          className="hover:bg-muted"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Create New Activity</h1>
          <p className="text-muted-foreground">
            Add a new activity to the project: {project?.name}
          </p>
        </div>
      </div>

      <ActivityForm 
        projectId={projectId} 
        onSubmit={handleSubmit} 
      />
    </div>
  );
};

export default CreateProjectActivity;
