
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { 
  Shield, Download, CheckCircle, XCircle, AlertTriangle, 
  Info, Clock, FileText, ChartBar, ListChecks, ArrowUpRight
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Mock data for compliance checks
const mockComplianceChecks = [
  {
    id: '1',
    rule: 'Complete Site Information',
    description: 'All site entries must have complete information',
    status: 'passed',
    details: '45/45 site entries have complete information',
    critical: true,
    lastChecked: new Date(Date.now() - 2 * 3600000).toISOString()
  },
  {
    id: '2',
    rule: 'Valid Date Formats',
    description: 'All dates must be in the correct format',
    status: 'failed',
    details: '2 entries with invalid date format: Site ID SC10034, SC10042',
    critical: true,
    lastChecked: new Date(Date.now() - 2 * 3600000).toISOString()
  },
  {
    id: '3',
    rule: 'Budget Consistency',
    description: 'All budget entries must be consistent with guidelines',
    status: 'passed',
    details: 'All budget entries follow the approved allocation model',
    critical: true,
    lastChecked: new Date(Date.now() - 2 * 3600000).toISOString()
  },
  {
    id: '4',
    rule: 'Geographic Coordinates',
    description: 'All sites must have valid GPS coordinates',
    status: 'warning',
    details: '1 site with potentially incorrect coordinates (out of expected region)',
    critical: false,
    lastChecked: new Date(Date.now() - 2 * 3600000).toISOString()
  },
  {
    id: '5',
    rule: 'Required Approvals',
    description: 'All required approvals must be completed',
    status: 'pending',
    details: 'Awaiting final approval from Admin',
    critical: true,
    lastChecked: new Date(Date.now() - 2 * 3600000).toISOString()
  },
  {
    id: '6',
    rule: 'MoDa Integration',
    description: 'Sites should be verified in MoDa database',
    status: 'warning',
    details: '5 sites not found in MoDa system',
    critical: false,
    lastChecked: new Date(Date.now() - 2 * 3600000).toISOString()
  }
];

// Mock data for compliance policies
const mockPolicies = [
  { id: '1', name: 'Data Integrity Policy', status: 'active', lastUpdated: new Date(Date.now() - 90 * 24 * 3600000).toISOString() },
  { id: '2', name: 'Approval Workflow Policy', status: 'active', lastUpdated: new Date(Date.now() - 45 * 24 * 3600000).toISOString() },
  { id: '3', name: 'Budget Validation Rules', status: 'active', lastUpdated: new Date(Date.now() - 30 * 24 * 3600000).toISOString() },
  { id: '4', name: 'Geographic Validation Policy', status: 'active', lastUpdated: new Date(Date.now() - 60 * 24 * 3600000).toISOString() },
  { id: '5', name: 'Required Fields Policy', status: 'active', lastUpdated: new Date(Date.now() - 120 * 24 * 3600000).toISOString() }
];

interface ComplianceTrackerProps {
  mmpId?: string; // Optional: for a specific MMP
  standalone?: boolean; // Whether this is a standalone view or embedded
}

const ComplianceTracker: React.FC<ComplianceTrackerProps> = ({ mmpId, standalone = false }) => {
  const [activeTab, setActiveTab] = useState<string>("compliance-checks");
  const { toast } = useToast();

  const totalChecks = mockComplianceChecks.length;
  const passedChecks = mockComplianceChecks.filter(check => check.status === 'passed').length;
  const warningChecks = mockComplianceChecks.filter(check => check.status === 'warning').length;
  const failedChecks = mockComplianceChecks.filter(check => check.status === 'failed').length;
  const pendingChecks = mockComplianceChecks.filter(check => check.status === 'pending').length;

  const complianceScore = Math.round((passedChecks / totalChecks) * 100);
  
  const getComplianceStatus = () => {
    const criticalFails = mockComplianceChecks
      .filter(check => check.critical && check.status === 'failed')
      .length;
      
    if (criticalFails > 0) return { label: 'Non-Compliant', color: 'bg-red-100 text-red-800' };
    if (failedChecks > 0 || warningChecks > 0) return { label: 'Needs Attention', color: 'bg-amber-100 text-amber-800' };
    if (pendingChecks > 0) return { label: 'Pending Verification', color: 'bg-blue-100 text-blue-800' };
    return { label: 'Fully Compliant', color: 'bg-green-100 text-green-800' };
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'passed':
        return <Badge className="bg-green-100 text-green-800">Passed</Badge>;
      case 'warning':
        return <Badge className="bg-amber-100 text-amber-800">Warning</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      case 'pending':
        return <Badge className="bg-blue-100 text-blue-800">Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleRunCompliance = () => {
    toast({
      description: "Compliance check started. This may take a few moments."
    });
    
    // Simulate compliance check completion
    setTimeout(() => {
      toast({
        title: "Compliance Check Complete",
        description: "All compliance rules have been verified."
      });
    }, 2000);
  };

  const handleDownloadReport = () => {
    // Generate report data
    const timestamp = format(new Date(), 'yyyy-MM-dd_HH-mm');
    const fileName = `compliance_report_${timestamp}.csv`;
    
    // Create CSV content with headers
    let csvContent = "Rule,Description,Status,Critical,Last Verified,Details\n";
    
    // Add each compliance check as a row
    mockComplianceChecks.forEach(check => {
      // Format the data and escape any commas in text fields
      const row = [
        `"${check.rule}"`,
        `"${check.description}"`,
        `"${check.status}"`,
        `"${check.critical ? 'Yes' : 'No'}"`,
        `"${format(new Date(check.lastChecked), 'MMM d, yyyy h:mm a')}"`,
        `"${check.details.replace(/"/g, '""')}"`
      ];
      csvContent += row.join(",") + "\n";
    });
    
    // Create a downloadable blob
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // Create download link and trigger it
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Report Downloaded",
      description: `Compliance report has been downloaded as ${fileName}`
    });
  };

  // Handle policy report download
  const handlePolicyReportDownload = () => {
    const timestamp = format(new Date(), 'yyyy-MM-dd_HH-mm');
    const fileName = `policy_report_${timestamp}.csv`;
    
    // Create CSV content with headers
    let csvContent = "Policy Name,Status,Last Updated\n";
    
    // Add each policy as a row
    mockPolicies.forEach(policy => {
      const row = [
        `"${policy.name}"`,
        `"${policy.status}"`,
        `"${format(new Date(policy.lastUpdated), 'MMM d, yyyy')}"`
      ];
      csvContent += row.join(",") + "\n";
    });
    
    // Create a downloadable blob
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // Create download link and trigger it
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Policy Report Downloaded",
      description: `Policy report has been downloaded as ${fileName}`
    });
  };

  // Handle summary report download
  const handleSummaryReportDownload = () => {
    const timestamp = format(new Date(), 'yyyy-MM-dd_HH-mm');
    const fileName = `compliance_summary_${timestamp}.pdf`;
    
    // In a real app, this would generate a PDF
    // For now, we'll just show a toast notification
    
    toast({
      title: "Summary Report Generated",
      description: "The PDF report would be downloaded in a real application."
    });
  };

  const complianceStatus = getComplianceStatus();

  return (
    <Card className={standalone ? "" : "mt-6"}>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Compliance Tracking
            </CardTitle>
            <CardDescription>
              Verification of regulatory compliance and policy adherence
            </CardDescription>
          </div>
          
          <Badge className={complianceStatus.color}>
            {complianceStatus.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="compliance-checks">Compliance Checks</TabsTrigger>
            <TabsTrigger value="policies">Policies</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
          </TabsList>
          
          <TabsContent value="compliance-checks">
            {/* Compliance Checks Table */}
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rule</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Critical</TableHead>
                    <TableHead>Last Verified</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockComplianceChecks.map((check) => (
                    <TableRow key={check.id}>
                      <TableCell className="font-medium">{check.rule}</TableCell>
                      <TableCell>{check.description}</TableCell>
                      <TableCell>{getStatusBadge(check.status)}</TableCell>
                      <TableCell>
                        {check.critical ? 
                          <span className="flex items-center text-red-600">
                            <AlertTriangle className="h-4 w-4 mr-1" /> Yes
                          </span> : 
                          <span className="text-muted-foreground">No</span>
                        }
                      </TableCell>
                      <TableCell>
                        {format(new Date(check.lastChecked), 'MMM d, h:mm a')}
                      </TableCell>
                      <TableCell className="max-w-[250px] break-words">{check.details}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div className="mt-4 flex justify-between">
              <Button variant="outline" onClick={() => handleRunCompliance()}>
                Re-Run Compliance Checks
              </Button>
              <Button variant="outline" onClick={handleDownloadReport}>
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="policies">
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Policy Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPolicies.map((policy) => (
                    <TableRow key={policy.id}>
                      <TableCell className="font-medium">{policy.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-green-50 text-green-800">
                          {policy.status.charAt(0).toUpperCase() + policy.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(policy.lastUpdated), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">View Details</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="outline" onClick={handlePolicyReportDownload}>
                <Download className="h-4 w-4 mr-2" />
                Export Policy Report
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="summary">
            <div className="space-y-6">
              {/* Compliance Score Card */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Compliance Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center space-y-2">
                      <div className="text-4xl font-bold">{complianceScore}%</div>
                      <Progress value={complianceScore} className="w-full h-2" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Check Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-1" /> Passed
                        </div>
                        <span>{passedChecks}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center">
                          <AlertTriangle className="h-4 w-4 text-amber-500 mr-1" /> Warnings
                        </div>
                        <span>{warningChecks}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center">
                          <XCircle className="h-4 w-4 text-red-500 mr-1" /> Failed
                        </div>
                        <span>{failedChecks}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-blue-500 mr-1" /> Pending
                        </div>
                        <span>{pendingChecks}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Last Verified</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col">
                      <span className="text-lg">
                        {format(new Date(Date.now() - 2 * 3600000), 'MMM d, yyyy')}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(Date.now() - 2 * 3600000), 'h:mm a')}
                      </span>
                      <span className="text-xs text-muted-foreground mt-1">
                        By: System Automation
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Critical Issues Summary */}
              {(failedChecks > 0 || warningChecks > 0) && (
                <Card className="border-amber-200 bg-amber-50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-amber-800 flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2" />
                      Issues Requiring Attention
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {mockComplianceChecks
                        .filter(check => check.status === 'failed' || check.status === 'warning')
                        .map(check => (
                          <li key={check.id} className="flex items-start gap-2">
                            {check.status === 'failed' ? 
                              <XCircle className="h-4 w-4 text-red-500 mt-0.5" /> : 
                              <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
                            }
                            <div>
                              <div className="font-medium">{check.rule}</div>
                              <div className="text-sm text-muted-foreground">{check.details}</div>
                            </div>
                          </li>
                        ))
                      }
                    </ul>
                  </CardContent>
                  <CardFooter className="border-t border-amber-200 bg-amber-50/50 flex justify-end">
                    <Button size="sm" variant="outline" className="text-amber-800 border-amber-300">
                      Fix Issues
                    </Button>
                  </CardFooter>
                </Card>
              )}
              
              <div className="flex justify-end">
                <Button onClick={handleSummaryReportDownload} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download Summary Report
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ComplianceTracker;
