import { supabase } from '@/integrations/supabase/client';
import { MMPFile } from '@/types';
import { toast } from 'sonner';

export async function uploadMMPFile(file: File, projectId?: string): Promise<{ success: boolean; mmpData?: MMPFile; error?: string }> {
  try {
    console.log('Starting MMP file upload:', file.name);
    
    // Generate a unique file path for storage
    const timestamp = Date.now();
    const fileExt = file.name.split('.').pop();
    const filePath = `${timestamp}_${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    // Upload file to Supabase Storage
    const { data: storageData, error: storageError } = await supabase
      .storage
      .from('mmp-files')
      .upload(filePath, file);

    if (storageError) {
      console.error('Storage upload error:', storageError);
      toast.error('Failed to upload file to storage');
      return { success: false, error: 'Failed to upload file to storage: ' + storageError.message };
    }

    // Get the public URL for the uploaded file
    const { data: { publicUrl } } = supabase
      .storage
      .from('mmp-files')
      .getPublicUrl(filePath);

    console.log('File uploaded successfully. Public URL:', publicUrl);

    // Create mock site entries for demonstration
    const mockSiteEntries = generateMockSiteEntries(5); // Generate 5 mock site entries

    // Create database entry with more complete information
    const newMMP: Partial<MMPFile> = {
      name: file.name.replace(/\.[^/.]+$/, ""),
      uploadedAt: new Date().toISOString(),
      status: 'pending',
      entries: mockSiteEntries.length,
      processedEntries: 0,
      mmpId: `MMP-${timestamp.toString().substring(5)}`,
      version: {
        major: 1,
        minor: 0,
        updatedAt: new Date().toISOString()
      },
      siteEntries: mockSiteEntries,
      workflow: {
        currentStage: 'notStarted',
        lastUpdated: new Date().toISOString()
      },
      ...(projectId && { projectId })
    };

    // Add file-specific properties
    const dbData = {
      ...newMMP,
      file_path: filePath,
      original_filename: file.name,
      file_url: publicUrl
    };

    console.log('Inserting MMP record into database:', dbData);

    // Insert the record into Supabase
    const { data: insertedData, error: insertError } = await supabase
      .from('mmp_files')
      .insert(dbData);
      
    if (insertError) {
      // If database insert fails, attempt to clean up the uploaded file
      try {
        await supabase.storage.from('mmp-files').remove([filePath]);
        console.log('Cleaned up storage after failed insert');
      } catch (cleanupError) {
        console.error('Error cleaning up storage after failed insert:', cleanupError);
      }
      
      console.error('Database insert error:', insertError);
      toast.error('Failed to save MMP data');
      return { success: false, error: 'Failed to save MMP data: ' + insertError.message };
    }
    
    console.log('MMP file record created successfully:', insertedData || dbData);
    toast.success('MMP file uploaded successfully');
    
    // If using mock client, return the data we just inserted since the mock doesn't return it
    const mmpData = insertedData || dbData as MMPFile;
    
    return { 
      success: true, 
      mmpData: mmpData
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('MMP upload error:', error);
    toast.error('An unexpected error occurred during upload');
    return { success: false, error: 'An unexpected error occurred during upload: ' + errorMessage };
  }
}

// Helper function to generate mock site entries
function generateMockSiteEntries(count: number) {
  const entries = [];
  
  for (let i = 0; i < count; i++) {
    entries.push({
      id: `site-${Date.now()}-${i}`,
      siteCode: `SC-${Math.floor(1000 + Math.random() * 9000)}`,
      siteName: `Site ${i + 1}`,
      inMoDa: Math.random() > 0.3, // 70% chance to be true
      visitedBy: 'John Doe',
      mainActivity: ['Assessment', 'Installation', 'Maintenance', 'Inspection'][Math.floor(Math.random() * 4)],
      visitDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: ['Pending', 'Completed', 'In Progress'][Math.floor(Math.random() * 3)],
      locality: 'Central District',
      state: 'Northern State',
      permitDetails: {
        federal: Math.random() > 0.3,
        state: Math.random() > 0.3,
        local: Math.random() > 0.3
      }
    });
  }
  
  return entries;
}

/**
 * Check if the 'mmp-files' bucket exists, and create it if it doesn't
 * Note: This implementation is adjusted to work with the mock Supabase client
 * In a real Supabase implementation, we would use listBuckets and createBucket
 */
export async function ensureMMPStorageBucket(): Promise<boolean> {
  try {
    // For our mock implementation, we'll assume the bucket exists
    // since our mock client doesn't have these methods
    
    console.log('Checking if mmp-files bucket exists...');
    
    // Attempt to upload a test file to check if the bucket exists
    // This is a workaround since our mock client doesn't have listBuckets
    const testFile = new Blob(['test'], { type: 'text/plain' });
    
    const { data, error } = await supabase.storage
      .from('mmp-files')
      .upload('test-bucket-exists.txt', testFile);
      
    if (error && error.message && error.message.includes('bucket')) {
      // If error mentions bucket not existing, we'd create it
      // Since our mock doesn't have createBucket, we'll just log what we would do
      console.log('mmp-files bucket does not exist, but cannot create it with mock client');
      return false;
    } else {
      // Clean up test file if upload succeeded
      if (data) {
        await supabase.storage.from('mmp-files').remove(['test-bucket-exists.txt']);
      }
      console.log('mmp-files bucket exists or was verified');
      return true;
    }
    
  } catch (error) {
    console.error('Error ensuring MMP storage bucket:', error);
    return false;
  }
}
