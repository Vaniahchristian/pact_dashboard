
import React from "react";
import { FraudDetection } from "@/components/FraudDetection";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FraudDetectionWidgetProps {
  className?: string;
}

const FraudDetectionWidget = ({ className }: FraudDetectionWidgetProps) => {
  return (
    <div className={cn("w-full", className)}>
      <FraudDetection 
        recentTransactions={18} 
        unusualPatterns={true} 
        highValueTransactions={false} 
      />
    </div>
  );
};

export default FraudDetectionWidget;
