import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { MMPComprehensiveVerificationComponent } from '@/components/MMPComprehensiveVerification';
import { useMMP } from '@/context/mmp/MMPContext';
import { useToast } from '@/hooks/use-toast';

const MMPVerificationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getMmpById, updateMMP } = useMMP();
  const { toast } = useToast();

  const mmpFile = id ? getMmpById(id) : null;

  if (!mmpFile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">MMP File Not Found</h1>
          <p className="text-gray-600 mb-6">The requested MMP file could not be found.</p>
          <Button onClick={() => navigate('/mmp')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to MMP Files
          </Button>
        </div>
      </div>
    );
  }

  const handleVerificationUpdate = (verification: any) => {
    if (mmpFile.id) {
      updateMMP(mmpFile.id, { comprehensiveVerification: verification });
    }
  };

  const handleVerificationComplete = () => {
    toast({
      title: "Verification Complete!",
      description: "All verification steps have been completed. You can now proceed with approval.",
    });
    
    // Navigate back to the MMP file details page
    navigate(`/mmp/${mmpFile.id}`);
  };

  const handleGoBack = () => {
    navigate(`/mmp/${mmpFile.id}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button 
            variant="outline" 
            onClick={handleGoBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to MMP File
          </Button>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              MMP Verification Process
            </h1>
            <p className="text-gray-600">
              Complete all verification steps for <strong>{mmpFile.name}</strong>
            </p>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <span>MMP ID: {mmpFile.mmpId}</span>
              <span>Region: {mmpFile.region}</span>
              <span>Uploaded: {new Date(mmpFile.uploadedAt).toLocaleDateString()}</span>
            </div>
          </div>
          
          {mmpFile.comprehensiveVerification?.canProceedToApproval && (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg border border-green-200">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">Verification Complete</span>
            </div>
          )}
        </div>
      </div>

      {/* Verification Component */}
      <div className="bg-white rounded-lg shadow-sm border">
        <MMPComprehensiveVerificationComponent
          mmpFile={mmpFile}
          onVerificationUpdate={handleVerificationUpdate}
          onVerificationComplete={handleVerificationComplete}
        />
      </div>

      {/* Footer Actions */}
      <div className="mt-8 flex justify-between items-center">
        <Button 
          variant="outline" 
          onClick={handleGoBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to MMP File
        </Button>
        
        {mmpFile.comprehensiveVerification?.canProceedToApproval && (
          <Button 
            onClick={() => navigate(`/mmp/${mmpFile.id}`)}
            className="flex items-center gap-2"
          >
            <CheckCircle2 className="h-4 w-4" />
            Proceed to Approval
          </Button>
        )}
      </div>
    </div>
  );
};

export default MMPVerificationPage;
