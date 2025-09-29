
import React from "react";
import { TransactionMonitoring } from "@/components/TransactionMonitoring";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface TransactionMonitoringWidgetProps {
  className?: string;
}

const TransactionMonitoringWidget = ({ className }: TransactionMonitoringWidgetProps) => {
  // Mock data for transactions
  const recentTransactions = [
    { id: "tx1", amount: 2500, timestamp: new Date().toISOString(), status: "normal" as const },
    { id: "tx2", amount: 1200, timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), status: "normal" as const },
    { id: "tx3", amount: 5000, timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), status: "suspicious" as const },
    { id: "tx4", amount: 350, timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), status: "normal" as const },
    { id: "tx5", amount: 8000, timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), status: "blocked" as const },
  ];

  return (
    <div className={cn("w-full", className)}>
      <TransactionMonitoring recentTransactions={recentTransactions} />
    </div>
  );
};

export default TransactionMonitoringWidget;
