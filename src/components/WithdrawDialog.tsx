
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PaymentMethodForm } from "@/components/PaymentMethodForm";
import { useToast } from "@/hooks/use-toast";
import { ArrowDownToLine } from "lucide-react";
import { useAppContext } from "@/context/AppContext";

interface WithdrawDialogProps {
  currentUserCurrency: string;
  isDataCollectorOrCoordinator: boolean;
  onWithdraw: (amount: number, method: string, bankDetails?: any) => Promise<boolean>;
}

export const WithdrawDialog: React.FC<WithdrawDialogProps> = ({
  currentUserCurrency,
  isDataCollectorOrCoordinator,
  onWithdraw,
}) => {
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawMethod, setWithdrawMethod] = useState("Bank of Khartoum");
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isBankakFormVisible, setIsBankakFormVisible] = useState(false);
  const [bankakAccountDetails, setBankakAccountDetails] = useState<any | null>(null);
  const { toast } = useToast();
  const { currentUser } = useAppContext();

  const handleWithdraw = async () => {
    setIsWithdrawing(true);
    try {
      const amount = parseFloat(withdrawAmount);
      if (isNaN(amount) || amount <= 0) {
        toast({
          title: "Invalid amount",
          description: "Please enter a valid amount to withdraw.",
          variant: "destructive",
        });
        return;
      }

      // For Bank of Khartoum, check if account details are provided
      if (withdrawMethod === "Bank of Khartoum" && !bankakAccountDetails && !currentUser?.bankAccount) {
        setIsBankakFormVisible(true);
        setIsWithdrawing(false);
        return;
      }

      // Use existing bank account details if available
      const additionalDetails = withdrawMethod === "Bank of Khartoum" 
        ? bankakAccountDetails || currentUser?.bankAccount 
        : null;

      const success = await onWithdraw(amount, withdrawMethod, additionalDetails);
      if (success) {
        toast({
          title: "Withdrawal request submitted",
          description: `Your withdrawal request of ${amount} ${currentUserCurrency} via ${withdrawMethod} has been submitted${isDataCollectorOrCoordinator ? ' to admin for approval' : ''}.`,
        });
        setIsWithdrawOpen(false);
        setWithdrawAmount("");
        setIsBankakFormVisible(false);
      }
    } finally {
      setIsWithdrawing(false);
    }
  };

  const handleBankakFormSubmit = (values: any) => {
    setBankakAccountDetails(values);
    setIsBankakFormVisible(false);
    
    toast({
      title: "Bankak account registered",
      description: "Your Bankak account details have been registered. You can now proceed with the withdrawal.",
    });
  };

  return (
    <Dialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
      <Button onClick={() => setIsWithdrawOpen(true)}>
        <ArrowDownToLine className="h-4 w-4 mr-2" />
        Withdraw Funds
      </Button>
      <DialogContent className="sm:max-w-[425px]">
        {isBankakFormVisible ? (
          <>
            <DialogHeader>
              <DialogTitle>Add Payment Method</DialogTitle>
              <DialogDescription>
                Please provide your bank account details to proceed with the withdrawal.
              </DialogDescription>
            </DialogHeader>
            <PaymentMethodForm 
              onSubmit={handleBankakFormSubmit}
              isSubmitting={isWithdrawing}
              defaultValues={currentUser?.bankAccount}
            />
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Withdraw Funds</DialogTitle>
              <DialogDescription>
                Enter the amount you wish to withdraw and select a withdrawal method.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">
                  Amount
                </Label>
                <Input
                  type="number"
                  id="amount"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="method" className="text-right">
                  Method
                </Label>
                <div className="col-span-3">
                  <Select onValueChange={setWithdrawMethod} defaultValue={withdrawMethod}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                      <SelectItem value="Bank of Khartoum">Bank of Khartoum (Bankak)</SelectItem>
                      <SelectItem value="PayPal">PayPal</SelectItem>
                      <SelectItem value="Mobile Money">Mobile Money</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {withdrawMethod === "Bank of Khartoum" && (currentUser?.bankAccount || bankakAccountDetails) && (
                <div className="border rounded p-3 bg-slate-50">
                  <p className="text-sm font-medium">Registered Bankak Account</p>
                  <div className="text-sm mt-1">
                    <p><span className="font-medium">Name:</span> {currentUser?.bankAccount?.accountName || bankakAccountDetails?.accountName}</p>
                    <p><span className="font-medium">Branch:</span> {currentUser?.bankAccount?.branch || bankakAccountDetails?.branch}</p>
                    <p><span className="font-medium">Account:</span> {currentUser?.bankAccount?.accountNumber || bankakAccountDetails?.accountNumber}</p>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => setIsWithdrawOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" onClick={handleWithdraw} disabled={isWithdrawing}>
                {isWithdrawing ? "Processing..." : isDataCollectorOrCoordinator ? "Request Withdrawal" : "Withdraw"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
