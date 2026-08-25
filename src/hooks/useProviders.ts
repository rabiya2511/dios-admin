import { useContext } from 'react';
import { ProvidersContext } from '@/context/ProvidersContext';

export function useProviders() {
  const context = useContext(ProvidersContext);
  if (!context) throw new Error('useProviders must be used within a ProvidersProvider');
  return context;
}