
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Clock, ShieldCheck, BarChart, ArrowUpDown, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Transaction {
  id: string;
  amount: number;
  timestamp: string;
  status: "normal" | "suspicious" | "blocked";
}

interface TransactionMonitoringProps {
  recentTransactions: Transaction[];
}

export const TransactionMonitoring: React.FC<TransactionMonitoringProps> = ({
  recentTransactions,
}) => {
  // Add animation states for new transactions
  const [animateIndex, setAnimateIndex] = useState<number | null>(null);
  const [transactionStats, setTransactionStats] = useState({
    total: 0,
    suspicious: 0,
    blocked: 0
  });
  
  // Calculate transaction statistics
  useEffect(() => {
    const stats = recentTransactions.reduce((acc, transaction) => {
      acc.total++;
      if (transaction.status === "suspicious") acc.suspicious++;
      if (transaction.status === "blocked") acc.blocked++;
      return acc;
    }, { total: 0, suspicious: 0, blocked: 0 });
    
    setTransactionStats(stats);
  }, [recentTransactions]);
  
  // Simulate new transaction coming in
  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * recentTransactions.length);
      setAnimateIndex(randomIndex);
      setTimeout(() => setAnimateIndex(null), 2000);
    }, 8000);
    
    return () => clearInterval(interval);
  }, [recentTransactions.length]);

  const getStatusIcon = (status: string) => {
    switch(status) {
      case "normal":
        return <ShieldCheck className="h-4 w-4 text-green-500" />;
      case "suspicious":
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case "blocked":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Card className="overflow-hidden border-t-4 border-t-purple-500 transition-all hover:shadow-md">
      <CardHeader className="bg-slate-50 pb-2">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Clock className="h-5 w-5 text-primary" />
          Real-Time Transaction Monitor
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          {/* Transaction Stats */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-slate-100 rounded p-2 text-center">
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="font-bold">{transactionStats.total}</p>
            </div>
            <div className="bg-amber-50 rounded p-2 text-center">
              <p className="text-xs text-amber-700">Suspicious</p>
              <p className="font-bold text-amber-700">{transactionStats.suspicious}</p>
            </div>
            <div className="bg-red-50 rounded p-2 text-center">
              <p className="text-xs text-red-700">Blocked</p>
              <p className="font-bold text-red-700">{transactionStats.blocked}</p>
            </div>
          </div>

          {/* Transaction Activity Graph */}
          <div className="flex items-center justify-between h-8 rounded-md bg-slate-100 px-2 overflow-hidden">
            <div className="flex gap-0.5 items-end">
              <div className="w-1 h-3 bg-green-500 rounded-sm"></div>
              <div className="w-1 h-5 bg-green-500 rounded-sm"></div>
              <div className="w-1 h-2 bg-green-500 rounded-sm"></div>
              <div className="w-1 h-4 bg-green-500 rounded-sm"></div>
              <div className="w-1 h-3 bg-amber-500 rounded-sm animate-pulse"></div>
              <div className="w-1 h-1 bg-green-500 rounded-sm"></div>
              <div className="w-1 h-6 bg-red-500 rounded-sm"></div>
              <div className="w-1 h-3 bg-green-500 rounded-sm"></div>
              <div className="w-1 h-2 bg-green-500 rounded-sm"></div>
              <div className="w-1 h-5 bg-amber-500 rounded-sm"></div>
            </div>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </div>
          
          {/* Recent Transactions List */}
          {recentTransactions.map((transaction, index) => (
            <div 
              key={transaction.id} 
              className={cn(
                "flex items-center justify-between border-b pb-2 hover:bg-slate-50 p-2 rounded-md transition-colors",
                animateIndex === index && "bg-blue-50 animate-pulse border-blue-200"
              )}
            >
              <div className="flex items-center gap-2">
                {getStatusIcon(transaction.status)}
                <span className="font-medium">SDG {transaction.amount}</span>
                <span className="text-xs text-gray-500">
                  {new Date(transaction.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    transaction.status === "normal"
                      ? "default"
                      : transaction.status === "suspicious"
                      ? "secondary"
                      : "destructive"
                  }
                  className={transaction.status !== "normal" ? "animate-pulse-slow" : ""}
                >
                  {transaction.status}
                </Badge>
                <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
              </div>
            </div>
          ))}
          
          <Button variant="outline" className="w-full group flex items-center justify-center gap-1">
            <Eye className="h-4 w-4" />
            View All Transactions
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
