
import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { Card, CardContent } from '@/components/ui/card';
import { ShieldAlert } from 'lucide-react';

interface FieldTeamMapPermissionsProps {
  requiredAction: string;
  children: React.ReactNode;
}

/**
 * A component that checks if the current user has permission to perform a specific action.
 * If they don't have permission, it displays a "No Permission" message.
 */
const FieldTeamMapPermissions: React.FC<FieldTeamMapPermissionsProps> = ({ 
  requiredAction,
  children 
}) => {
  const { hasPermission, hasRole } = useAppContext();
  
  // Check for specific verification permissions or admin/verification roles
  const canAccess = hasPermission(requiredAction) || 
                   hasRole('admin') || 
                   hasRole('ict') ||
                   hasRole('fom') || 
                   hasRole('supervisor');
  
  if (!canAccess) {
    return (
      <Card className="border-dashed border-red-300">
        <CardContent className="p-6 text-center">
          <div className="flex flex-col items-center gap-2">
            <ShieldAlert className="h-10 w-10 text-red-500" />
            <h3 className="text-lg font-medium">Access Denied</h3>
            <p className="text-muted-foreground">
              You don't have permission to {requiredAction.replace('_', ' ')}.
              Please contact your administrator for access.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return <>{children}</>;
};

export default FieldTeamMapPermissions;
