
import React from 'react';
import { Monitor, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useViewMode } from '@/context/ViewModeContext';

const ViewModeToggle = () => {
  const { viewMode, toggleViewMode } = useViewMode();

  return (
    <Button
      variant="outline"
      size="sm"
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 gap-2 bg-white/80 backdrop-blur-sm shadow-md border-gray-200 transition-all hover:bg-white/90"
      onClick={toggleViewMode}
    >
      {viewMode === 'web' ? (
        <>
          <Smartphone className="h-4 w-4" />
          <span>Mobile View</span>
        </>
      ) : (
        <>
          <Monitor className="h-4 w-4" />
          <span>Desktop View</span>
        </>
      )}
    </Button>
  );
};

export default ViewModeToggle;
