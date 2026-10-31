import React, { useEffect } from 'react';
import { getRootHandle, isFSApiSupported } from '@services/localStorageService';

interface FolderGuardProps {
  children: React.ReactNode;
}

/**
 * FolderGuard: ensures OPFS / local storage folder initializes non-blockingly
 * in the background without halting the application interface.
 */
const FolderGuard: React.FC<FolderGuardProps> = ({ children }) => {
  useEffect(() => {
    if (isFSApiSupported()) {
      // Initialize OPFS storage root silently in background
      getRootHandle().catch(err => {
        console.warn('Silent local storage init:', err);
      });
    }
  }, []);

  return <>{children}</>;
};

export default FolderGuard;
