
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload } from 'lucide-react';
import { useMMP } from '@/context/mmp/MMPContext';
import { MMPList } from '@/components/mmp/MMPList';

const MMP = () => {
  const navigate = useNavigate();
  const { mmpFiles, loading } = useMMP();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">MMP Management</h1>
          <p className="text-muted-foreground">
            Upload and manage your MMP files
          </p>
        </div>
        <Button onClick={() => navigate('/mmp/upload')}>
          <Upload className="h-4 w-4 mr-2" />
          Upload MMP
        </Button>
      </div>

      {loading ? (
        <Card className="p-6">
          <div className="text-center text-muted-foreground">
            Loading MMP files...
          </div>
        </Card>
      ) : (
        <MMPList mmpFiles={mmpFiles} />
      )}
    </div>
  );
};

export default MMP;
