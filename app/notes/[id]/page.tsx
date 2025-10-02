import { dehydrate, QueryClient } from '@tanstack/react-query';
import NoteDetailsClient from './NoteDetails.client';
import { fetchNoteById } from '@/lib/api';

interface Props {
  params: { id: string };
}

export default async function NoteDetailsPage({ params }: Props) {
  const queryClient = new QueryClient();

  // Попереднє завантаження даних нотатки на сервері
  await queryClient.prefetchQuery({
    queryKey: ['note', params.id],
    queryFn: () => fetchNoteById(params.id),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Note Details</h1>
      <NoteDetailsClient noteId={params.id} dehydratedState={dehydratedState} />
    </div>
  );
}
