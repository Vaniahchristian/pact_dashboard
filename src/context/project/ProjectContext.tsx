import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, ProjectActivity, SubActivity, ProjectTeamMember } from '@/types/project';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/toast';
import { validateProject } from '@/utils/projectValidation';
import { mapProjectToDbProject, mapDbProjectToProject } from '@/utils/projectMapping';

interface ProjectContextProps {
  projects: Project[];
  loading: boolean;
  error: string | null;
  currentProject: Project | null;
  setCurrentProject: (project: Project | null) => void;
  addProject: (project: Project) => Promise<void>;
  updateProject: (project: Project) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  getProjectById: (id: string) => Project | undefined;
  fetchProjects: () => Promise<void>;
}

const ProjectContext = createContext<ProjectContextProps>({
  projects: [],
  loading: false,
  error: null,
  currentProject: null,
  setCurrentProject: () => {},
  addProject: async () => {},
  updateProject: async () => {},
  deleteProject: async () => {},
  getProjectById: () => undefined,
  fetchProjects: async () => {},
});

export const useProjectContext = () => useContext(ProjectContext);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const { toast } = useToast();

  const mapDbProjectToProject = (dbProject: any): Project => {
    return {
      id: dbProject.id,
      name: dbProject.name,
      projectCode: dbProject.project_code,
      description: dbProject.description,
      projectType: dbProject.project_type,
      status: dbProject.status,
      startDate: dbProject.start_date,
      endDate: dbProject.end_date,
      budget: dbProject.budget,
      location: dbProject.location,
      team: dbProject.team,
      activities: [],
      createdAt: dbProject.created_at,
      updatedAt: dbProject.updated_at,
    };
  };

  const mapProjectToDbProject = (project: Project): any => {
    return {
      name: project.name,
      project_code: project.projectCode,
      description: project.description,
      project_type: project.projectType,
      status: project.status,
      start_date: project.startDate,
      end_date: project.endDate,
      budget: project.budget,
      location: project.location,
      team: project.team,
    };
  };

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*');
        
      if (projectsError) {
        throw new Error(projectsError.message);
      }
      
      const formattedProjects: Project[] = await Promise.all((projectsData || []).map(async (dbProject) => {
        const project = mapDbProjectToProject(dbProject);
        
        const { data: activitiesData, error: activitiesError } = await supabase
          .from('project_activities')
          .select('*')
          .eq('project_id', project.id);
          
        if (activitiesError) {
          console.error(`Error fetching activities for project ${project.id}:`, activitiesError);
          return project;
        }
        
        const activities: ProjectActivity[] = await Promise.all((activitiesData || []).map(async (dbActivity) => {
          const { data: subActivitiesData, error: subActivitiesError } = await supabase
            .from('sub_activities')
            .select('*')
            .eq('activity_id', dbActivity.id);
            
          if (subActivitiesError) {
            console.error(`Error fetching sub-activities for activity ${dbActivity.id}:`, subActivitiesError);
          }
          
          const subActivities: SubActivity[] = (subActivitiesData || []).map((dbSubActivity) => ({
            id: dbSubActivity.id,
            name: dbSubActivity.name,
            description: dbSubActivity.description,
            status: dbSubActivity.status,
            isActive: dbSubActivity.is_active,
            dueDate: dbSubActivity.due_date,
            assignedTo: dbSubActivity.assigned_to,
          }));
          
          return {
            id: dbActivity.id,
            name: dbActivity.name,
            description: dbActivity.description,
            startDate: dbActivity.start_date,
            endDate: dbActivity.end_date,
            status: dbActivity.status,
            isActive: dbActivity.is_active,
            assignedTo: dbActivity.assigned_to,
            subActivities: subActivities,
          };
        }));
        
        project.activities = activities;
        return project;
      }));
      
      setProjects(formattedProjects);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError(err instanceof Error ? err.message : 'Failed to fetch projects');
      toast({
        title: "Error",
        description: "Failed to fetch projects. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const addProject = async (project: Project) => {
    try {
      setLoading(true);
      setError(null);

      const validationResult = validateProject(project);
      if (!validationResult.success) {
        throw new Error(validationResult.errors?.join('\n'));
      }

      const dbProject = mapProjectToDbProject(project);
      const { data, error } = await supabase
        .from('projects')
        .insert(dbProject);
        
      if (error) {
        throw new Error(error.message);
      }
      
      await fetchProjects();
      
      toast({
        title: "Success",
        description: "Project created successfully!",
        variant: "success",
      });
    } catch (err) {
      console.error("Error adding project:", err);
      setError(err instanceof Error ? err.message : 'Failed to add project');
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to create project",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProject = async (updatedProject: Project) => {
    try {
      setLoading(true);
      setError(null);

      const validationResult = validateProject(updatedProject);
      if (!validationResult.success) {
        throw new Error(validationResult.errors?.join('\n'));
      }

      const dbProject = mapProjectToDbProject(updatedProject);
      const { error } = await supabase
        .from('projects')
        .update(dbProject)
        .eq('id', updatedProject.id);
        
      if (error) {
        throw new Error(error.message);
      }

      if (updatedProject.activities && updatedProject.activities.length > 0) {
        for (const activity of updatedProject.activities) {
          const dbActivity = {
            name: activity.name,
            description: activity.description,
            start_date: activity.startDate,
            end_date: activity.endDate,
            status: activity.status,
            is_active: activity.isActive,
            assigned_to: activity.assignedTo,
            project_id: updatedProject.id,
          };
          
          if (activity.id.startsWith('new-')) {
            await supabase.from('project_activities').insert(dbActivity);
          } else {
            await supabase
              .from('project_activities')
              .update(dbActivity)
              .eq('id', activity.id);
              
            if (activity.subActivities && activity.subActivities.length > 0) {
              for (const subActivity of activity.subActivities) {
                const dbSubActivity = {
                  name: subActivity.name,
                  description: subActivity.description,
                  status: subActivity.status,
                  is_active: subActivity.isActive,
                  due_date: subActivity.dueDate,
                  assigned_to: subActivity.assignedTo,
                  activity_id: activity.id,
                };
                
                if (subActivity.id.startsWith('new-')) {
                  await supabase.from('sub_activities').insert(dbSubActivity);
                } else {
                  await supabase
                    .from('sub_activities')
                    .update(dbSubActivity)
                    .eq('id', subActivity.id);
                }
              }
            }
          }
        }
      }
      
      await fetchProjects();
      
      if (currentProject?.id === updatedProject.id) {
        setCurrentProject(updatedProject);
      }
      
      toast({
        title: "Success",
        description: "Project updated successfully!",
        variant: "success",
      });
    } catch (err) {
      console.error("Error updating project:", err);
      setError(err instanceof Error ? err.message : 'Failed to update project');
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to update project",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw new Error(error.message);
      }
      
      setProjects(projects.filter(p => p.id !== id));
      
      if (currentProject?.id === id) {
        setCurrentProject(null);
      }
      
      toast({
        title: "Success",
        description: "Project deleted successfully!",
        variant: "success",
      });
    } catch (err) {
      console.error("Error deleting project:", err);
      setError(err instanceof Error ? err.message : 'Failed to delete project');
      toast({
        title: "Error",
        description: "Failed to delete project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getProjectById = (id: string): Project | undefined => {
    const projectInState = projects.find(p => p.id === id);
    if (projectInState) {
      return projectInState;
    }
    
    return undefined;
  };

  return (
    <ProjectContext.Provider 
      value={{
        projects,
        loading,
        error,
        currentProject,
        setCurrentProject,
        addProject,
        updateProject,
        deleteProject,
        getProjectById,
        fetchProjects,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
