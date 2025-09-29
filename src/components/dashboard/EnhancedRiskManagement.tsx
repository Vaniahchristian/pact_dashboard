
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { AlertTriangle, ShieldCheck, BarChart, Activity } from 'lucide-react';
import FraudDetectionWidget from './FraudDetectionWidget';
import FraudPreventionDashboardWidget from './FraudPreventionDashboardWidget';
import TransactionMonitoringWidget from './TransactionMonitoringWidget';

export const EnhancedRiskManagement = () => {
  const [activeTab, setActiveTab] = useState('fraud-detection');
  
  return (
    <Card className="border-t-4 border-t-amber-500 hover:shadow-md transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-amber-50 to-transparent flex flex-row justify-between items-center">
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          Risk Management Center
        </CardTitle>
        <Tabs defaultValue="fraud-detection" className="w-auto" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 h-7">
            <TabsTrigger value="fraud-detection" className="text-xs px-2">Detection</TabsTrigger>
            <TabsTrigger value="prevention" className="text-xs px-2">Prevention</TabsTrigger>
            <TabsTrigger value="transactions" className="text-xs px-2">Transactions</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="p-0 overflow-hidden">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="p-4"
        >
          {activeTab === 'fraud-detection' && <FraudDetectionWidget />}
          {activeTab === 'prevention' && <FraudPreventionDashboardWidget />}
          {activeTab === 'transactions' && <TransactionMonitoringWidget />}
        </motion.div>
      </CardContent>
    </Card>
  );
};
