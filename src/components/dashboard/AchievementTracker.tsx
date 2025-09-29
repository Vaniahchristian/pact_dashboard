
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { AchievementProgressBar } from './AchievementProgressBar';
import { Trophy, Calendar, RotateCw } from 'lucide-react';
import { motion } from 'framer-motion';

export const AchievementTracker = () => {
  const [timeframe, setTimeframe] = useState('weekly');
  
  const weeklyGoals = [
    { title: 'Site Visits Completed', progress: 18, target: 25, category: 'visits' },
    { title: 'Compliance Rate', progress: 92, target: 100, unit: '%', category: 'compliance' },
    { title: 'Team Activity Rate', progress: 84, target: 90, unit: '%', category: 'team' },
  ];
  
  const monthlyGoals = [
    { title: 'Site Visits Completed', progress: 62, target: 100, category: 'visits' },
    { title: 'Compliance Rate', progress: 88, target: 100, unit: '%', category: 'compliance' },
    { title: 'Fraud Detection Rate', progress: 15, target: 15, category: 'fraud' },
    { title: 'Team Activity Rate', progress: 79, target: 90, unit: '%', category: 'team' },
  ];
  
  const quarterlyGoals = [
    { title: 'Project Completion', progress: 4, target: 10, category: 'visits' },
    { title: 'Compliance Audits', progress: 25, target: 30, category: 'compliance' },
    { title: 'Fraud Prevention Score', progress: 85, target: 90, unit: '%', category: 'fraud' },
    { title: 'Team Performance', progress: 72, target: 80, unit: '%', category: 'team' },
    { title: 'Documentation Quality', progress: 88, target: 100, unit: '%', category: 'compliance' },
  ];
  
  return (
    <Card className="border-t-4 border-t-amber-500 hover:shadow-md transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-amber-50 to-transparent flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-500" />
          Achievement Tracker
        </CardTitle>
        <Tabs defaultValue="weekly" value={timeframe} onValueChange={setTimeframe} className="w-auto">
          <TabsList className="grid grid-cols-3 h-7">
            <TabsTrigger value="weekly" className="text-xs px-2">Weekly</TabsTrigger>
            <TabsTrigger value="monthly" className="text-xs px-2">Monthly</TabsTrigger>
            <TabsTrigger value="quarterly" className="text-xs px-2">Quarterly</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="p-4">
        <motion.div
          key={timeframe}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>
                {timeframe === 'weekly' && 'This Week'}
                {timeframe === 'monthly' && 'This Month'}
                {timeframe === 'quarterly' && 'This Quarter'}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <RotateCw className="h-3.5 w-3.5" />
              <span>Updated 2h ago</span>
            </div>
          </div>
          
          <div className="space-y-4">
            {timeframe === 'weekly' && weeklyGoals.map((goal, index) => (
              <AchievementProgressBar
                key={`weekly-${index}`}
                title={goal.title}
                progress={goal.progress}
                target={goal.target}
                unit={goal.unit}
                category={goal.category}
              />
            ))}
            
            {timeframe === 'monthly' && monthlyGoals.map((goal, index) => (
              <AchievementProgressBar
                key={`monthly-${index}`}
                title={goal.title}
                progress={goal.progress}
                target={goal.target}
                unit={goal.unit}
                category={goal.category}
              />
            ))}
            
            {timeframe === 'quarterly' && quarterlyGoals.map((goal, index) => (
              <AchievementProgressBar
                key={`quarterly-${index}`}
                title={goal.title}
                progress={goal.progress}
                target={goal.target}
                unit={goal.unit}
                category={goal.category}
              />
            ))}
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
};
