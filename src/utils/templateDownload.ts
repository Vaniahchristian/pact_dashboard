
export const downloadMMPTemplate = () => {
  // Create template headers data
  const headers = [
    'Hub Office',
    'State',
    'Locality',
    'Site Name',
    'CP Name',
    'Main Activity',
    'Activity at Site',
    'Visit Type',
    'Visit Date',
    'Comments'
  ];
  
  // Add sample rows for reference
  const sampleRows = [
    [
      'Khartoum',
      'Khartoum',
      'Bahri',
      'Example Health Center',
      'Partner Organization',
      'DM',
      'TSFP',
      'TPM',
      '2023-04-15',
      'Regular monitoring visit'
    ],
    [
      'Port Sudan',
      'Red Sea',
      'Suakin',
      'Example School',
      'Education Partner',
      'Education',
      'School Visit',
      'Regular',
      '2023-04-20',
      'Quarterly assessment'
    ]
  ];
  
  // Create CSV content with headers and sample rows
  let csvContent = headers.join(',') + '\n';
  sampleRows.forEach(row => {
    csvContent += row.join(',') + '\n';
  });
  
  // Create blob and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = 'mmp_template.csv';
  document.body.appendChild(link);
  link.click();
  
  // Clean up
  setTimeout(() => {
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }, 100);
  
  return true;
};
