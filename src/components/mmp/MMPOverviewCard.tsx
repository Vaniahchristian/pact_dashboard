import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileCheck, Edit } from 'lucide-react';
import { MMPFile } from '@/types';
import { getTotalSiteCount, getActualSiteCount } from '@/utils/mmpUtils';

interface MMPOverviewCardProps {
  mmpFile: MMPFile;
  siteEntries: any[];
  onProceedToVerification: () => void;
  onEditMMP: () => void;
}

const MMPOverviewCard = ({ mmpFile, siteEntries, onProceedToVerification, onEditMMP }: MMPOverviewCardProps) => {
  // Use actual site entries count
  const actualSiteCount = getActualSiteCount(mmpFile);
  // Get total entries count (actual or declared)
  const totalEntries = getTotalSiteCount(mmpFile);
  const processedEntries = mmpFile?.processedEntries || 0;

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-950/20 dark:to-transparent">
        <CardTitle>MMP Overview</CardTitle>
        <CardDescription>
          Total entries: {totalEntries} | 
          Site entries: {actualSiteCount} | 
          Processed: {processedEntries}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <div>
          <h3 className="text-lg font-medium mb-3">Site Distribution by State</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {totalEntries > 0 ? (
              Array(Math.min(3, Math.ceil((totalEntries) / 5))).fill(null).map((_, index) => {
                const stateName = ["North State", "Central State", "South State"][index];
                const siteCount = Math.floor((totalEntries) / 3) + (index === 0 ? (totalEntries) % 3 : 0);
                
                return (
                  <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border rounded-lg p-4 shadow-sm hover:shadow transition-shadow">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium text-blue-700 dark:text-blue-400">{stateName}</h4>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                        {siteCount} sites
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      {Array(Math.min(3, Math.ceil(siteCount / 2))).fill(null).map((_, localityIdx) => {
                        const localityName = `${stateName} Locality ${localityIdx + 1}`;
                        const localitySiteCount = Math.ceil(siteCount / 3) + (localityIdx === 0 ? siteCount % 3 : 0);
                        
                        return (
                          <div key={localityIdx} className="flex justify-between text-sm p-2 bg-white dark:bg-gray-800 rounded">
                            <span>{localityName}</span>
                            <span className="text-muted-foreground">{localitySiteCount} sites</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 rounded-lg">
                <p className="text-amber-800 dark:text-amber-300 text-center">
                  No site entries available for distribution display
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div className="pt-4 border-t mt-4">
          <div className="flex justify-between">
            <Button onClick={onProceedToVerification} className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600">
              <FileCheck className="h-4 w-4 mr-2" />
              Proceed to Verification
            </Button>
            
            <Button variant="outline" onClick={onEditMMP}>
              <Edit className="h-4 w-4 mr-2" />
              Edit MMP Data
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MMPOverviewCard;
