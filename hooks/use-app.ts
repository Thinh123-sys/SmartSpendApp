import { useContext } from 'react';

import { AppContext } from '@/contexts/app-context';

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp phải được sử dụng bên trong AppProvider');
  }
  return context;
}
