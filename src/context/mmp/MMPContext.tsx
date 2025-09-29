
import React, { createContext, useContext, useState, useEffect } from 'react';
import { MMPFile } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { mmpFiles as mockMMPFiles } from '@/data/mockMMPFiles';
import { MMPContextType } from './types';
import { useMMPOperations } from './hooks/useMMPOperations';
import { useMMPStatusOperations } from './hooks/useMMPStatusOperations';
import { useMMPVersioning } from './hooks/useMMPVersioning';
import { useMMPUpload } from './hooks/useMMPUpload';

const MMPContext = createContext<MMPContextType>({
  mmpFiles: [],
  loading: true,
  error: null,
  currentMMP: null,
  setCurrentMMP: () => {},
  addMMPFile: () => {},
  updateMMPFile: () => {},
  deleteMMPFile: () => {},
  getMMPById: () => undefined,
  getMmpById: () => undefined,
  archiveMMP: () => {},
  approveMMP: () => {},
  rejectMMP: () => {},
  uploadMMP: async () => false,
  updateMMP: () => {},
  updateMMPVersion: async () => false,
  deleteMMP: () => {},
  restoreMMP: () => {},
  resetMMP: async () => false,
});

export const useMMPProvider = () => {
  const [mmpFiles, setMMPFiles] = useState<MMPFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    currentMMP,
    setCurrentMMP,
    getMmpById,
    addMMPFile,
    updateMMPFile,
    deleteMMPFile,
  } = useMMPOperations(mmpFiles, setMMPFiles);

  const { archiveMMP, approveMMP, rejectMMP } = useMMPStatusOperations(setMMPFiles);
  const { updateMMPVersion } = useMMPVersioning(setMMPFiles);
  const { uploadMMP } = useMMPUpload(addMMPFile);

  useEffect(() => {
    const fetchMMPFiles = async () => {
      try {
        setLoading(true);
        
        let data = [];
        if (supabase) {
          const { data: mmpData, error } = await supabase
            .from('mmp_files')
            .select('*')
            .order('created_at', { ascending: false });
            
          if (error) {
            console.error('Error fetching MMP files from Supabase:', error);
            throw error;
          }
          
          if (mmpData && mmpData.length > 0) {
            data = mmpData;
            console.log('MMP files loaded from Supabase:', mmpData);
          } else {
            console.log('No MMP files found in Supabase, using mock data');
            const storedMockData = JSON.parse(localStorage.getItem('mock_mmp_files') || '[]');
            data = storedMockData.length > 0 ? storedMockData : mockMMPFiles;
          }
        } else {
          console.log('Supabase not connected, using mock data');
          const storedMockData = JSON.parse(localStorage.getItem('mock_mmp_files') || '[]');
          data = storedMockData.length > 0 ? storedMockData : mockMMPFiles;
        }
        
        setMMPFiles(data);
      } catch (err) {
        console.error('Error loading MMP files:', err);
        setError('Failed to load MMP files');
        const storedMockData = JSON.parse(localStorage.getItem('mock_mmp_files') || '[]');
        setMMPFiles(storedMockData.length > 0 ? storedMockData : mockMMPFiles);
      } finally {
        setLoading(false);
      }
    };

    fetchMMPFiles();
  }, []);

  const updateMMP = (id: string, updatedMMP: Partial<MMPFile>) => {
    setMMPFiles((prev: MMPFile[]) =>
      prev.map((mmp) => {
        if (mmp.id === id) {
          return { ...mmp, ...updatedMMP };
        }
        return mmp;
      })
    );
  };

  const deleteMMP = (id: string) => {
    setMMPFiles((prev: MMPFile[]) =>
      prev.map((mmp) => {
        if (mmp.id === id) {
          return {
            ...mmp,
            status: 'deleted',
            deletedAt: new Date().toISOString(),
            deletedBy: 'Current User'
          };
        }
        return mmp;
      })
    );
  };

  const restoreMMP = (id: string) => {
    setMMPFiles((prev: MMPFile[]) =>
      prev.map((mmp) => {
        if (mmp.id === id && mmp.status === 'deleted') {
          const { deletedAt, deletedBy, ...restoredMmp } = mmp;
          return {
            ...restoredMmp,
            status: 'pending'
          };
        }
        return mmp;
      })
    );
  };

  const resetMMP = async (id?: string): Promise<boolean> => {
    try {
      setCurrentMMP(null);
      if (id) {
        setMMPFiles((prev: MMPFile[]) =>
          prev.map((mmp) => {
            if (mmp.id === id) {
              return {
                ...mmp,
                status: 'pending',
                approvalWorkflow: null,
                rejectionReason: null,
                approvedAt: null,
                approvedBy: null
              };
            }
            return mmp;
          })
        );
      }
      return true;
    } catch (error) {
      console.error('Error resetting MMP:', error);
      return false;
    }
  };

  return {
    mmpFiles,
    loading,
    error,
    currentMMP,
    setCurrentMMP,
    addMMPFile,
    updateMMPFile,
    deleteMMPFile,
    getMmpById,
    getMMPById: getMmpById,
    archiveMMP,
    approveMMP,
    rejectMMP,
    uploadMMP,
    updateMMP,
    updateMMPVersion,
    deleteMMP,
    restoreMMP,
    resetMMP
  };
};

export const MMPProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const mmpContext = useMMPProvider();
  return <MMPContext.Provider value={mmpContext}>{children}</MMPContext.Provider>;
};

export const useMMP = () => useContext(MMPContext);
