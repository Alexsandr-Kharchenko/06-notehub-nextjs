'use client';

import { useState, useMemo } from 'react';
import {
  useQuery,
  useMutation,
  useQueryClient,
  HydrationBoundary,
} from '@tanstack/react-query';
import SearchBox from '@/components/SearchBox/SearchBox';
import Pagination from '@/components/Pagination/Pagination';
import NoteList from '@/components/NoteList/NoteList';
import Modal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm';
import { fetchNotes, deleteNote } from '@/lib/api';
import type { DehydratedState } from '@tanstack/react-query';
import noteDetailsStyles from './NoteDetails.module.css';
import notesPageStyles from './NotesPage.module.css';

interface NotesClientProps {
  dehydratedState?: DehydratedState | null;
}

export default function NotesClient({ dehydratedState }: NotesClientProps) {
  return (
    <HydrationBoundary state={dehydratedState}>
      <Notes />
    </HydrationBoundary>
  );
}

function Notes() {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();

  // Отримання списку нотаток
  const { data, isLoading, error } = useQuery({
    queryKey: ['notes'],
    queryFn: fetchNotes,
    refetchOnMount: false,
  });

  // Мутація для видалення нотатки
  const mutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notes'] }),
  });

  const isDeleting = mutation.isPending;

  // Пошук
  const filteredNotes = useMemo(() => {
    if (!data?.notes) return [];
    return data.notes.filter(note =>
      note.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [data?.notes, search]);

  const perPage = 5;
  const pageCount = Math.ceil(filteredNotes.length / perPage);
  const start = (currentPage - 1) * perPage;
  const paginatedNotes = filteredNotes.slice(start, start + perPage);

  if (isLoading) return <p>Loading notes…</p>;
  if (error) return <p>Error loading notes</p>;

  return (
    <div className={noteDetailsStyles.container}>
      <h1 className={noteDetailsStyles.title}>Your Notes</h1>

      <SearchBox value={search} onChange={setSearch} />

      <button
        onClick={() => setIsModalOpen(true)}
        className={notesPageStyles.button}
      >
        + Add Note
      </button>

      <NoteList
        notes={paginatedNotes}
        removeNote={mutation.mutate}
        isPending={isDeleting}
      />

      <Pagination
        pageCount={pageCount}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onCancel={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
