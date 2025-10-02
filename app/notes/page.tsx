import { Suspense } from 'react';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import NotesClient from './Notes.client';
import type { FetchNotesResponse } from '@/lib/api';

// Серверний компонент сторінки
export default async function NotesPage() {
  const queryClient = new QueryClient();

  // Попереднє завантаження нотаток на сервері
  await queryClient.prefetchQuery<FetchNotesResponse>({
    queryKey: ['notes'],
    queryFn: fetchNotes,
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <Suspense fallback={<p>Loading notes…</p>}>
      <NotesClient dehydratedState={dehydratedState} />
    </Suspense>
  );
}
