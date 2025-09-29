
import { useState } from 'react';
import { MMPFile } from '@/types';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { uploadMMPFile, ensureMMPStorageBucket } from '@/utils/mmpFileUpload';

export const useMMPOperations = (mmpFiles: MMPFile[], setMMPFiles: React.Dispatch<React.SetStateAction<MMPFile[]>>) => {
  const [currentMMP, setCurrentMMP] = useState<MMPFile | null>(null);

  const getMmpById = (id: string): MMPFile | undefined => {
    if (!id || !mmpFiles?.length) {
      console.log('No ID provided or no MMP files available');
      return undefined;
    }
    
    console.log('Current ID from URL:', id);
    console.log('Available MMP files:', mmpFiles?.length || 0);
    
    const mmp = mmpFiles.find(m => m.id === id);
    console.log('Found MMP file:', mmp ? 'Found' : 'Not found');
    
    return mmp;
  };

  const addMMPFile = (mmp: MMPFile) => {
    try {
      console.log('Adding new MMP file:', mmp);
      setMMPFiles((prev: MMPFile[]) => [...(prev || []), mmp]);
      
      // Update database via Supabase (if connected)
      try {
        supabase
          .from('mmp_files')
          .insert([mmp])
          .then(({ error }) => {
            if (error) {
              console.error('Supabase insert error:', error);
              toast.error('Database update failed, using local storage');
              // Fall back to local storage if database insert fails
              const existingFiles = JSON.parse(localStorage.getItem('mock_mmp_files') || '[]');
              localStorage.setItem('mock_mmp_files', JSON.stringify([...existingFiles, mmp]));
            } else {
              toast.success('MMP file added successfully');
            }
          });
      } catch (dbError) {
        console.error('Database operation failed:', dbError);
        toast.error('Database operation failed, using local storage');
        // Fall back to local storage
        const existingFiles = JSON.parse(localStorage.getItem('mock_mmp_files') || '[]');
        localStorage.setItem('mock_mmp_files', JSON.stringify([...existingFiles, mmp]));
      }
    } catch (error) {
      console.error('Error adding MMP file:', error);
      toast.error('Failed to add MMP file');
    }
  };

  const updateMMPFile = (mmp: MMPFile) => {
    try {
      setMMPFiles((prev: MMPFile[]) =>
        (prev || []).map((m) => (m.id === mmp.id ? mmp : m))
      );
      
      // Update database via Supabase (if connected)
      try {
        supabase
          .from('mmp_files')
          .update(mmp)
          .eq('id', mmp.id)
          .then(({ error }) => {
            if (error) {
              console.error('Supabase update error:', error);
              toast.error('Database update failed, using local storage');
              // Fall back to local storage if database update fails
              const existingFiles = JSON.parse(localStorage.getItem('mock_mmp_files') || '[]');
              const updatedFiles = existingFiles.map((m: MMPFile) => m.id === mmp.id ? mmp : m);
              localStorage.setItem('mock_mmp_files', JSON.stringify(updatedFiles));
            } else {
              toast.success('MMP file updated successfully');
            }
          });
      } catch (dbError) {
        console.error('Database operation failed:', dbError);
        toast.error('Database operation failed, using local storage');
        // Fall back to local storage
        const existingFiles = JSON.parse(localStorage.getItem('mock_mmp_files') || '[]');
        const updatedFiles = existingFiles.map((m: MMPFile) => m.id === mmp.id ? mmp : m);
        localStorage.setItem('mock_mmp_files', JSON.stringify(updatedFiles));
      }
    } catch (error) {
      console.error('Error updating MMP file:', error);
      toast.error('Failed to update MMP file');
    }
  };

  const deleteMMPFile = (id: string) => {
    try {
      setMMPFiles((prev: MMPFile[]) => (prev || []).filter((mmp) => mmp.id !== id));
      
      // Update database via Supabase (if connected)
      try {
        supabase
          .from('mmp_files')
          .delete()
          .eq('id', id)
          .then(({ error }) => {
            if (error) {
              console.error('Supabase delete error:', error);
              toast.error('Database delete failed, using local storage');
              // Fall back to local storage if database delete fails
              const existingFiles = JSON.parse(localStorage.getItem('mock_mmp_files') || '[]');
              const updatedFiles = existingFiles.filter((m: MMPFile) => m.id !== id);
              localStorage.setItem('mock_mmp_files', JSON.stringify(updatedFiles));
            } else {
              toast.success('MMP file deleted successfully');
            }
          });
      } catch (dbError) {
        console.error('Database operation failed:', dbError);
        toast.error('Database operation failed, using local storage');
        // Fall back to local storage
        const existingFiles = JSON.parse(localStorage.getItem('mock_mmp_files') || '[]');
        const updatedFiles = existingFiles.filter((m: MMPFile) => m.id !== id);
        localStorage.setItem('mock_mmp_files', JSON.stringify(updatedFiles));
      }
    } catch (error) {
      console.error('Error deleting MMP file:', error);
      toast.error('Failed to delete MMP file');
    }
  };

  return {
    currentMMP,
    setCurrentMMP,
    getMmpById,
    addMMPFile,
    updateMMPFile,
    deleteMMPFile,
  };
};
