'use client';

import { useQuery, HydrationBoundary } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';
import type { Note } from '@/types/note';
import type { DehydratedState } from '@tanstack/react-query';
import styles from '../NoteDetails.module.css';

interface Props {
  noteId: string;
  dehydratedState?: DehydratedState | null;
}

export default function NoteDetailsClient({ noteId, dehydratedState }: Props) {
  const {
    data: note,
    isLoading,
    error,
  } = useQuery<Note>({
    queryKey: ['note', noteId],
    queryFn: () => fetchNoteById(noteId),
    refetchOnMount: false,
  });

  if (isLoading) return <p>Loading, please wait...</p>;
  if (error || !note) return <p>Something went wrong.</p>;

  return (
    <HydrationBoundary state={dehydratedState}>
      <div className={styles.container}>
        <div className={styles.item}>
          <div className={styles.header}>
            <h2>{note.title}</h2>
          </div>
          <p className={styles.content}>{note.content}</p>
          <p className={styles.date}>
            Created: {new Date(note.createdAt).toLocaleString()}
          </p>
        </div>
      </div>
    </HydrationBoundary>
  );
}
