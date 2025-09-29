
import React, { useEffect } from 'react';
import { User, SiteVisit } from '@/types';
import { MapPin, Users, Navigation, ChevronRight, Globe2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNavigate } from 'react-router-dom';
import TeamMemberLocation from '../field-team/TeamMemberLocation';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';
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
  height?: string;
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
  onAssign,
  height = '600px'
}) => {
  const navigate = useNavigate();
  
  // Add debug logging to see what data is available
  useEffect(() => {
    console.log("SimpleFieldTeamMap - Users:", users);
    console.log("SimpleFieldTeamMap - SiteVisits:", siteVisits);
    console.log("SimpleFieldTeamMap - Height:", height);
  }, [users, siteVisits, height]);
  
  const usersByRegion = users.reduce((acc, user) => {
    // Check if user has location data
    const region = user.location?.region || user.stateId || 'Unknown';
    console.log(`User ${user.name} has region: ${region}`);
    
    if (!acc[region]) {
      acc[region] = [];
    }
    acc[region].push(user);
    return acc;
  }, {} as Record<string, User[]>);
  
  const allRegions = [...new Set(Object.keys(usersByRegion))];
  
  useEffect(() => {
    console.log("SimpleFieldTeamMap - Regions found:", allRegions);
    console.log("SimpleFieldTeamMap - Users by region:", usersByRegion);
  }, [allRegions, usersByRegion]);

  // If no regions found, ensure we have a fallback
  if (allRegions.length === 0) {
    console.log("No regions found in user data");
    
    // Add mock region if no real data is available for debugging purposes
    if (users.length > 0 && process.env.NODE_ENV === 'development') {
      console.log("Adding mock region for development");
      const mockRegion = 'Development Region';
      usersByRegion[mockRegion] = users;
      allRegions.push(mockRegion);
    }
    
    // Show empty state if still no regions
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
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'busy':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  const getSiteVisitColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'inProgress':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'assigned':
        return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  return (
    <ScrollArea className={`h-[${height}] w-full pr-4`} style={{ height }}>
      <div className="space-y-6 pb-4">
        {allRegions.length > 0 ? (
          allRegions.map(region => (
            <Card key={region} className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
              <CardHeader className="bg-muted/50">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    {region}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-background">
                      {usersByRegion[region]?.length || 0} Team Members
                    </Badge>
                    <Badge variant="outline" className="bg-background">
                      {siteVisits.filter(visit => visit.location?.region === region).length} Sites
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  {usersByRegion[region]?.map(user => (
                    <HoverCard key={user.id}>
                      <HoverCardTrigger asChild>
                        <div className={`p-4 rounded-lg border ${getStatusColor(user.availability)} cursor-pointer`}>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="font-medium">{user.name}</div>
                            <Badge variant="outline" className="ml-auto">
                              {user.role}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {user.location?.latitude && user.location?.longitude ? (
                              `📍 ${user.location.latitude.toFixed(4)}, ${user.location.longitude.toFixed(4)}`
                            ) : 'No location data'}
                          </div>
                        </div>
                      </HoverCardTrigger>
                      <HoverCardContent>
                        <div className="space-y-2">
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Last active: {new Date(user.lastActive).toLocaleString()}
                          </div>
                          <div className="text-sm">
                            Completed tasks: {user.performance?.totalCompletedTasks || 0}
                          </div>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  ))}
                </div>

                <div className="mt-6">
                  <h3 className="text-sm font-medium mb-3">Site Visits in Region</h3>
                  {siteVisits.filter(visit => visit.location?.region === region).length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {siteVisits
                        .filter(visit => visit.location?.region === region)
                        .map(visit => (
                          <div 
                            key={visit.id}
                            className={`p-4 rounded-lg border ${getSiteVisitColor(visit.status)}`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="font-medium">{visit.siteName}</div>
                              <Badge variant="outline">
                                {visit.status}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              📍 {visit.location.address}
                            </div>
                            {visit.dueDate && (
                              <div className="text-xs mt-2 text-muted-foreground">
                                Due: {new Date(visit.dueDate).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">
                      No site visits in this region
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
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
        )}
      </div>
    </ScrollArea>
  );
};

export default SimpleFieldTeamMap;
