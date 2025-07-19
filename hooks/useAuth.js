'use client';

import { useContext } from 'react';
import { UserAuthContext } from '@/contexts/UserAuthContext';

export const useAuth = () => {
  const context = useContext(UserAuthContext);
  if (!context) {
    throw new Error('useAuth must be used within UserAuthProvider');
  }
  return context;
};