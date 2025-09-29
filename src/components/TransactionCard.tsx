
import React from "react";
import { Transaction } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

interface TransactionCardProps {
  transaction: Transaction;
}

export const TransactionCard: React.FC<TransactionCardProps> = ({ transaction }) => {
  const getStatusIcon = () => {
    switch (transaction.status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className={`mt-1 rounded-full p-2 ${
              transaction.type === 'credit' 
                ? 'bg-green-100 text-green-600' 
                : 'bg-red-100 text-red-600'
            }`}>
              {transaction.type === 'credit' 
                ? <ArrowUpRight className="h-4 w-4" />
                : <ArrowDownRight className="h-4 w-4" />
              }
            </div>
            <div>
              <p className="font-semibold">{transaction.description}</p>
              <p className="text-sm text-muted-foreground">
                {transaction.reference && `Ref: ${transaction.reference}`}
              </p>
              {transaction.siteVisitId && (
                <p className="text-sm text-muted-foreground">
                  Site Visit ID: {transaction.siteVisitId}
                </p>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end gap-2">
              <span className={`font-bold ${
                transaction.type === 'credit' 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                {transaction.type === 'credit' ? '+' : '-'}
                {transaction.currency} {transaction.amount.toLocaleString()}
              </span>
              {getStatusIcon()}
            </div>
            <p className="text-sm text-muted-foreground">{formatDate(transaction.createdAt)}</p>
          </div>
        </div>
        
        {(transaction.taskDetails || transaction.operationalCosts) && (
          <div className="mt-4 pt-4 border-t">
            {transaction.taskDetails && (
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">Base Amount:</span>
                <span className="text-right">{transaction.currency} {transaction.taskDetails.baseAmount}</span>
                <span className="text-muted-foreground">Distance Fee:</span>
                <span className="text-right">{transaction.currency} {transaction.taskDetails.distanceFee}</span>
                <span className="text-muted-foreground">Complexity Fee:</span>
                <span className="text-right">{transaction.currency} {transaction.taskDetails.complexityFee}</span>
                <span className="text-muted-foreground">Urgency Fee:</span>
                <span className="text-right">{transaction.currency} {transaction.taskDetails.urgencyFee}</span>
              </div>
            )}
            {transaction.operationalCosts && (
              <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                <span className="text-muted-foreground">Permit Fees:</span>
                <span className="text-right">{transaction.currency} {transaction.operationalCosts.permitFees}</span>
                <span className="text-muted-foreground">Transportation:</span>
                <span className="text-right">{transaction.currency} {transaction.operationalCosts.transportationFees}</span>
                <span className="text-muted-foreground">Logistics:</span>
                <span className="text-right">{transaction.currency} {transaction.operationalCosts.logisticsFees}</span>
                <span className="text-muted-foreground">Other Fees:</span>
                <span className="text-right">{transaction.currency} {transaction.operationalCosts.otherFees}</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
