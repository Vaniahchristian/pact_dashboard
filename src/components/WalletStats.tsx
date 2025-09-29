
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppContext } from "@/context/AppContext";
import { Transaction } from "@/types";
import { PiggyBank, Wallet, TrendingUp, CircleDollarSign } from "lucide-react";

export const WalletStats = () => {
  const { transactions, currentUser } = useAppContext();

  // Filter transactions for current user
  const userTransactions = transactions.filter(
    (t) => t.userId === currentUser?.id
  );

  const getTotalEarnings = () => {
    return userTransactions
      .filter((t) => t.type === "credit")
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getMonthlyEarnings = () => {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    
    return userTransactions
      .filter((t) => {
        const date = new Date(t.createdAt);
        return (
          t.type === "credit" &&
          date.getMonth() === thisMonth &&
          date.getFullYear() === thisYear
        );
      })
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getPendingPayments = () => {
    return userTransactions
      .filter((t) => t.type === "credit" && t.status === "pending")
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getAvgTransactionValue = () => {
    const creditTransactions = userTransactions.filter((t) => t.type === "credit");
    if (creditTransactions.length === 0) return 0;
    const total = creditTransactions.reduce((sum, t) => sum + t.amount, 0);
    return total / creditTransactions.length;
  };

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{currentUser?.wallet.currency} {getTotalEarnings().toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Lifetime earnings from activities</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Earnings</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{currentUser?.wallet.currency} {getMonthlyEarnings().toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Earnings this month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
          <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{currentUser?.wallet.currency} {getPendingPayments().toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Awaiting approval/processing</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Earning</CardTitle>
          <PiggyBank className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{currentUser?.wallet.currency} {getAvgTransactionValue().toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Per transaction</p>
        </CardContent>
      </Card>
    </div>
  );
};
