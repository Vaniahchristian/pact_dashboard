
import React from "react";
import { Check, ArrowUpRight, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Transaction } from "@/types";

interface PaymentNotificationProps {
  transaction: Transaction;
  onClose: () => void;
}

export const PaymentNotification: React.FC<PaymentNotificationProps> = ({
  transaction,
  onClose,
}) => {
  const navigate = useNavigate();
  
  const handleViewWallet = () => {
    navigate('/wallet');
    onClose();
  };
  
  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-green-100 p-2 rounded-full">
          <Check className="h-5 w-5 text-green-600" />
        </div>
        <div className="font-medium">Payment Received!</div>
      </div>
      
      <div className="p-3 bg-muted/50 rounded-md mb-3 flex justify-between items-center">
        <div>
          <div className="text-sm text-muted-foreground">Amount</div>
          <div className="text-lg font-bold flex items-center gap-1">
            <ArrowUpRight className="h-4 w-4 text-green-600" />
            {transaction.currency} {transaction.amount.toLocaleString()}
          </div>
        </div>
        <Wallet className="h-5 w-5 text-primary" />
      </div>
      
      <div className="text-sm mb-3">
        Payment for site visit has been added to your wallet. Thank you for your work!
      </div>
      
      <Button 
        onClick={handleViewWallet} 
        className="w-full"
      >
        View in Wallet
      </Button>
    </div>
  );
};
