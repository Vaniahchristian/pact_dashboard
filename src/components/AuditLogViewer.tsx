import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { 
  Download, Search, FileText, Shield, Bell, CalendarCheck, 
  AlertTriangle, FileX, FileCheck, Clock, User, Users, Settings,
  Edit, Eye, ArrowRight, ArrowUpRight, Lock, Unlock, RefreshCw,
  Trash2, Archive, Undo, Check, X, Upload, FileUp, Info
} from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { exportAuditLogsToCSV, exportAuditLogsToJSON } from "@/utils/exportUtils";

interface AuditLogViewerProps {
  mmpId?: string;
  standalone?: boolean;
  actionFilter?: string;
  timeFilter?: string;
}

const AuditLogViewer: React.FC<AuditLogViewerProps> = ({ 
  mmpId, 
  standalone = false,
  actionFilter = "all",
  timeFilter = "all" 
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [localActionFilter, setLocalActionFilter] = useState<string>(actionFilter);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>(timeFilter);
  const [currentView, setCurrentView] = useState<'timeline' | 'table'>('timeline');
  const { toast } = useToast();

  const getActionIcon = (action: string) => {
    switch(action.toLowerCase()) {
      case 'upload': return <FileUp className="h-4 w-4 text-blue-500" />;
      case 'validation': return <Shield className="h-4 w-4 text-amber-500" />;
      case 'edit': return <Edit className="h-4 w-4 text-purple-500" />;
      case 'view': return <Eye className="h-4 w-4 text-gray-500" />;
      case 'approval request': return <ArrowUpRight className="h-4 w-4 text-blue-500" />;
      case 'approve': return <Check className="h-4 w-4 text-green-500" />;
      case 'reject': return <X className="h-4 w-4 text-red-500" />;
      case 'lock': return <Lock className="h-4 w-4 text-orange-500" />;
      case 'unlock': return <Unlock className="h-4 w-4 text-green-500" />;
      case 'reset': return <RefreshCw className="h-4 w-4 text-blue-500" />;
      case 'delete': return <Trash2 className="h-4 w-4 text-red-500" />;
      case 'archive': return <Archive className="h-4 w-4 text-gray-500" />;
      case 'restore': return <Undo className="h-4 w-4 text-purple-500" />;
      case 'compliance check': return <Shield className="h-4 w-4 text-green-500" />;
      case 'security alert': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const mockAuditLogs = [
    {
      id: '1',
      timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
      action: 'Upload',
      category: 'Document',
      description: 'Initial MMP file upload',
      user: 'Sarah Williams',
      userRole: 'Supervisor',
      details: 'File uploaded successfully with 45 site entries',
      metadata: {
        fileSize: '2.3MB',
        fileType: 'Excel',
        totalEntries: 45,
        validEntries: 43,
        warnings: 2
      },
      status: 'success',
      ipAddress: '192.168.1.100',
      deviceInfo: 'Chrome / Windows 10',
      relatedRecords: ['DOC-2023-45', 'BATCH-789']
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 14 * 60000).toISOString(),
      action: 'Validation',
      category: 'System',
      description: 'Automated validation check',
      user: 'System',
      userRole: 'Automated',
      details: '3 warnings found in data validation',
      metadata: {
        checksPerformed: 12,
        passedChecks: 9,
        failedChecks: 3,
        warningDetails: [
          'Missing coordinates in 2 sites',
          'Invalid date format in 1 entry'
        ]
      },
      status: 'warning',
      relatedRecords: ['VAL-2023-123']
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 13 * 60000).toISOString(),
      action: 'Edit',
      category: 'Data',
      description: 'Modified site entries',
      user: 'Mike Johnson',
      userRole: 'Data Officer',
      details: 'Updated coordinates for 2 sites',
      metadata: {
        changedFields: ['coordinates', 'lastModified'],
        previousValues: {
          coordinates: 'N/A',
          lastModified: '2023-04-16'
        },
        newValues: {
          coordinates: '12.34N, 56.78E',
          lastModified: '2023-04-17'
        }
      },
      status: 'success',
      ipAddress: '192.168.1.101',
      deviceInfo: 'Firefox / MacOS'
    },
    {
      id: '4',
      timestamp: new Date(Date.now() - 12 * 60000).toISOString(),
      action: 'Approval Request',
      category: 'Workflow',
      description: 'Submitted for approval',
      user: 'Mike Johnson',
      userRole: 'ICT',
      details: 'MMP submitted to approval workflow',
      metadata: {
        approver: 'Jane Smith',
        submissionDate: '2023-04-17',
        comments: 'Ready for review'
      },
      status: 'pending',
      relatedRecords: ['APR-2023-001']
    },
    {
      id: '5',
      timestamp: new Date(Date.now() - 11 * 60000).toISOString(),
      action: 'Compliance Check',
      category: 'Compliance',
      description: 'Automated compliance verification',
      user: 'System',
      userRole: 'Automated',
      details: 'All compliance checks passed',
      metadata: {
        checksPerformed: 5,
        passedChecks: 5,
        failedChecks: 0
      },
      status: 'success',
      relatedRecords: ['CMP-2023-005']
    },
    {
      id: '6',
      timestamp: new Date(Date.now() - 10 * 60000).toISOString(),
      action: 'Approve',
      category: 'Workflow',
      description: 'First-level approval completed',
      user: 'Jane Smith',
      userRole: 'Financial Admin',
      details: 'Approved with comment: "Budget allocation verified"',
      metadata: {
        approvalDate: '2023-04-18',
        comments: 'Budget verified and approved',
        approvedAmount: '$50,000'
      },
      status: 'success',
      ipAddress: '192.168.1.102',
      deviceInfo: 'Safari / iOS'
    },
    {
      id: '7',
      timestamp: new Date(Date.now() - 9 * 60000).toISOString(),
      action: 'Approve',
      category: 'Workflow',
      description: 'MMP fully approved',
      user: 'John Doe',
      userRole: 'Admin',
      details: 'MMP approved for implementation',
      metadata: {
        approvalDate: '2023-04-19',
        comments: 'Approved for immediate implementation',
        finalBudget: '$50,000'
      },
      status: 'success',
      ipAddress: '192.168.1.103',
      deviceInfo: 'Edge / Windows 10'
    },
    {
      id: '8',
      timestamp: new Date(Date.now() - 8 * 60000).toISOString(),
      action: 'View',
      category: 'Access',
      description: 'MMP file viewed',
      user: 'Alex Johnson',
      userRole: 'Coordinator',
      details: 'Read-only access recorded',
      metadata: {
        accessType: 'Read-only',
        duration: '5 minutes'
      },
      status: 'info',
      ipAddress: '192.168.1.104',
      deviceInfo: 'Chrome / Android'
    },
    {
      id: '9',
      timestamp: new Date(Date.now() - 7 * 60000).toISOString(),
      action: 'Edit',
      category: 'Security',
      description: 'Unauthorized modification attempt',
      user: 'Alex Johnson',
      userRole: 'Coordinator',
      details: 'Attempted to modify budget allocation without permission',
      metadata: {
        attemptedField: 'Budget Allocation',
        permissionType: 'Write',
        accessStatus: 'Denied'
      },
      status: 'error',
      ipAddress: '192.168.1.104',
      deviceInfo: 'Chrome / Android'
    },
    {
      id: '10',
      timestamp: new Date(Date.now() - 6 * 60000).toISOString(),
      action: 'Security Alert',
      category: 'Security',
      description: 'Unauthorized modification detected',
      user: 'System',
      userRole: 'Automated',
      details: 'Security alert sent to Admin and ICT',
      metadata: {
        alertType: 'Unauthorized Access',
        severity: 'High',
        affectedUser: 'Alex Johnson'
      },
      status: 'error',
      relatedRecords: ['ALR-2023-012']
    }
  ];

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800">Success</Badge>;
      case 'warning':
        return <Badge className="bg-amber-100 text-amber-800">Warning</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Error</Badge>;
      case 'info':
        return <Badge className="bg-blue-100 text-blue-800">Info</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const filteredLogs = mockAuditLogs
    .filter(log => {
      if (searchQuery === "") return true;
      return (
        log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.action.toLowerCase().includes(searchQuery.toLowerCase())
      );
    })
    .filter(log => localActionFilter === "all" || log.action.toLowerCase() === localActionFilter.toLowerCase())
    .filter(log => categoryFilter === "all" || log.category.toLowerCase() === categoryFilter.toLowerCase())
    .filter(log => {
      if (dateRange === "all") return true;
      const logDate = new Date(log.timestamp);
      const now = new Date();
      switch(dateRange) {
        case "today":
          return logDate.toDateString() === now.toDateString();
        case "week":
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return logDate >= weekAgo;
        case "month":
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return logDate >= monthAgo;
        default:
          return true;
      }
    });

  const handleExport = (format: 'csv' | 'json') => {
    try {
      if (format === 'csv') {
        exportAuditLogsToCSV(filteredLogs);
      } else {
        exportAuditLogsToJSON(filteredLogs);
      }
      
      toast({
        title: "Export Successful",
        description: `Audit report successfully exported in ${format.toUpperCase()} format.`,
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting the audit report.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className={standalone ? "" : "mt-6"}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          {standalone ? "Audit Logs" : "MMP Audit Trail"}
        </CardTitle>
        <CardDescription>
          Comprehensive audit trail showing all actions and changes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search audit logs..."
                className="pl-8 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Select value={localActionFilter} onValueChange={setLocalActionFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="upload">Upload</SelectItem>
                  <SelectItem value="validation">Validation</SelectItem>
                  <SelectItem value="edit">Edit</SelectItem>
                  <SelectItem value="view">View</SelectItem>
                  <SelectItem value="approval">Approval</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="document">Document</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="data">Data</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Time Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">Last 7 Days</SelectItem>
                  <SelectItem value="month">Last 30 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              variant={currentView === 'timeline' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentView('timeline')}
            >
              Timeline View
            </Button>
            <Button
              variant={currentView === 'table' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentView('table')}
            >
              Table View
            </Button>
          </div>

          <div className="border rounded-md">
            <ScrollArea className="h-[400px]">
              {currentView === 'timeline' && (
                <div className="relative p-4">
                  <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
                  <div className="space-y-6 pl-10">
                    {filteredLogs.map((log) => (
                      <div key={log.id} className="relative">
                        <div className="absolute -left-[34px] p-2 rounded-full bg-background border">
                          {getActionIcon(log.action)}
                        </div>
                        <Card>
                          <CardContent className="pt-6">
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{log.action}</span>
                                  {getStatusBadge(log.status)}
                                </div>
                                <HoverCard>
                                  <HoverCardTrigger>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                      <Clock className="h-3 w-3 mr-1" />
                                      {format(new Date(log.timestamp), 'MMM d, yyyy h:mm a')}
                                    </div>
                                  </HoverCardTrigger>
                                  <HoverCardContent className="w-80">
                                    <div className="space-y-2">
                                      <p className="text-sm font-medium">Event Details</p>
                                      <div className="text-sm">
                                        <p><span className="font-medium">IP Address:</span> {log.ipAddress}</p>
                                        <p><span className="font-medium">Device:</span> {log.deviceInfo}</p>
                                        {log.relatedRecords && (
                                          <p><span className="font-medium">Related Records:</span> {log.relatedRecords.join(', ')}</p>
                                        )}
                                      </div>
                                    </div>
                                  </HoverCardContent>
                                </HoverCard>
                              </div>
                              <p className="text-sm">{log.description}</p>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <User className="h-3 w-3" />
                                <span>{log.user}</span>
                                <Badge variant="outline" className="text-xs">
                                  {log.userRole}
                                </Badge>
                              </div>
                              {log.metadata && (
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button variant="outline" size="sm" className="mt-2">
                                      View Details
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-80">
                                    <div className="space-y-2">
                                      <h4 className="font-medium">Detailed Information</h4>
                                      <div className="text-sm space-y-1">
                                        {Object.entries(log.metadata).map(([key, value]) => (
                                          <div key={key}>
                                            <span className="font-medium capitalize">
                                              {key.replace(/([A-Z])/g, ' $1').trim()}:
                                            </span>
                                            <span className="ml-1">
                                              {Array.isArray(value) 
                                                ? value.join(', ')
                                                : typeof value === 'object'
                                                  ? JSON.stringify(value, null, 2)
                                                  : String(value)
                                              }
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </PopoverContent>
                                </Popover>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentView === 'table' && (
                <div className="w-full">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Action</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Details</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getActionIcon(log.action)}
                              <span>{log.action}</span>
                            </div>
                          </TableCell>
                          <TableCell>{log.description}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span>{log.user}</span>
                              <span className="text-xs text-muted-foreground">{log.userRole}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <HoverCard>
                              <HoverCardTrigger>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3 text-muted-foreground" />
                                  {format(new Date(log.timestamp), 'MMM d, yyyy h:mm a')}
                                </div>
                              </HoverCardTrigger>
                              <HoverCardContent className="w-80">
                                <div className="space-y-2">
                                  <p className="text-sm font-medium">Event Details</p>
                                  <div className="text-sm">
                                    <p><span className="font-medium">IP Address:</span> {log.ipAddress}</p>
                                    <p><span className="font-medium">Device:</span> {log.deviceInfo}</p>
                                    {log.relatedRecords && (
                                      <p><span className="font-medium">Related Records:</span> {log.relatedRecords.join(', ')}</p>
                                    )}
                                  </div>
                                </div>
                              </HoverCardContent>
                            </HoverCard>
                          </TableCell>
                          <TableCell>{getStatusBadge(log.status)}</TableCell>
                          <TableCell>
                            <div className="max-w-[300px]">
                              <p className="truncate">{log.details}</p>
                              {log.metadata && (
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button variant="link" size="sm" className="h-auto p-0">
                                      View Details
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-80">
                                    <div className="space-y-2">
                                      <h4 className="font-medium">Detailed Information</h4>
                                      <div className="text-sm space-y-1">
                                        {Object.entries(log.metadata).map(([key, value]) => (
                                          <div key={key}>
                                            <span className="font-medium capitalize">
                                              {key.replace(/([A-Z])/g, ' $1').trim()}:
                                            </span>
                                            <span className="ml-1">
                                              {Array.isArray(value) 
                                                ? value.join(', ')
                                                : typeof value === 'object'
                                                  ? JSON.stringify(value, null, 2)
                                                  : String(value)
                                              }
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </PopoverContent>
                                </Popover>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </ScrollArea>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Showing {filteredLogs.length} of {mockAuditLogs.length} logs
            </p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Audit Report
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleExport('csv')}>
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('json')}>
                  Export as JSON
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuditLogViewer;
