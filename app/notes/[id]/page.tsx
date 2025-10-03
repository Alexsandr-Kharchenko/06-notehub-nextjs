import {
  dehydrate,
  QueryClient,
  type DehydratedState,
} from '@tanstack/react-query';
import NoteDetailsClient from './NoteDetails.client';
import { fetchNoteById } from '@/lib/api';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function NoteDetailsPage({ params }: Props) {
  const { id } = await params;

  if (!id) {
    throw new Error('Note id is required');
  }

  const queryClient = new QueryClient();

  // Попереднє завантаження даних для цієї нотатки (сервер)
  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });

  const dehydratedState: DehydratedState = dehydrate(queryClient);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Note Details</h1>
      <NoteDetailsClient noteId={id} dehydratedState={dehydratedState} />
    </div>
  );
}
