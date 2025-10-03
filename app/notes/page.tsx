'use client';

import { Suspense } from 'react';
import {
  QueryClient,
  QueryClientProvider,
  hydrate,
  DehydratedState,
} from '@tanstack/react-query';
import NotesClient from './Notes.client';

interface NotesPageProps {
  dehydratedState: DehydratedState;
}

export default function NotesPageClient({ dehydratedState }: NotesPageProps) {
  const queryClient = new QueryClient();

  hydrate(queryClient, dehydratedState);

  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<p>Loading notes…</p>}>
        <NotesClient />
      </Suspense>
    </QueryClientProvider>
  );
}
