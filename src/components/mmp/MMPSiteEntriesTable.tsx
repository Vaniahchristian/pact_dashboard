
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, CheckCircle, XCircle } from 'lucide-react';

interface MMPSiteEntriesTableProps {
  siteEntries: any[];
  onViewSiteDetail: (site: any) => void;
}

const MMPSiteEntriesTable = ({ siteEntries, onViewSiteDetail }: MMPSiteEntriesTableProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSites = searchQuery.trim() === "" 
    ? siteEntries 
    : siteEntries.filter(site => 
        site.siteName.toLowerCase().includes(searchQuery.toLowerCase()) || 
        site.siteCode.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>MMP Site Entries</CardTitle>
            <CardDescription>
              Total: {siteEntries.length} sites | 
              Visited: {siteEntries.filter(site => site.siteVisited).length} | 
              Pending: {siteEntries.filter(site => !site.siteVisited).length}
            </CardDescription>
          </div>
          <div className="w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search sites..."
                className="pl-8 w-full sm:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Site Code</TableHead>
                <TableHead>Site Name</TableHead>
                <TableHead>In MoDa</TableHead>
                <TableHead>Visited By</TableHead>
                <TableHead>Main Activity</TableHead>
                <TableHead>Visit Date</TableHead>
                <TableHead>Site Visited</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSites.length > 0 ? (
                filteredSites.map((site) => (
                  <TableRow key={site.id} className="hover:bg-muted/30">
                    <TableCell className="font-mono text-xs">{site.siteCode}</TableCell>
                    <TableCell>{site.siteName}</TableCell>
                    <TableCell>
                      {site.inMoDa ? 
                        <CheckCircle className="h-5 w-5 text-green-500" /> : 
                        <XCircle className="h-5 w-5 text-red-500" />}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{site.visitedBy}</Badge>
                    </TableCell>
                    <TableCell>{site.mainActivity}</TableCell>
                    <TableCell>{site.visitDate}</TableCell>
                    <TableCell>
                      {site.siteVisited ? 
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 hover:bg-green-200">Visited</Badge> : 
                        <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 hover:bg-amber-200">Pending</Badge>}
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => onViewSiteDetail(site)}
                        className="hover:bg-muted">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default MMPSiteEntriesTable;
