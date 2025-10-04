import { useState, useEffect } from 'react';
import { AppRole } from '@/types/roles';
import { useToast } from '@/hooks/toast';
import { supabase } from '@/integrations/supabase/client';

export const useRoles = (userId?: string) => {
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (userId) {
      fetchRoles(userId);
    }
  }, [userId]);

  const fetchRoles = async (uid: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', uid);

      if (error) {
        throw error;
      }

      if (data) {
        const userRoles = data
          .map(item => item.role)
          .filter((r): r is AppRole => !!r);
        setRoles(userRoles);
      }
    } catch (error: any) {
      console.error('Error fetching roles:', error);
      toast({
        title: 'Error fetching roles',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const hasRole = (role: AppRole) => roles.includes(role);

  const addRole = async (userId: string, role: AppRole) => {
    try {
      setIsLoading(true);
      
      const { data, error: checkError } = await supabase
        .from('user_roles')
        .select('id')
        .eq('user_id', userId)
        .eq('role', role);
        
      const existingRole = data && data.length > 0;
      
      if (existingRole) {
        toast({
          title: 'Role already exists',
          description: `User already has the ${role} role.`,
        });
        return true;
      }

      if (checkError) throw checkError;

      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role });

      if (error) throw error;

      setRoles(prev => [...prev, role]);
      
      toast({
        title: 'Role added',
        description: `Successfully added ${role} role to the user.`,
      });
      
      return true;
    } catch (error: any) {
      console.error('Error adding role:', error);
      toast({
        title: 'Error adding role',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const removeRole = async (userId: string, role: AppRole) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .match({ user_id: userId, role: role });

      if (error) throw error;

      setRoles(prev => prev.filter(r => r !== role));
      
      toast({
        title: 'Role removed',
        description: `Successfully removed ${role} role from the user.`,
      });
      
      return true;
    } catch (error: any) {
      console.error('Error removing role:', error);
      toast({
        title: 'Error removing role',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    roles,
    isLoading,
    hasRole,
    addRole,
    removeRole
  };
};
