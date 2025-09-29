
import React, { useState } from "react";
import { Transaction } from "@/types";
import { TransactionCard } from "@/components/TransactionCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TransactionHistoryProps {
  transactions: Transaction[];
  showFilters?: boolean;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({ 
  transactions,
  showFilters = true 
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");

  // Filter transactions based on search and filter type
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (transaction.reference?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    
    if (filterType === "all") return matchesSearch;
    if (filterType === "credit") return transaction.type === "credit" && matchesSearch;
    if (filterType === "debit") return transaction.type === "debit" && matchesSearch;
    if (filterType === "site-visits") return transaction.siteVisitId !== undefined && matchesSearch;
    return matchesSearch;
  });

  // Sort transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  if (transactions.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-10 w-10 text-muted-foreground"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
              <line x1="3" x2="21" y1="9" y2="9" />
              <line x1="9" x2="9" y1="21" y2="9" />
            </svg>
          </div>
          <h3 className="text-lg font-medium">No Transactions Found</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Your transaction history will appear here after you make a transaction.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter Controls */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-2">
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="md:col-span-1"
          />
          
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Transactions</SelectItem>
              <SelectItem value="credit">Credits Only</SelectItem>
              <SelectItem value="debit">Debits Only</SelectItem>
              <SelectItem value="site-visits">Site Visits Only</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger>
              <SelectValue placeholder="Sort order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      
      {sortedTransactions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No transactions match your search</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {sortedTransactions.map((transaction) => (
            <TransactionCard key={transaction.id} transaction={transaction} />
          ))}
        </div>
      )}
    </div>
  );
};
