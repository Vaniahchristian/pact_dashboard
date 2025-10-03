
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { MMPPermitsData, MMPStatePermitDocument } from '@/types/mmp/permits';
import { MMPPermitFileUpload } from './MMPPermitFileUpload';
import { PermitVerificationCard } from './permits/PermitVerificationCard';
import { Progress } from '@/components/ui/progress';
import { Upload, FileCheck } from 'lucide-react';
import { useMMP } from '@/context/mmp/MMPContext';
import { useAppContext } from '@/context/AppContext';

interface MMPPermitVerificationProps {
  mmpFile: any;
  onVerificationComplete?: (verificationData: any) => void;
}

const MMPPermitVerification: React.FC<MMPPermitVerificationProps> = ({
  mmpFile,
  onVerificationComplete
}) => {
  const [permits, setPermits] = useState<MMPStatePermitDocument[]>([]);
  const { toast } = useToast();
  const { updateMMP } = useMMP();
  const { currentUser } = useAppContext();

  useEffect(() => {
    // Initialize permits from mmpFile when component mounts or mmpFile changes
    if (mmpFile && mmpFile.permits) {
      // Support both legacy array and new object shape
      if (Array.isArray(mmpFile.permits)) {
        setPermits(mmpFile.permits as MMPStatePermitDocument[]);
      } else if (
        typeof mmpFile.permits === 'object' &&
        'documents' in mmpFile.permits &&
        Array.isArray(mmpFile.permits.documents)
      ) {
        setPermits(mmpFile.permits.documents as MMPStatePermitDocument[]);
      } else {
        setPermits([]);
      }
      console.log('MMPPermitVerification - Initial permits:', mmpFile.permits);
    } else {
      setPermits([]);
    }
  }, [mmpFile]);

  const persistPermits = (docs: MMPStatePermitDocument[]) => {
    const now = new Date().toISOString();
    const permitsData: MMPPermitsData = {
      federal: docs.some(d => d.permitType === 'federal'),
      state: docs.some(d => d.permitType === 'state'),
      lastVerified: docs.some(d => d.status) ? now : undefined,
      verifiedBy: currentUser?.username || currentUser?.fullName || currentUser?.email || undefined,
      // Cast to MMPDocument[] for compatibility; downstream code handles extended fields safely
      documents: docs as unknown as any,
    };

    if (onVerificationComplete) {
      onVerificationComplete(permitsData);
    } else if (mmpFile?.id) {
      // Directly persist if no callback provided
      updateMMP(mmpFile.id, { permits: permitsData } as any);
    }
  };

  const handleUploadSuccess = (newPermit: MMPStatePermitDocument) => {
    const updatedPermits = [...permits, newPermit];
    setPermits(updatedPermits);
    persistPermits(updatedPermits);
    
    toast({
      title: "Permit Uploaded",
      description: `${newPermit.fileName} has been uploaded successfully.`,
    });
  };

  const handleVerifyPermit = (permitId: string, status: 'verified' | 'rejected', notes?: string) => {
    const updatedPermits = permits.map(permit => {
      if (permit.id === permitId) {
        return {
          ...permit,
          status,
          verificationNotes: notes,
          verifiedAt: new Date().toISOString(),
          verifiedBy: currentUser?.username || currentUser?.fullName || currentUser?.email || 'System'
        };
      }
      return permit;
    });

    setPermits(updatedPermits);
    persistPermits(updatedPermits);
  };

  const calculateProgress = () => {
    if (permits.length === 0) return 0;
    const verifiedCount = permits.filter(p => p.status === 'verified' || p.status === 'rejected').length;
    return Math.round((verifiedCount / permits.length) * 100);
  };

  const progress = calculateProgress();
  const siteCount = mmpFile?.siteEntries?.length || mmpFile?.entries || 0;

  return (
    <div className="space-y-8">
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload New Permit
          </CardTitle>
          <CardDescription>
            Add a new permit document for verification
            {siteCount > 0 && (
              <span className="ml-1 text-xs font-medium text-blue-600">
                • MMP contains {siteCount} sites
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MMPPermitFileUpload 
            onUploadSuccess={handleUploadSuccess}
            bucket="mmp-files"
            pathPrefix={`permits/${mmpFile?.id || mmpFile?.mmpId || 'unknown'}`}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5" />
            Verification Progress
          </CardTitle>
          <CardDescription>
            Track and manage permit verifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                Overall Progress
              </span>
              <span className="text-sm font-medium">
                {progress}%
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="space-y-4">
            {permits.length > 0 ? (
              permits.map((permit) => (
                <PermitVerificationCard
                  key={permit.id}
                  permit={permit}
                  onVerify={handleVerifyPermit}
                />
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Upload className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p className="text-lg font-medium mb-1">No permits uploaded yet</p>
                <p className="text-sm">Upload permits to begin the verification process</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MMPPermitVerification;
