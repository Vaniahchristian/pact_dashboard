
import React, { useEffect } from 'react';
import { useSiteVisitRemindersUI } from '@/hooks/use-site-visit-reminders-ui';
import { DashboardDesktopView } from '@/components/dashboard/DashboardDesktopView';
import { DashboardMobileView } from '@/components/dashboard/DashboardMobileView';
import { DashboardStatsOverview } from '@/components/dashboard/DashboardStatsOverview';
import { useViewMode } from '@/context/ViewModeContext';
import { SectionHeader } from '@/components/dashboard/SectionHeader';
import { TooltipProvider } from '@/components/ui/tooltip';
import { BarChart, ShieldCheck } from 'lucide-react';
import FloatingMessenger from '@/components/communication/FloatingMessenger';
import { useAppContext } from '@/context/AppContext';
import { Badge } from '@/components/ui/badge';
import { AppRole } from '@/types';

const Dashboard = () => {
  const { SiteVisitRemindersDialog, showDueReminders } = useSiteVisitRemindersUI();
  const { viewMode } = useViewMode();
  const { currentUser, roles, hasRole } = useAppContext();
  
  useEffect(() => {
    showDueReminders();
  }, [showDueReminders]);

  // Log current user information to console for debugging
  useEffect(() => {
    if (currentUser) {
      console.log("Current User:", currentUser);
      console.log("User Role (single):", currentUser.role);
      console.log("User Roles Array:", currentUser.roles || []);
      console.log("Context Roles:", roles);
      
      // Check if admin role exists in any of the places
      const isAdminByRole = currentUser.role === 'admin';
      const isAdminByRolesArray = Array.isArray(currentUser.roles) && 
        currentUser.roles.includes('admin' as AppRole);
      const isAdminByContextRoles = Array.isArray(roles) && roles.includes('admin' as AppRole);
      
      console.log("Is Admin by role property:", isAdminByRole);
      console.log("Is Admin by roles array:", isAdminByRolesArray);
      console.log("Is Admin by context roles:", isAdminByContextRoles);
      console.log("Final hasRole('admin'):", hasRole('admin' as AppRole));
    }
  }, [currentUser, roles, hasRole]);
  
  return (
    <TooltipProvider>
      <div className="container mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mt-2">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your PACT operations center</p>
          
          {/* User role information (helps with debugging) */}
          {currentUser && (
            <div className="mt-2 p-3 bg-muted/30 rounded-lg flex flex-col sm:flex-row gap-2 items-start sm:items-center">
              <div className="flex items-center gap-2 text-sm">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span className="font-medium">Account type:</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {roles && roles.length > 0 ? (
                  roles.map((role, index) => (
                    <Badge key={index} variant={role === 'admin' ? 'default' : 'outline'}>
                      {role}
                    </Badge>
                  ))
                ) : (
                  <Badge variant={currentUser.role === 'admin' ? 'default' : 'outline'}>
                    {currentUser.role}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="mb-8">
          <SectionHeader 
            title="Key Metrics" 
            icon={<BarChart className="h-5 w-5 text-primary" />}
            description="Overview of your most important operational metrics"
          />
          <DashboardStatsOverview />
        </div>
        
        <div className="mt-8">
          {viewMode === 'mobile' ? (
            <DashboardMobileView />
          ) : (
            <DashboardDesktopView />
          )}
        </div>
        
        {/* Reminders dialog that appears when needed */}
        {SiteVisitRemindersDialog}
        
        {/* Enhanced Communication */}
        <FloatingMessenger />
      </div>
    </TooltipProvider>
  );
};

export default Dashboard;
