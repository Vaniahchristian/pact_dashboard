import React from 'react';
import { useSessionTimeout } from '@/hooks/useSessionTimeout';
import { useAppContext } from '@/context/AppContext';

interface SessionManagerProps {
  children: React.ReactNode;
}

const SessionManager: React.FC<SessionManagerProps> = ({ children }) => {
  const { currentUser, logout } = useAppContext();

  // Only auto-logout logic, no UI or warning
  useSessionTimeout({
    sessionDuration: 90,
    checkInterval: 1000,
    logout,
  });

  // Just render children, no session indicator or warning dialog
  return <>{children}</>;
};

export default SessionManager;
