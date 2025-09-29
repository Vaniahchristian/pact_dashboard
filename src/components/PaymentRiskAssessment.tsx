
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, ShieldAlert, ShieldCheck } from "lucide-react";

interface PaymentRiskProps {
  amount: number;
  frequency: number;
  userRole: string;
}

export const PaymentRiskAssessment: React.FC<PaymentRiskProps> = ({
  amount,
  frequency,
  userRole,
}) => {
  const getRiskLevel = () => {
    if (amount > 1500 || frequency > 5) return "high";
    if (amount > 500 || frequency > 3) return "medium";
    return "low";
  };

  const riskLevel = getRiskLevel();

  return (
    <Card className="overflow-hidden border-t-4 transition-all hover:shadow-md" 
          style={{ borderTopColor: riskLevel === "low" ? "#10b981" : riskLevel === "medium" ? "#f59e0b" : "#ef4444" }}>
      <CardHeader className="bg-slate-50 pb-2">
        <CardTitle className="flex items-center gap-2 text-xl">
          {riskLevel === "low" && <ShieldCheck className="h-5 w-5 text-green-500" />}
          {riskLevel === "medium" && <Shield className="h-5 w-5 text-amber-500" />}
          {riskLevel === "high" && <ShieldAlert className="h-5 w-5 text-red-500" />}
          Payment Risk Assessment
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Risk Level</span>
            <Badge
              variant={riskLevel === "low" ? "default" : riskLevel === "medium" ? "secondary" : "destructive"}
              className="animate-fade-in"
            >
              {riskLevel.toUpperCase()}
            </Badge>
          </div>
          <div className="space-y-2 text-sm">
            <p className="font-medium">Required Approvals:</p>
            {riskLevel === "low" && <p className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>Supervisor verification only</p>}
            {riskLevel === "medium" && (
              <>
                <p className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>Supervisor verification</p>
                <p className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>FOM approval</p>
              </>
            )}
            {riskLevel === "high" && (
              <>
                <p className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>Supervisor verification</p>
                <p className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>FOM approval</p>
                <p className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>Admin approval with MFA</p>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
