
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import MMP from '@/pages/MMP';
import MMPUpload from '@/pages/MMPUpload';
import MMPVerification from '@/pages/MMPVerification';
import MMPDetailedVerification from '@/pages/MMPDetailedVerification';
import MMPDetail from '@/pages/MMPDetail';
import MMPDetailView from '@/pages/MMPDetailView';
import EditMMP from '@/pages/EditMMP';

const MMPRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<MMP />} />
      <Route path="/upload" element={<MMPUpload />} />
      <Route path="/:id/verify" element={<MMPVerification />} />
      <Route path="/:id/detailed-verification" element={<MMPDetailedVerification />} />
      <Route path="/:id" element={<MMPDetail />} />
      <Route path="/:id/view" element={<MMPDetailView />} />
      <Route path="/:id/edit" element={<EditMMP />} />
    </Routes>
  );
};

export default MMPRoutes;
