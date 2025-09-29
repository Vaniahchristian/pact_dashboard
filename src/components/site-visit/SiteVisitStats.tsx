
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { SiteVisit } from '@/types';
import { Clock, CheckCircle, AlertCircle, CalendarClock } from 'lucide-react';

interface SiteVisitStatsProps {
  visits: SiteVisit[];
}

const SiteVisitStats: React.FC<SiteVisitStatsProps> = ({ visits }) => {
  const stats = {
    pending: visits.filter(v => v.status === 'pending').length,
    inProgress: visits.filter(v => v.status === 'inProgress').length,
    completed: visits.filter(v => v.status === 'completed').length,
    scheduled: visits.filter(v => ['assigned', 'permitVerified'].includes(v.status)).length,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-amber-50/50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-muted-foreground group-hover:text-amber-700">Pending</p>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">{stats.pending}</span>
              </div>
              <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
              <p className="text-xs text-muted-foreground group-hover:text-amber-600">Visits awaiting review and assignment</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center group-hover:bg-amber-200 transition-colors">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-blue-50/50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-muted-foreground group-hover:text-blue-700">In Progress</p>
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">{stats.inProgress}</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
              <p className="text-xs text-muted-foreground group-hover:text-blue-600">Active field team assessments</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <AlertCircle className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-green-50/50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-muted-foreground group-hover:text-green-700">Completed</p>
                <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">{stats.completed}</span>
              </div>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              <p className="text-xs text-muted-foreground group-hover:text-green-600">Successfully finalized visits</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-purple-50/50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-muted-foreground group-hover:text-purple-700">Scheduled</p>
                <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-xs font-medium">{stats.scheduled}</span>
              </div>
              <p className="text-2xl font-bold text-purple-600">{stats.scheduled}</p>
              <p className="text-xs text-muted-foreground group-hover:text-purple-600">Assigned and permit verified</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
              <CalendarClock className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SiteVisitStats;
