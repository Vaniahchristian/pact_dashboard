
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Archive, Trash2 } from 'lucide-react';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { MMPFile } from '@/types';

interface MMPFileManagementProps {
  mmpFile: MMPFile;
  canArchive: boolean;
  canDelete: boolean;
  onArchive: () => void;
  onDelete: () => void;
  onResetApproval: () => void;
}

const MMPFileManagement = ({ 
  mmpFile, 
  canArchive, 
  canDelete, 
  onArchive, 
  onDelete, 
  onResetApproval 
}: MMPFileManagementProps) => {
  const isApproved = mmpFile.status === 'approved';
  const isRejected = mmpFile.status === 'rejected';

  return (
    <Card className="border-l-4 border-l-gray-300">
      <CardHeader>
        <CardTitle className="text-gray-700">File Management</CardTitle>
        <CardDescription>
          Options for managing this MMP file
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4">
          {(isApproved || isRejected) && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="border-blue-200 hover:bg-blue-50 hover:text-blue-700">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset Approval Status
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset Approval Status?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will reset the MMP approval status to pending. Any current approvals will be removed.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onResetApproval}>Reset</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          
          {canArchive && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="border-yellow-200 hover:bg-yellow-50 hover:text-yellow-700">
                  <Archive className="h-4 w-4 mr-2" />
                  Archive MMP
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Archive MMP File?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will archive the MMP file and restrict further edits. Archived files can still be viewed but not modified.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onArchive}>Archive</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          
          {canDelete && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete MMP
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete MMP File?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. The MMP file will be permanently deleted from the system.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MMPFileManagement;
