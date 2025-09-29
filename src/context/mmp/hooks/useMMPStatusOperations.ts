
import { MMPFile } from '@/types';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const useMMPStatusOperations = (setMMPFiles: React.Dispatch<React.SetStateAction<MMPFile[]>>) => {
  const archiveMMP = (id: string, archivedBy: string) => {
    try {
      // Update local state
      setMMPFiles((prev: MMPFile[]) =>
        (prev || []).map((mmp) => {
          if (mmp.id === id) {
            return {
              ...mmp,
              status: 'archived',
              archivedBy,
              archivedAt: new Date().toISOString(),
            };
          }
          return mmp;
        })
      );
      
      // Update database via Supabase (if connected)
      try {
        supabase
          .from('mmp_files')
          .update({ 
            status: 'archived', 
            archivedby: archivedBy, 
            archivedat: new Date().toISOString() 
          })
          .eq('id', id)
          .then(({ error }) => {
            if (error) {
              console.error('Supabase archive error:', error);
              toast.error('Database update failed, using local storage');
              // Fall back to local storage
              const existingFiles = JSON.parse(localStorage.getItem('mock_mmp_files') || '[]');
              const updatedFiles = existingFiles.map((mmp: MMPFile) => {
                if (mmp.id === id) {
                  return {
                    ...mmp,
                    status: 'archived',
                    archivedBy,
                    archivedAt: new Date().toISOString(),
                  };
                }
                return mmp;
              });
              localStorage.setItem('mock_mmp_files', JSON.stringify(updatedFiles));
            } else {
              toast.success('MMP file archived successfully');
            }
          });
      } catch (dbError) {
        console.error('Database operation failed:', dbError);
        toast.error('Database operation failed, using local storage');
        // Fall back to local storage
        const existingFiles = JSON.parse(localStorage.getItem('mock_mmp_files') || '[]');
        const updatedFiles = existingFiles.map((mmp: MMPFile) => {
          if (mmp.id === id) {
            return {
              ...mmp,
              status: 'archived',
              archivedBy,
              archivedAt: new Date().toISOString(),
            };
          }
          return mmp;
        });
        localStorage.setItem('mock_mmp_files', JSON.stringify(updatedFiles));
      }
    } catch (error) {
      console.error('Error archiving MMP file:', error);
      toast.error('Failed to archive MMP file');
    }
  };

  const approveMMP = (id: string, approvedBy: string) => {
    try {
      // Update local state
      setMMPFiles((prev: MMPFile[]) =>
        (prev || []).map((mmp) => {
          if (mmp.id === id) {
            return {
              ...mmp,
              status: 'approved',
              approvedBy,
              approvedAt: new Date().toISOString(),
            };
          }
          return mmp;
        })
      );
      
      // Update database via Supabase (if connected)
      try {
        supabase
          .from('mmp_files')
          .update({ 
            status: 'approved', 
            approvedby: approvedBy, 
            approvedat: new Date().toISOString() 
          })
          .eq('id', id)
          .then(({ error }) => {
            if (error) {
              console.error('Supabase approve error:', error);
              toast.error('Database update failed, using local storage');
              // Fall back to local storage
              const existingFiles = JSON.parse(localStorage.getItem('mock_mmp_files') || '[]');
              const updatedFiles = existingFiles.map((mmp: MMPFile) => {
                if (mmp.id === id) {
                  return {
                    ...mmp,
                    status: 'approved',
                    approvedBy,
                    approvedAt: new Date().toISOString(),
                  };
                }
                return mmp;
              });
              localStorage.setItem('mock_mmp_files', JSON.stringify(updatedFiles));
            } else {
              toast.success('MMP file approved successfully');
            }
          });
      } catch (dbError) {
        console.error('Database operation failed:', dbError);
        toast.error('Database operation failed, using local storage');
        // Fall back to local storage
        const existingFiles = JSON.parse(localStorage.getItem('mock_mmp_files') || '[]');
        const updatedFiles = existingFiles.map((mmp: MMPFile) => {
          if (mmp.id === id) {
            return {
              ...mmp,
              status: 'approved',
              approvedBy,
              approvedAt: new Date().toISOString(),
            };
          }
          return mmp;
        });
        localStorage.setItem('mock_mmp_files', JSON.stringify(updatedFiles));
      }
    } catch (error) {
      console.error('Error approving MMP file:', error);
      toast.error('Failed to approve MMP file');
    }
  };

  const rejectMMP = (id: string, rejectionReason: string) => {
    try {
      // Update local state
      setMMPFiles((prev: MMPFile[]) =>
        (prev || []).map((mmp) => {
          if (mmp.id === id) {
            return {
              ...mmp,
              status: 'rejected',
              rejectionReason,
              rejectedAt: new Date().toISOString(),
            };
          }
          return mmp;
        })
      );
      
      // Update database via Supabase (if connected)
      try {
        supabase
          .from('mmp_files')
          .update({ 
            status: 'rejected', 
            rejectionreason: rejectionReason,
            updated_at: new Date().toISOString() 
          })
          .eq('id', id)
          .then(({ error }) => {
            if (error) {
              console.error('Supabase reject error:', error);
              toast.error('Database update failed, using local storage');
              // Fall back to local storage
              const existingFiles = JSON.parse(localStorage.getItem('mock_mmp_files') || '[]');
              const updatedFiles = existingFiles.map((mmp: MMPFile) => {
                if (mmp.id === id) {
                  return {
                    ...mmp,
                    status: 'rejected',
                    rejectionReason,
                    rejectedAt: new Date().toISOString(),
                  };
                }
                return mmp;
              });
              localStorage.setItem('mock_mmp_files', JSON.stringify(updatedFiles));
            } else {
              toast.success('MMP file rejected');
            }
          });
      } catch (dbError) {
        console.error('Database operation failed:', dbError);
        toast.error('Database operation failed, using local storage');
        // Fall back to local storage
        const existingFiles = JSON.parse(localStorage.getItem('mock_mmp_files') || '[]');
        const updatedFiles = existingFiles.map((mmp: MMPFile) => {
          if (mmp.id === id) {
            return {
              ...mmp,
              status: 'rejected',
              rejectionReason,
              rejectedAt: new Date().toISOString(),
            };
          }
          return mmp;
        });
        localStorage.setItem('mock_mmp_files', JSON.stringify(updatedFiles));
      }
    } catch (error) {
      console.error('Error rejecting MMP file:', error);
      toast.error('Failed to reject MMP file');
    }
  };

  return {
    archiveMMP,
    approveMMP,
    rejectMMP,
  };
};
