import { MMPFile } from '@/types';
import { toast } from 'sonner';
import { uploadMMPFile } from '@/utils/mmpFileUpload';

export const useMMPUpload = (addMMPFile: (mmp: MMPFile) => void) => {
  const uploadMMP = async (
    file: File,
    projectId?: string
  ): Promise<{ success: boolean; id?: string; mmp?: MMPFile; error?: string }> => {
    try {
      console.log('Starting MMP upload process for file:', file.name);

      const { success, mmpData, error } = await uploadMMPFile(file, projectId);

      if (!success || error) {
        console.error('Error uploading MMP:', error);
        toast.error(`Error uploading MMP: ${error}`);
        return { success: false, error };
      }

      if (mmpData) {
        console.log('MMP uploaded successfully, adding to context:', mmpData);
        addMMPFile(mmpData);
        toast.success(`${file.name} uploaded successfully`);
        return { success: true, id: mmpData.id, mmp: mmpData };
      }

      return { success: false, error: 'Upload finished without returning data' }; // Fallback
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error in MMP upload:', err);
      toast.error(`Upload failed: ${errorMessage}`);
      return { success: false, error: errorMessage };
    }
  };

  return {
    uploadMMP,
  };
};
