import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  ArchiveMonth, 
  ArchiveFilter, 
  ArchiveStatistics, 
  ArchiveDocument,
  ArchivedMMPFile,
  ArchivedSiteVisit,
  ArchiveContextType
} from '@/types';
import { User } from '@/types/user';
import { useToast } from '@/hooks/use-toast';

// Create the context
const ArchiveContext = createContext<ArchiveContextType | undefined>(undefined);

interface ArchiveProviderProps {
  children: React.ReactNode;
  currentUser?: User;
}

export const ArchiveProvider: React.FC<ArchiveProviderProps> = ({ children, currentUser }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ArchiveFilter>({});
  const [currentArchive, setCurrentArchive] = useState<ArchiveMonth>();
  
  // Sample data for demonstration
  const [archives, setArchives] = useState<ArchiveMonth[]>([
    {
      year: 2025,
      month: 3,
      label: 'March 2025',
      mmpsCount: 24,
      siteVisitsCount: 18,
      documentsCount: 42
    },
    {
      year: 2025,
      month: 2,
      label: 'February 2025',
      mmpsCount: 31,
      siteVisitsCount: 27,
      documentsCount: 58
    },
    {
      year: 2025,
      month: 1,
      label: 'January 2025',
      mmpsCount: 19,
      siteVisitsCount: 15,
      documentsCount: 33
    },
    {
      year: 2024,
      month: 12,
      label: 'December 2024',
      mmpsCount: 28,
      siteVisitsCount: 22,
      documentsCount: 47
    }
  ]);

  const [archivedMMPs, setArchivedMMPs] = useState<ArchivedMMPFile[]>([
    {
      id: 'mmp-001',
      mmpId: 'MMP-2025-001',
      status: 'approved',
      description: 'Implementation of water supply infrastructure in northern communities',
      uploadedBy: 'john.doe',
      uploadedAt: '2025-02-15T10:30:00Z',
      region: 'North',
      state: 'Khartoum',
      locality: 'Bahri',
      sites: [
        {
          id: 'site-001',
          name: 'Water Treatment Plant A',
          location: {
            latitude: 15.6245,
            longitude: 32.5342,
            address: 'North Industrial Area, Bahri'
          }
        }
      ],
      archiveId: 'arc-001',
      archiveDate: '2025-03-15T10:30:00Z',
      archiveCategory: 'completed-projects',
      retentionPeriod: '5 years',
      documents: [
        {
          id: 'doc-001',
          fileName: 'site-survey.pdf',
          fileUrl: '/files/site-survey.pdf',
          fileType: 'application/pdf',
          fileSize: 2456789,
          uploadedBy: 'john.doe',
          uploadedAt: '2025-02-10T10:30:00Z',
          category: 'mmp',
          relatedEntityId: 'mmp-001',
          relatedEntityType: 'mmp',
          description: 'Initial site survey document'
        }
      ],
      approvers: [],
      createdAt: '',
      updatedAt: '',
      currentStage: 0,
      stages: [],
      name: 'North Region Water Supply Project',
      entries: 5,
      year: 2025,
      month: 2
    }
  ]);

  const [archivedSiteVisits, setArchivedSiteVisits] = useState<ArchivedSiteVisit[]>([
    {
      id: 'sv-001',
      siteName: 'Water Treatment Plant A Site Visit',
      siteCode: 'WTP-A-001',
      status: 'completed',
      locality: 'Bahri',
      state: 'Khartoum',
      activity: 'Site Assessment',
      priority: 'high',
      dueDate: '2025-02-20T10:30:00Z',
      assignedTo: 'field-agent-1',
      notes: 'Complete assessment of water treatment facility location',
      attachments: ['photo1.jpg', 'photo2.jpg'],
      fees: {
        total: 500,
        currency: 'USD',
        distanceFee: 100,
        complexityFee: 150,
        urgencyFee: 250
      },
      scheduledDate: '2025-02-18T09:00:00Z',
      description: 'Initial site assessment for water treatment plant',
      tasks: [
        'Soil Testing'
      ],
      permitDetails: {
        federal: true,
        state: true,
        locality: true
      },
      location: {
        address: 'North Industrial Area, Bahri',
        latitude: 15.6245,
        longitude: 32.5342,
        region: 'Khartoum'
      },
      coordinates: {
        latitude: 15.6245,
        longitude: 32.5342
      },
      mmpDetails: {
        mmpId: 'MMP-2025-001',
        projectName: 'North Region Water Supply Project',
        uploadedBy: 'john.doe',
        uploadedAt: '2025-02-15T10:30:00Z',
        region: 'Khartoum'
      },
      complexity: 'medium',
      visitType: 'regular',
      mainActivity: 'site-assessment',
      projectActivities: ['land-survey', 'environmental-assessment'],
      hub: 'khartoum-north',
      team: {
        coordinator: 'coord-1',
        supervisor: 'super-1',
        fieldOfficer: 'fo-1'
      },
      resources: ['surveying-equipment', 'water-testing-kit'],
      risks: 'Moderate access difficulties due to road conditions',
      estimatedDuration: '4 hours',
      visitHistory: [
        {
          date: '2025-02-18T09:00:00Z',
          status: 'completed',
          by: 'field-agent-1'
        }
      ],
      monitoringType: 'regular',
      createdAt: '2025-02-15T11:30:00Z',
      archiveId: 'arc-sv-001',
      archiveDate: '2025-03-15T10:30:00Z',
      archiveCategory: 'completed-visits',
      documents: [
        {
          id: 'doc-sv-001',
          fileName: 'site-visit-report.pdf',
          fileUrl: '/files/site-visit-report.pdf',
          fileType: 'application/pdf',
          fileSize: 1456789,
          uploadedBy: 'field-agent-1',
          uploadedAt: '2025-02-18T15:30:00Z',
          category: 'siteVisit',
          relatedEntityId: 'sv-001',
          relatedEntityType: 'siteVisit',
          description: 'Final site visit report'
        }
      ],
      assignedBy: '',
      assignedAt: '',
      projectName: 'North Region Water Supply Project'
    }
  ]);

  const [documents, setDocuments] = useState<ArchiveDocument[]>([
    {
      id: 'doc-001',
      fileName: 'site-survey.pdf',
      fileUrl: '/files/site-survey.pdf',
      fileType: 'application/pdf',
      fileSize: 2456789,
      uploadedBy: 'john.doe',
      uploadedAt: '2025-02-10T10:30:00Z',
      category: 'mmp',
      relatedEntityId: 'mmp-001',
      relatedEntityType: 'mmp',
      description: 'Initial site survey document'
    },
    {
      id: 'doc-sv-001',
      fileName: 'site-visit-report.pdf',
      fileUrl: '/files/site-visit-report.pdf',
      fileType: 'application/pdf',
      fileSize: 1456789,
      uploadedBy: 'field-agent-1',
      uploadedAt: '2025-02-18T15:30:00Z',
      category: 'siteVisit',
      relatedEntityId: 'sv-001',
      relatedEntityType: 'siteVisit',
      description: 'Final site visit report'
    }
  ]);

  const [statistics, setStatistics] = useState<ArchiveStatistics>({
    totalMmps: 82,
    totalSiteVisits: 124,
    totalDocuments: 237,
    documentsByCategory: {
      mmp: 82,
      siteVisit: 124,
      permit: 14,
      verification: 8,
      report: 9
    },
    mmpStatusCounts: {
      approved: 68,
      rejected: 8,
      pending: 6
    },
    monthlyTrends: [
      {
        year: 2025,
        month: 3,
        mmps: 24,
        siteVisits: 18,
        documents: 42
      },
      {
        year: 2025,
        month: 2,
        mmps: 31,
        siteVisits: 27,
        documents: 58
      },
      {
        year: 2025,
        month: 1,
        mmps: 19,
        siteVisits: 15,
        documents: 33
      },
      {
        year: 2024,
        month: 12,
        mmps: 28,
        siteVisits: 22,
        documents: 47
      }
    ]
  });

  // Initial data loading
  useEffect(() => {
    // This would be replaced with actual API calls in a real implementation
    setTimeout(() => {
      setLoading(false);
      setCurrentArchive(archives[0]);
    }, 1000);
  }, []);

  // Select a specific month's archive
  const selectMonth = (year: number, month: number) => {
    const selectedArchive = archives.find(
      (archive) => archive.year === year && archive.month === month
    );
    
    if (selectedArchive) {
      setCurrentArchive(selectedArchive);
      toast({
        title: "Archive Selected",
        description: `Viewing archive for ${selectedArchive.label}`,
      });
      
      // In a real app, this would fetch data specific to this month from the API
      // For now, we'll just simulate a loading state
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 800);
    }
  };

  // Download archive in specified format
  const downloadArchive = async (format: 'excel' | 'csv' | 'pdf', downloadFilters?: ArchiveFilter): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Simulating API call to generate file
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // In a real implementation, this would handle the actual file download
      // based on the selected format and filters
      
      const formatName = format.toUpperCase();
      
      toast({
        title: `Archive Downloaded`,
        description: `The archive has been downloaded in ${formatName} format.`,
        variant: "success",
      });
      
      setLoading(false);
      return true;
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Download Failed",
        description: "There was an error downloading the archive.",
        variant: "destructive",
      });
      setLoading(false);
      return false;
    }
  };

  // Upload a new document to the archive
  const uploadDocument = async (document: Omit<ArchiveDocument, 'id'>): Promise<string> => {
    try {
      setLoading(true);
      
      // Simulating API call to upload document
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Generate a unique ID for the document
      const newDocId = `doc-${Date.now()}`;
      
      // Create the document with the new ID
      const newDocument: ArchiveDocument = {
        ...document,
        id: newDocId,
      };
      
      // Add to the documents list
      setDocuments((prevDocs) => [...prevDocs, newDocument]);
      
      toast({
        title: "Document Uploaded",
        description: `${document.fileName} has been added to the archive.`,
        variant: "success",
      });
      
      setLoading(false);
      return newDocId;
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading the document.",
        variant: "destructive",
      });
      setLoading(false);
      return "";
    }
  };

  // Delete a document from the archive
  const deleteDocument = async (documentId: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Simulating API call to delete document
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      // Remove the document from the list
      setDocuments((prevDocs) => prevDocs.filter((doc) => doc.id !== documentId));
      
      const deletedDoc = documents.find((doc) => doc.id === documentId);
      
      toast({
        title: "Document Deleted",
        description: `${deletedDoc?.fileName || 'Document'} has been removed from the archive.`,
        variant: "success",
      });
      
      setLoading(false);
      return true;
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "Delete Failed",
        description: "There was an error deleting the document.",
        variant: "destructive",
      });
      setLoading(false);
      return false;
    }
  };

  // Search archives based on query
  const searchArchives = async (query: string): Promise<{
    mmps: ArchivedMMPFile[];
    siteVisits: ArchivedSiteVisit[];
    documents: ArchiveDocument[];
  }> => {
    setLoading(true);
    
    // Simulate API call for search
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    // Simple search implementation for demonstration
    const searchLower = query.toLowerCase();
    
    const filteredMMPs = archivedMMPs.filter(
      (mmp) => 
        mmp.mmpId.toLowerCase().includes(searchLower) || 
        mmp.name.toLowerCase().includes(searchLower) || 
        mmp.description.toLowerCase().includes(searchLower)
    );
    
    const filteredSiteVisits = archivedSiteVisits.filter(
      (visit) => 
        visit.siteName.toLowerCase().includes(searchLower) || 
        visit.description?.toLowerCase().includes(searchLower) ||
        visit.state.toLowerCase().includes(searchLower)
    );
    
    const filteredDocuments = documents.filter(
      (doc) => 
        doc.fileName.toLowerCase().includes(searchLower) || 
        doc.description?.toLowerCase().includes(searchLower)
    );
    
    setLoading(false);
    
    return {
      mmps: filteredMMPs,
      siteVisits: filteredSiteVisits, 
      documents: filteredDocuments
    };
  };

  // Context value
  const contextValue: ArchiveContextType = {
    archives,
    currentArchive,
    archivedMMPs,
    archivedSiteVisits,
    documents,
    statistics,
    filters,
    loading,
    setFilters,
    selectMonth,
    downloadArchive,
    uploadDocument,
    deleteDocument,
    searchArchives,
  };

  return (
    <ArchiveContext.Provider value={contextValue}>
      {children}
    </ArchiveContext.Provider>
  );
};

// Hook for using the archive context
export const useArchive = (): ArchiveContextType => {
  const context = useContext(ArchiveContext);
  
  if (context === undefined) {
    throw new Error('useArchive must be used within an ArchiveProvider');
  }
  
  return context;
};
