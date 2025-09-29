
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Filter, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import ActivityFeed from './ActivityFeed';

const activityTypes = [
  { id: 'all', label: 'All Activities' },
  { id: 'projects', label: 'Projects' },
  { id: 'siteVisits', label: 'Site Visits' },
  { id: 'mmp', label: 'MMP Files' },
  { id: 'team', label: 'Team' },
];

export const EnhancedActivityFeed = () => {
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['all']);
  
  const toggleType = (typeId: string) => {
    if (typeId === 'all') {
      setSelectedTypes(['all']);
      return;
    }
    
    let newSelection = [...selectedTypes];
    
    // Remove 'all' if a specific type is selected
    if (newSelection.includes('all')) {
      newSelection = newSelection.filter(t => t !== 'all');
    }
    
    // Toggle the selected type
    if (newSelection.includes(typeId)) {
      newSelection = newSelection.filter(t => t !== typeId);
      // If nothing's selected, default to 'all'
      if (newSelection.length === 0) newSelection = ['all'];
    } else {
      newSelection.push(typeId);
    }
    
    setSelectedTypes(newSelection);
  };
  
  return (
    <Card className="border-t-4 border-t-emerald-500 hover:shadow-md transition-all duration-300 h-full">
      <CardHeader className="bg-gradient-to-r from-emerald-50 to-transparent flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-emerald-500" />
          Team Activity
        </CardTitle>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <Filter className="h-3.5 w-3.5" />
              <span>Filter</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-2" align="end">
            <div className="space-y-1">
              {activityTypes.map(type => (
                <Button
                  key={type.id}
                  variant="ghost"
                  size="sm"
                  className="justify-start w-full"
                  onClick={() => toggleType(type.id)}
                >
                  {selectedTypes.includes(type.id) ? (
                    <Check className="h-3.5 w-3.5 mr-2 text-emerald-500" />
                  ) : (
                    <div className="w-[14px] mr-2" />
                  )}
                  {type.label}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </CardHeader>
      <CardContent className="p-4 h-[350px] overflow-y-auto">
        <ActivityFeed />
      </CardContent>
    </Card>
  );
};
