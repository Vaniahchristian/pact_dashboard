
import React from 'react';
import { User, SiteVisit } from '@/types';
import { MapPin, Users, Navigation, ChevronRight, Globe2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNavigate } from 'react-router-dom';
import TeamMemberLocation from '../field-team/TeamMemberLocation';
import CollectorCard from '@/components/site-visit/CollectorCard';
import { CollectorMatch } from '@/utils/gpsMatchingUtils';

interface SimpleFieldTeamMapProps {
  users: User[];
  siteVisits: SiteVisit[];
  filteredUsers?: User[];
  dataCollectors?: User[];
  collectorRecommendations?: CollectorMatch[];
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  searchTerm?: string;
  setSearchTerm?: (term: string) => void;
  roleFilter?: string;
  setRoleFilter?: (role: string) => void;
  statusFilter?: string;
  setStatusFilter?: (status: string) => void;
  onAssign?: (siteVisitId: string) => void;
}

const SimpleFieldTeamMap: React.FC<SimpleFieldTeamMapProps> = ({ 
  users, 
  siteVisits,
  filteredUsers,
  dataCollectors,
  collectorRecommendations,
  activeTab,
  setActiveTab,
  searchTerm,
  setSearchTerm,
  roleFilter,
  setRoleFilter,
  statusFilter,
  setStatusFilter,
  onAssign 
}) => {
  const navigate = useNavigate();
  
  // Group users by region/state
  const usersByRegion = users.reduce((acc, user) => {
    const region = user.location?.region || user.stateId || 'Unknown';
    if (!acc[region]) {
      acc[region] = [];
    }
    acc[region].push(user);
    return acc;
  }, {} as Record<string, User[]>);
  
  // Get all unique regions
  const allRegions = [...new Set(Object.keys(usersByRegion))];

  if (allRegions.length === 0) {
    return (
      <Card>
        <CardContent className="p-4 flex flex-col items-center justify-center min-h-[600px]">
          <Globe2 className="h-16 w-16 mb-4 text-muted-foreground" />
          <p className="text-lg font-medium mb-2">No Location Data Available</p>
          <p className="text-muted-foreground text-center max-w-md">
            There is no location data available for team members.
            Ask team members to share their location to see them here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <ScrollArea className="h-[600px] w-full pr-4">
      <div className="space-y-6 pb-4">
        {allRegions.map(region => (
          <Card key={region} className="relative overflow-hidden">
            <CardHeader className="bg-muted/50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  {region}
                </CardTitle>
                <Badge variant="outline" className="bg-background">
                  {usersByRegion[region].length} Team Members
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {usersByRegion[region].map(user => (
                <TeamMemberLocation key={user.id} user={user} />
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};

export default SimpleFieldTeamMap;
