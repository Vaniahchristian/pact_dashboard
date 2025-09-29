
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProjectContext } from '@/context/project/ProjectContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { TeamCompositionManager } from '@/components/project/team/TeamCompositionManager';
import { ProjectTeamMember, Project } from '@/types/project';
import { useToast } from '@/hooks/toast';

const ProjectTeamManagement = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { getProjectById, updateProject, fetchProjects, loading } = useProjectContext();
  const { toast } = useToast();
  const [project, setProject] = useState<Project | undefined>(projectId ? getProjectById(projectId) : undefined);
  
  useEffect(() => {
    if (projectId) {
      const projectData = getProjectById(projectId);
      setProject(projectData);
      
      if (!projectData) {
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
          The project you are trying to manage team members for does not exist or has been removed.
          <div className="mt-4">
            <Button variant="outline" onClick={() => navigate('/projects')}>
              Back to Projects
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  const handleTeamChange = async (teamMembers: ProjectTeamMember[]) => {
    if (!project) return;
    
    // Update the project with the new team composition
    const updatedProject = {
      ...project,
      team: {
        ...project.team,
        teamComposition: teamMembers
      }
    };
    
    await updateProject(updatedProject);
    toast({
      title: "Team Updated",
      description: "The project team has been updated successfully.",
      variant: "success",
    });
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
          <h1 className="text-2xl font-bold">Manage Team</h1>
          <p className="text-muted-foreground">
            Add or remove team members for project: {project?.name}
          </p>
        </div>
      </div>

      {project && (
        <TeamCompositionManager 
          project={project}
          onTeamChange={handleTeamChange}
        />
      )}
    </div>
  );
};

export default ProjectTeamManagement;
