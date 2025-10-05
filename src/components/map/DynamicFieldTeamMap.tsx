
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Loader2 } from 'lucide-react';
import ErrorBoundary from '@/components/ErrorBoundary';
import { User, SiteVisit } from '@/types';
import { useAppContext } from '@/context/AppContext';
import TeamMapFilters from '@/components/field-team/TeamMapFilters';
import MapComponent from '@/components/map/MapComponent';

interface DynamicFieldTeamMapProps {
  siteVisits?: SiteVisit[];
  height?: string;
  showControls?: boolean;
  onAssign?: (siteVisitId: string) => void;
  eligibleCollectors?: User[];
  selectedUserId?: string | null;
  onUserSelect?: (userId: string) => void;
}

const DynamicFieldTeamMap: React.FC<DynamicFieldTeamMapProps> = (props) => {
  const { hasRole } = useAppContext();
  const { siteVisits = [], height = '500px', eligibleCollectors = [] } = props;
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'online' | 'busy' | 'offline'>('all');
  const [loading, setLoading] = useState(true);
  const hasValidCoords = (coords?: { latitude?: number; longitude?: number }) => {
    const lat = coords?.latitude; const lon = coords?.longitude;
    return (
      typeof lat === 'number' && typeof lon === 'number' &&
      Number.isFinite(lat) && Number.isFinite(lon) &&
      !(lat === 0 && lon === 0)
    );
  };

  // Transform siteVisits and collectors into locations for the map
  const mapLocations = React.useMemo(() => {
    const locations = [];
    
    // Add site visit locations
    if (siteVisits) {
      siteVisits.forEach(visit => {
        if (visit.location?.latitude && visit.location?.longitude) {
          locations.push({
            id: visit.id,
            name: visit.siteName,
            latitude: visit.location.latitude,
            longitude: visit.location.longitude,
            type: 'site' as const,
            status: visit.status
          });
        }
      });
    }
    
    // Add collector locations if user has appropriate role
    if (hasRole('admin') || hasRole('supervisor') || hasRole('coordinator') || hasRole('fom')) {
      eligibleCollectors.forEach(collector => {
        if (collector.location?.latitude && collector.location?.longitude) {
          locations.push({
            id: collector.id,
            name: collector.name,
            latitude: collector.location.latitude,
            longitude: collector.location.longitude,
            type: 'user' as const,
            status: collector.availability || 'active'
          });
        }
      });
    }
    
    return locations;
  }, [siteVisits, eligibleCollectors, hasRole]);

  useEffect(() => {
    // Set loading to false after a short delay to ensure component is mounted
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const MapErrorFallback = () => (
    <Card className="w-full h-full">
      <CardContent className="p-6 flex flex-col items-center justify-center h-full">
        <MapPin className="h-12 w-12 text-muted-foreground mb-4 animate-pulse" />
        <p className="text-muted-foreground text-center">
          Failed to load map component
        </p>
      </CardContent>
    </Card>
  );

  // Transform data for MapComponent
  const mapCollectors = eligibleCollectors
    .filter(c => hasValidCoords(c.location))
    .map(collector => ({
      id: collector.id,
      name: collector.name,
      location: {
        latitude: collector.location!.latitude!,
        longitude: collector.location!.longitude!
      },
      status: (
        collector.availability === 'online'
          ? 'available'
          : (collector.availability || 'offline')
      ) as 'available' | 'busy' | 'offline'
    }));

  const mapSiteVisits = siteVisits
    .filter(v => hasValidCoords(v.location))
    .map(visit => ({
      id: visit.id,
      name: visit.siteName,
      location: {
        latitude: visit.location.latitude,
        longitude: visit.location.longitude
      },
      status: visit.status as 'pending' | 'assigned' | 'inProgress' | 'completed'
    }));

  // Filter based on selected filter
  const filteredCollectors = selectedFilter === 'all' 
    ? mapCollectors 
    : mapCollectors.filter(c => c.status === selectedFilter);

  return (
    <ErrorBoundary fallback={<MapErrorFallback />}>
      <Card className="w-full">
        <CardContent className="p-0">
          <TeamMapFilters 
            selectedFilter={selectedFilter} 
            setSelectedFilter={setSelectedFilter}
          />
          <div className="relative">
            {loading ? (
              <div style={{ height }} className="flex items-center justify-center bg-slate-100/50 backdrop-blur-sm rounded-lg transition-all duration-300">
                <div className="text-center p-4">
                  <Loader2 className="h-12 w-12 mx-auto mb-2 text-primary animate-spin" />
                  <p className="text-muted-foreground">Loading map...</p>
                </div>
              </div>
            ) : (
              <MapComponent
                collectors={filteredCollectors}
                siteVisits={mapSiteVisits}
                assignments={[]}
                center={[15.5007, 32.5599]} // Sudan's center
                zoom={6}
                onMarkerClick={(type, id) => {
                  if (type === 'site' && props.onAssign) {
                    props.onAssign(id);
                  } else if (type === 'collector' && props.onUserSelect) {
                    props.onUserSelect(id);
                  }
                }}
                showAssignmentLines={false}
                height={height}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </ErrorBoundary>
  );
};

export { DynamicFieldTeamMap };
export default DynamicFieldTeamMap;
