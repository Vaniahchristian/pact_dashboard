import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { MMPCooperatingPartnerVerification as MMPCooperatingPartnerVerificationType } from '@/types/mmp/verification';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SiteCooperatingPartnerVerificationCard from './verification/SiteCooperatingPartnerVerificationCard';

interface MMPCooperatingPartnerVerificationProps {
  mmpFile: any;
  onVerificationComplete?: (verificationData: MMPCooperatingPartnerVerificationType) => void;
}

const MMPCooperatingPartnerVerification: React.FC<MMPCooperatingPartnerVerificationProps> = ({ mmpFile, onVerificationComplete }) => {
  const [verificationStatus, setVerificationStatus] = useState<Record<string, { 
    status: 'verified' | 'rejected' | null;
    notes?: string;
  }>>({});
  const [verificationProgress, setVerificationProgress] = useState<number>(0);
  const { toast } = useToast();

  useEffect(() => {
    if (mmpFile?.siteEntries && mmpFile.siteEntries.length > 0) {
      const totalSites = mmpFile.siteEntries.length;
      const verifiedSites = Object.values(verificationStatus).filter(status => 
        status.status === 'verified' || status.status === 'rejected'
      ).length;
      const progress = Math.round((verifiedSites / totalSites) * 100);
      setVerificationProgress(progress);

      if (verifiedSites === totalSites) {
        const cooperatingPartnerVerificationData: MMPCooperatingPartnerVerificationType = {
          verificationStatus: 'complete',
          verifiedAt: new Date().toISOString(),
          verifiedBy: "Current User",
          completionPercentage: 100,
          siteVerification: Object.entries(verificationStatus).reduce((acc, [siteId, status]) => ({
            ...acc,
            [siteId]: {
              verified: status.status === 'verified',
              verifiedAt: new Date().toISOString(),
              verifiedBy: "Current User",
              notes: status.notes
            }
          }), {})
        };
        
        onVerificationComplete?.(cooperatingPartnerVerificationData);
      }
    }
  }, [verificationStatus, mmpFile, onVerificationComplete]);

  const handleVerifySite = (siteId: string, status: 'verified' | 'rejected', notes?: string) => {
    setVerificationStatus(prev => ({
      ...prev,
      [siteId]: { status, notes }
    }));

    toast({
      title: `Site ${status === 'verified' ? 'Verified' : 'Rejected'}`,
      description: `Site has been ${status === 'verified' ? 'verified' : 'rejected'} successfully.`,
    });
  };

  if (!mmpFile) {
    return <div>No MMP file data available</div>;
  }

  const siteEntries = mmpFile.siteEntries || [];
  const totalSites = siteEntries.length || mmpFile.entries || 0;

  if (totalSites === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center text-center p-6">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-3" />
            <h3 className="text-lg font-medium">No Sites Available</h3>
            <p className="text-muted-foreground mt-2">
              This MMP file does not have any sites to verify.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium">Verification Progress</h3>
          <span className="text-sm">{verificationProgress}%</span>
        </div>
        <Progress value={verificationProgress} className="h-2" />
      </div>

      <Tabs defaultValue="sites" className="w-full">
        <TabsList>
          <TabsTrigger value="sites">Sites ({totalSites})</TabsTrigger>
          <TabsTrigger value="distribution">Distribution Details</TabsTrigger>
        </TabsList>

        <TabsContent value="sites" className="mt-6">
          <div className="space-y-4">
            {siteEntries.map((site) => (
              <SiteCooperatingPartnerVerificationCard
                key={site.id}
                site={site}
                onVerify={handleVerifySite}
                verificationStatus={verificationStatus}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="distribution" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Distribution Information</h3>
              <div className="grid gap-4">
                <div>
                  <p className="font-medium">Total Sites: {totalSites}</p>
                  <p className="text-sm text-muted-foreground">Number of sites included in this MMP</p>
                </div>
                <div>
                  <p className="font-medium">Verified Sites: {Object.values(verificationStatus).filter(s => s.status === 'verified').length}</p>
                  <p className="text-sm text-muted-foreground">Sites that have been verified</p>
                </div>
                <div>
                  <p className="font-medium">Rejected Sites: {Object.values(verificationStatus).filter(s => s.status === 'rejected').length}</p>
                  <p className="text-sm text-muted-foreground">Sites that have been rejected</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MMPCooperatingPartnerVerification;
