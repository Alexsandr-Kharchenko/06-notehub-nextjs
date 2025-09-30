'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import SearchBox from '@/app/components/SearchBox/SearchBox';
import Pagination from '@/app/components/Pagination/Pagination';
import NoteList from '@/app/components/NoteList/NoteList';
import Modal from '@/app/components/Modal/Modal';
import NoteForm from '@/app/components/NoteForm/NoteForm';
import { fetchNotes, deleteNote } from '@/app/lib/api';
import type { Note } from '@/app/types/note';
import noteDetailsStyles from './NoteDetails.module.css';
import notesPageStyles from './NotesPage.module.css';

export default function NotesPage() {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const {
    data: notes,
    isLoading,
    error,
  } = useQuery<Note[]>({
    queryKey: ['notes'],
    queryFn: fetchNotes,
  });

  const mutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notes'] }),
  });

  const removeNote = mutation.mutate;
  const isDeleting = mutation.isPending;

  if (isLoading) return <p>Loading…</p>;
  if (error) return <p>Error loading notes</p>;

  const filteredNotes =
    notes?.filter(note =>
      note.title.toLowerCase().includes(search.toLowerCase())
    ) || [];

  const perPage = 5;
  const pageCount = Math.ceil(filteredNotes.length / perPage);
  const start = (currentPage - 1) * perPage;
  const paginatedNotes = filteredNotes.slice(start, start + perPage);

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
        removeNote={removeNote}
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
