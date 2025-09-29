
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Calendar, ClipboardList } from 'lucide-react';
import { DashboardCalendar } from './DashboardCalendar';
import UpcomingSiteVisitsCard from './UpcomingSiteVisitsCard';

export const CalendarAndVisits = () => {
  const [activeTab, setActiveTab] = useState('calendar');
  
  return (
    <Card className="border-t-4 border-t-blue-500 hover:shadow-md transition-all duration-300 h-full">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-transparent flex flex-row justify-between items-center">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-500" />
          Planning & Schedule
        </CardTitle>
        <Tabs defaultValue="calendar" className="w-auto" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 h-7">
            <TabsTrigger value="calendar" className="text-xs px-2">Calendar</TabsTrigger>
            <TabsTrigger value="visits" className="text-xs px-2">Site Visits</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="p-0 overflow-hidden">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: activeTab === 'calendar' ? -10 : 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          className="p-4"
        >
          {activeTab === 'calendar' && <DashboardCalendar />}
          {activeTab === 'visits' && <UpcomingSiteVisitsCard siteVisits={[]} />}
        </motion.div>
      </CardContent>
    </Card>
  );
};
