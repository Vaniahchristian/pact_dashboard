
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, TrendingUp, ArrowUpRight, ArrowDownRight, AlertTriangle } from "lucide-react";
import { useAppContext } from "@/context/AppContext";

interface WalletBalanceProps {
  balance: number;
  currency: string;
}

export const WalletBalance: React.FC<WalletBalanceProps> = ({ balance, currency }) => {
  const { transactions, currentUser } = useAppContext();

  const formatBalance = (balance: number) => {
    return `${currency} ${balance.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };

  // Filter transactions for the current user
  const userTransactions = transactions.filter(t => t.userId === currentUser?.id);
  
  // Calculate user-specific budget metrics
  const userIncome = userTransactions
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const userExpenses = userTransactions
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);

  const budgetUsage = {
    totalBudget: userIncome + balance, // Total budget is current income plus balance
    used: userExpenses,
    remaining: balance,
    percentUsed: userExpenses > 0 ? Math.round((userExpenses / (userIncome + balance)) * 100) : 0,
  };
  
  const getBudgetColor = (percentUsed: number) => {
    if (percentUsed < 50) return "text-green-600";
    if (percentUsed < 80) return "text-amber-600";
    return "text-red-600";
  };

  // If user has no transactions, only show the basic balance card
  const hasTransactions = userTransactions.length > 0;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Account Balance
          </CardTitle>
          <CardDescription>
            Current balance in your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {formatBalance(balance)}
          </div>
          <div className="flex items-center gap-2 mt-3 text-sm">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="text-muted-foreground">
              All earnings auto-deposit to this balance
            </span>
          </div>
        </CardContent>
      </Card>

      {hasTransactions && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Budget Tracking
              {budgetUsage.percentUsed > 80 && (
                <AlertTriangle className="h-4 w-4 text-amber-500" />
              )}
            </CardTitle>
            <CardDescription>
              Your personal budget usage and remaining funds
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Remaining</p>
                <p className="text-2xl font-bold text-green-600">
                  {currency} {budgetUsage.remaining.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Budget</p>
                <p className="text-2xl font-bold">
                  {currency} {budgetUsage.totalBudget.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1">
                  <span className="text-sm">Budget Used</span>
                  <span className={`text-sm font-bold ${getBudgetColor(budgetUsage.percentUsed)}`}>
                    {budgetUsage.percentUsed}%
                  </span>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${
                    budgetUsage.percentUsed < 50 
                      ? "bg-green-600" 
                      : budgetUsage.percentUsed < 80 
                        ? "bg-amber-500" 
                        : "bg-red-600"
                  }`}
                  style={{ width: `${budgetUsage.percentUsed}%` }}
                ></div>
              </div>
              
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <ArrowUpRight className="h-4 w-4 text-green-600" />
                  <span>Income: {currency} {userIncome.toLocaleString()}</span>
                </div>
                
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <ArrowDownRight className="h-4 w-4 text-red-600" />
                  <span>Expenses: {currency} {userExpenses.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
