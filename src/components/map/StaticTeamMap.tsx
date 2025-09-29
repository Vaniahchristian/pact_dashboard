
import React from 'react';
import { User, SiteVisit } from '@/types';
import { MapPin, Users, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface StaticTeamMapProps {
  users: User[];
  siteVisits: SiteVisit[];
}

const StaticTeamMap: React.FC<StaticTeamMapProps> = ({ users, siteVisits }) => {
  // If there's no data to display, show a placeholder
  if (users.length === 0 && siteVisits.length === 0) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-slate-100">
        <MapPin className="h-16 w-16 mb-2 text-muted-foreground" />
        <p className="text-muted-foreground">No location data available</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-slate-100 p-4 flex flex-col">
      {users.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
            <Users className="h-4 w-4" />
            Field Team Members
          </h3>
          <div className="space-y-2">
            {users.map(user => (
              <div key={user.id} className="p-2 bg-white rounded-md shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{user.name}</span>
                  <Badge variant="outline" className={
                    user.availability === 'online' ? 'bg-green-50 text-green-700' :
                    user.availability === 'busy' ? 'bg-amber-50 text-amber-700' :
                    'bg-gray-50 text-gray-700'
                  }>
                    {user.availability === 'online' ? 'Available' :
                     user.availability === 'busy' ? 'Busy' : 'Offline'}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>
                    {user.location?.region || 'Unknown location'}
                    {user.location?.latitude && user.location?.longitude && 
                      ` (${user.location.latitude.toFixed(2)}, ${user.location.longitude.toFixed(2)})`
                    }
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {siteVisits.length > 0 && (
        <div>
          <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            Active Site Visits
          </h3>
          <div className="space-y-2">
            {siteVisits.map(visit => (
              <div key={visit.id} className="p-2 bg-white rounded-md shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{visit.siteName}</span>
                  <Badge variant={visit.status === 'inProgress' ? 'secondary' : 'outline'}>
                    {visit.status === 'inProgress' ? 'In Progress' : 'Assigned'}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>
                    {visit.location?.address || `${visit.locality}, ${visit.state}`}
                    {visit.coordinates?.latitude && visit.coordinates?.longitude && 
                      ` (${visit.coordinates.latitude.toFixed(2)}, ${visit.coordinates.longitude.toFixed(2)})`
                    }
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Simple map unavailable notice */}
      <div className="mt-auto pt-2 border-t border-gray-200 text-center">
        <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
          <AlertCircle className="h-3 w-3" />
          <span>Interactive map unavailable. Visit Field Team page for full map view.</span>
        </div>
      </div>
    </div>
  );
};

export default StaticTeamMap;
