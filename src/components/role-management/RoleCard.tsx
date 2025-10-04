import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit2, Trash2, Users } from 'lucide-react';
import { RoleWithPermissions } from '@/types/roles';

interface RoleCardProps {
  role: RoleWithPermissions;
  onEdit: (role: RoleWithPermissions) => void;
  onDelete: (roleId: string) => void;
  onViewUsers: (role: RoleWithPermissions) => void;
  userCount?: number;
}

export const RoleCard: React.FC<RoleCardProps> = ({
  role,
  onEdit,
  onDelete,
  onViewUsers,
  userCount = 0
}) => {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base font-medium">
            {role.display_name}
            {role.is_system_role && (
              <Badge variant="secondary" className="ml-2 text-xs">
                System
              </Badge>
            )}
          </CardTitle>
          <CardDescription className="text-sm text-gray-500">
            {role.description || 'No description provided'}
          </CardDescription>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onViewUsers(role)}>
              <Users className="mr-2 h-4 w-4" />
              View Users ({userCount})
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(role)}>
              <Edit2 className="mr-2 h-4 w-4" />
              Edit Role
            </DropdownMenuItem>
            {!role.is_system_role && (
              <DropdownMenuItem 
                onClick={() => onDelete(role.id)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Role
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Permissions:</span>
            <span className="font-medium">{role.permissions.length}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Users assigned:</span>
            <span className="font-medium">{userCount}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Status:</span>
            <Badge variant={role.is_active ? "default" : "secondary"}>
              {role.is_active ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};