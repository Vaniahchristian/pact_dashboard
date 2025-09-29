// Types for MMP Context
import { MMPFile } from '@/types/mmp';

export interface SupabaseResponse<T> {
  data: T | null;
  error: {
    message: string;
    details?: string;
    hint?: string;
    code?: string;
  } | null;
}

export interface MMPContextType {
  mmpFiles: MMPFile[];
  loading: boolean;
  error: string | null;
  currentMMP: MMPFile | null;
  setCurrentMMP: (mmp: MMPFile | null) => void;
  addMMPFile: (mmp: MMPFile) => void;
  updateMMPFile: (mmp: MMPFile) => void;
  deleteMMPFile: (id: string) => void;
  getMMPById: (id: string) => MMPFile | undefined;
  getMmpById: (id: string) => MMPFile | undefined;
  archiveMMP: (id: string, archivedBy: string) => void;
  approveMMP: (id: string, approvedBy: string) => void;
  rejectMMP: (id: string, rejectionReason: string) => void;
  uploadMMP: (file: File, projectId?: string) => Promise<boolean>;
  updateMMP: (id: string, updatedMMP: Partial<MMPFile>) => void;
  updateMMPVersion: (id: string, changes: string) => Promise<boolean>;
  deleteMMP: (id: string) => void;
  restoreMMP: (id: string) => void;
  resetMMP: (id?: string) => Promise<boolean>;
}
