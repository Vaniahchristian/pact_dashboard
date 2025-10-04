import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RoleWithPermissions, UpdateRoleRequest, RESOURCES, ACTIONS, ResourceType, ActionType } from '@/types/roles';

interface EditRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: RoleWithPermissions | null;
  onUpdateRole: (roleId: string, roleData: UpdateRoleRequest) => Promise<void>;
  isLoading: boolean;
}

export const EditRoleDialog: React.FC<EditRoleDialogProps> = ({
  open,
  onOpenChange,
  role,
  onUpdateRole,
  isLoading
}) => {
  const [formData, setFormData] = useState({
    display_name: '',
    description: '',
    is_active: true
  });

  const [selectedPermissions, setSelectedPermissions] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (role) {
      setFormData({
        display_name: role.display_name,
        description: role.description || '',
        is_active: role.is_active
      });

      // Set existing permissions
      const permissions: Record<string, boolean> = {};
      role.permissions.forEach(permission => {
        const key = `${permission.resource}:${permission.action}`;
        permissions[key] = true;
      });
      setSelectedPermissions(permissions);
    }
  }, [role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!role) return;

    const permissions = Object.entries(selectedPermissions)
      .filter(([_, selected]) => selected)
      .map(([key, _]) => {
        const [resource, action] = key.split(':');
        return { resource: resource as ResourceType, action: action as ActionType };
      });

    await onUpdateRole(role.id, {
      ...formData,
      permissions
    });

    onOpenChange(false);
  };

  const handlePermissionChange = (resource: ResourceType, action: ActionType, checked: boolean) => {
    const key = `${resource}:${action}`;
    setSelectedPermissions(prev => ({
      ...prev,
      [key]: checked
    }));
  };

  if (!role) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Role: {role.display_name}</DialogTitle>
          <DialogDescription>
            Update role information and permissions.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="display_name">Display Name</Label>
              <Input
                id="display_name"
                value={formData.display_name}
                onChange={(e) => setFormData(prev => ({ ...prev, display_name: e.target.value }))}
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
              />
              <Label htmlFor="is_active">Active</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          {!role.is_system_role && (
            <div className="space-y-4">
              <Label>Permissions</Label>
              <div className="grid gap-4">
                {RESOURCES.map(resource => (
                  <Card key={resource}>
                    <CardHeader className="py-3">
                      <CardTitle className="text-base capitalize">{resource}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {ACTIONS.map(action => (
                          <div key={`${resource}:${action}`} className="flex items-center space-x-2">
                            <Checkbox
                              id={`edit-${resource}:${action}`}
                              checked={selectedPermissions[`${resource}:${action}`] || false}
                              onCheckedChange={(checked) => 
                                handlePermissionChange(resource, action, checked as boolean)
                              }
                            />
                            <Label
                              htmlFor={`edit-${resource}:${action}`}
                              className="text-sm capitalize cursor-pointer"
                            >
                              {action}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Role'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};