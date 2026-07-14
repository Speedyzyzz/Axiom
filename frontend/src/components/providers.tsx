'use client';

import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactLenis } from 'lenis/react';

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactLenis root options={{ lerp: 0.05, syncTouch: true }}>
        {children}
      </ReactLenis>
    </QueryClientProvider>
  );
}
