import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FileText,
  Download,
  Filter,
  Calendar,
  ChevronDown,
  BarChart4,
  FileSpreadsheet,
  FileBarChart,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

const Reports: React.FC = () => {
  const [activeTab, setActiveTab] = useState("financial");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  const recentReports = [
    {
      id: "1",
      name: "Monthly Financial Summary",
      date: "2025-04-10",
      type: "Financial",
      format: "PDF",
      size: "1.2 MB",
    },
    {
      id: "2",
      name: "Site Visits Performance",
      date: "2025-04-05",
      type: "Performance",
      format: "Excel",
      size: "3.8 MB",
    },
    {
      id: "3",
      name: "MMP Implementation Progress",
      date: "2025-04-01",
      type: "Progress",
      format: "PDF",
      size: "2.5 MB",
    },
    {
      id: "4",
      name: "Field Team Activity Log",
      date: "2025-03-28",
      type: "Activity",
      format: "CSV",
      size: "4.1 MB",
    },
    {
      id: "5",
      name: "Quarterly Budget Analysis",
      date: "2025-03-15",
      type: "Financial",
      format: "Excel",
      size: "5.7 MB",
    },
  ];

  const reportTemplates = [
    {
      id: "t1",
      name: "Financial Summary",
      description: "Overview of financial transactions and budget status",
      category: "Financial",
    },
    {
      id: "t2",
      name: "Site Visit Status",
      description: "Summary of all site visits and their completion status",
      category: "Operations",
    },
    {
      id: "t3",
      name: "Team Performance",
      description: "Analysis of field team performance metrics",
      category: "Management",
    },
    {
      id: "t4",
      name: "MMP Implementation",
      description: "Progress report on MMP implementation stages",
      category: "Operations",
    },
  ];

  const handleDownloadReport = (report) => {
    const fileName = `${report.name.toLowerCase().replace(/\s+/g, '_')}_${format(new Date(report.date), 'yyyy-MM-dd')}.${report.format.toLowerCase()}`;
    
    toast({
      title: "Report Downloaded",
      description: `${report.name} has been downloaded as ${fileName}`
    });
  };

  const handleGenerateReport = (reportType) => {
    const timestamp = format(new Date(), 'yyyy-MM-dd');
    const fileName = `${reportType.toLowerCase().replace(/\s+/g, '_')}_${timestamp}.xlsx`;
    
    toast({
      title: "Report Generated",
      description: `${reportType} report has been generated as ${fileName}`
    });
  };

  const handleUseTemplate = (template) => {
    toast({
      title: "Template Selected",
      description: `${template.name} template is ready to use`
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <Button
          variant="outline"
          size="sm"
          className="mr-4"
          onClick={handleBackToDashboard}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg shadow-sm border animate-fade-in">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Reports
        </h1>
        <p className="text-muted-foreground mt-2">
          Generate, view, and manage reports across all system operations
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 gap-2 p-1 h-auto">
          <TabsTrigger value="financial" className="py-2 data-[state=active]:bg-blue-50">
            <span className="flex items-center gap-2">
              <BarChart4 className="h-4 w-4" />
              <span>Financial Reports</span>
            </span>
          </TabsTrigger>
          <TabsTrigger value="operational" className="py-2 data-[state=active]:bg-blue-50">
            <span className="flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              <span>Operational Reports</span>
            </span>
          </TabsTrigger>
          <TabsTrigger value="templates" className="py-2 data-[state=active]:bg-blue-50">
            <span className="flex items-center gap-2">
              <FileBarChart className="h-4 w-4" />
              <span>Report Templates</span>
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="financial" className="mt-4">
          <Card>
            <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Financial Reports</CardTitle>
                <CardDescription>View and download financial reports and analyses</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button className="flex items-center gap-2" onClick={() => handleGenerateReport("Financial Summary")}>
                  <FileText className="h-4 w-4" />
                  Generate Report
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Report Name</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Format</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentReports
                      .filter((report) => report.type === "Financial")
                      .map((report) => (
                        <TableRow key={report.id}>
                          <TableCell className="font-medium">{report.name}</TableCell>
                          <TableCell>{new Date(report.date).toLocaleDateString()}</TableCell>
                          <TableCell>{report.format}</TableCell>
                          <TableCell>{report.size}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => handleDownloadReport(report)}>
                              <Download className="h-4 w-4 mr-1" /> Download
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                  <TableCaption>A list of your recent financial reports.</TableCaption>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operational" className="mt-4">
          <Card>
            <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Operational Reports</CardTitle>
                <CardDescription>View and manage operational metrics and performance</CardDescription>
              </div>
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="flex items-center gap-2">
                      Generate Report
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleGenerateReport("Site Visit Report")}>Site Visit Report</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleGenerateReport("Team Performance Report")}>Team Performance Report</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleGenerateReport("MMP Implementation Report")}>MMP Implementation Report</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="outline" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Date Range
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Report Name</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Format</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentReports
                      .filter((report) => report.type !== "Financial")
                      .map((report) => (
                        <TableRow key={report.id}>
                          <TableCell className="font-medium">{report.name}</TableCell>
                          <TableCell>{new Date(report.date).toLocaleDateString()}</TableCell>
                          <TableCell>{report.format}</TableCell>
                          <TableCell>{report.size}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => handleDownloadReport(report)}>
                              <Download className="h-4 w-4 mr-1" /> Download
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                  <TableCaption>A list of your recent operational reports.</TableCaption>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Report Templates</CardTitle>
              <CardDescription>
                Standard report templates for generating consistent reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reportTemplates.map((template) => (
                  <Card key={template.id} className="overflow-hidden hover:border-primary transition-colors">
                    <CardHeader className="bg-slate-50 pb-2">
                      <CardTitle className="text-base">{template.name}</CardTitle>
                      <CardDescription className="text-xs">
                        {template.category}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <p className="text-sm text-muted-foreground mb-4">{template.description}</p>
                      <div className="flex justify-end">
                        <Button variant="outline" size="sm" onClick={() => handleUseTemplate(template)}>
                          Use Template
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
