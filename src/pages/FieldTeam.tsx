
import React, { useState, useMemo } from 'react';
import { useUser } from '@/context/user/UserContext';
import { useSiteVisitContext } from '@/context/siteVisit/SiteVisitContext';
import { useNavigate } from 'react-router-dom';
import { calculateUserWorkload } from '@/utils/collectorUtils';
import TeamHeader from '@/components/field-team/TeamHeader';
import SimpleFieldTeamMap from '@/components/map/SimpleFieldTeamMap';
import SiteVisitsSummary from '@/components/field-team/SiteVisitsSummary';
import { useIsMobile } from '@/hooks/use-mobile';

const FieldTeam = () => {
  const { users, currentUser } = useUser();
  const { siteVisits, assignSiteVisit } = useSiteVisitContext();
  const [activeTab, setActiveTab] = useState('map');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const isValidRole = ['coordinator', 'dataCollector', 'datacollector'].includes(user.role.toLowerCase());
      
      if (!isValidRole) return false;

      const matchesSearch = 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.phone && user.phone.includes(searchTerm));
      
      const matchesRole = roleFilter === 'all' || user.role.toLowerCase() === roleFilter.toLowerCase();
      const matchesStatus = statusFilter === 'all' || user.availability === statusFilter;
      
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  const dataCollectors = useMemo(() => {
    return filteredUsers.filter(
      (user) => user.role.toLowerCase() === 'datacollector' || user.role.toLowerCase() === 'dataCollector'
    );
  }, [filteredUsers]);

  const collectorRecommendations = useMemo(() => {
    return dataCollectors.map(user => ({
      user,
      distance: user.location?.latitude && user.location?.longitude ? 0 : null,
      workload: calculateUserWorkload(user.id, siteVisits),
      isNearby: false,
      isOverloaded: calculateUserWorkload(user.id, siteVisits) >= 20,
      isLocalityMatch: false,
    }));
  }, [dataCollectors, siteVisits]);

  const activeSiteVisits = useMemo(() => {
    return siteVisits.filter(
      (visit) => visit.status === 'assigned' || visit.status === 'inProgress'
    );
  }, [siteVisits]);

  const pendingSiteVisits = useMemo(() => {
    return siteVisits.filter(
      (visit) => visit.status === 'pending' || visit.status === 'permitVerified'
    );
  }, [siteVisits]);

  const handleAssignFromMap = (siteVisitId: string) => {
    navigate(`/site-visits/${siteVisitId}`);
  };

  return (
    <div className={`space-y-6 animate-fade-in ${isMobile ? 'px-2' : ''}`}>
      <TeamHeader currentUser={currentUser} />

      <SimpleFieldTeamMap
        users={users}
        siteVisits={[...activeSiteVisits, ...pendingSiteVisits]}
        onAssign={handleAssignFromMap}
        height={isMobile ? "300px" : "500px"}
      />
      
      <SiteVisitsSummary 
        activeSiteVisits={activeSiteVisits}
        pendingSiteVisits={pendingSiteVisits}
        users={users}
      />
    </div>
  );
};

export default FieldTeam;
