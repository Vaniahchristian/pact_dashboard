
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { StatsCard, containerVariants, itemVariants, useDashboardStats } from './DashboardOptimization';
import { useProgressiveLoading } from './animation-utils';
import { Skeleton } from '@/components/ui/skeleton';

export const DashboardStatsOverview = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const isLoaded = useProgressiveLoading(300); // Add a small delay for progressive loading
  const { activeProjects, approvedMmps, completedVisits, pendingSiteVisits } = useDashboardStats();
  
  // Map of stats to display with real data
  const statsToDisplay = [
    {
      title: "Active Projects",
      value: activeProjects,
      description: "Current ongoing projects",
      icon: <svg className="h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18 9V3H12"/><path d="m18 3 4 4"/><path d="m2 16 6-6 4 4 8-8"/></svg>
    },
    {
      title: "Approved MMPs",
      value: approvedMmps,
      description: "Total approved monitoring plans",
      icon: <svg className="h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="m9 15 2 2 4-4"/></svg>
    },
    {
      title: "Completed Visits",
      value: completedVisits,
      description: "Successfully completed site visits",
      icon: <svg className="h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
    },
    {
      title: "Pending Site Visits",
      value: pendingSiteVisits,
      description: "Site visits requiring action",
      icon: <svg className="h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>
    }
  ];
  
  if (!isLoaded) {
    return (
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <Skeleton key={item} className="h-32" />
        ))}
      </div>
    );
  }
  
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
    >
      {statsToDisplay.map((stat, index) => (
        <motion.div
          key={stat.title}
          variants={itemVariants}
          className="h-full"
          onMouseEnter={() => setHoveredCard(index)}
          onMouseLeave={() => setHoveredCard(null)}
          whileHover={{ 
            scale: 1.02,
            transition: { duration: 0.2 }
          }}
        >
          <StatsCard 
            {...stat} 
            value={
              hoveredCard === index ? (
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ duration: 0.5 }}
                >
                  {stat.value}
                </motion.div>
              ) : stat.value
            }
          />
        </motion.div>
      ))}
    </motion.div>
  );
};
