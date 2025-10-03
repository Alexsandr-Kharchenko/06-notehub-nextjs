'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import SearchBox from '@/components/SearchBox/SearchBox';
import Pagination from '@/components/Pagination/Pagination';
import NoteList from '@/components/NoteList/NoteList';
import Modal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm';
import { fetchNotes, deleteNote, type FetchNotesResponse } from '@/lib/api';
import { Toaster, toast } from 'react-hot-toast';
import css from './NotesPage.module.css';

export default function NotesClient() {
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(searchInput);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchInput]);

  // Запит нотаток з серверу з урахуванням пошуку і сторінки
  const { data, isLoading, isError } = useQuery<FetchNotesResponse, Error>({
    queryKey: ['notes', searchQuery, currentPage],
    queryFn: () =>
      fetchNotes({ search: searchQuery, page: currentPage, perPage: 12 }),
    refetchOnWindowFocus: false,
  });

  const totalPages = data?.totalPages ?? 0;
  const notes = data?.notes ?? [];

  const deleteMutation = useMutation<void, Error, string>({
    mutationFn: async (id: string) => {
      await deleteNote(id);
    },
    onSuccess: () => {
      toast.success('Note deleted');
      queryClient.invalidateQueries({
        queryKey: ['notes', searchQuery, currentPage],
      });
    },
    onError: () => toast.error('Failed to delete note'),
  });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchInput} onChange={setSearchInput} />

        {/* Показуємо пагінацію лише якщо сторінок більше однієї */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            pageCount={totalPages}
            onPageChange={setCurrentPage}
          />
        )}

        <button className={css.button} onClick={openModal}>
          Create note +
        </button>
      </header>

      {}
      {isLoading && <p>Loading, please wait...</p>}
      {isError && <p>Something went wrong.</p>}
      {!isLoading && !isError && notes.length === 0 && <p>No notes found</p>}

      {/* NoteList рендериться лише якщо є нотатки */}
      {notes.length > 0 && (
        <NoteList
          notes={notes}
          removeNote={deleteMutation.mutate}
          isPending={deleteMutation.isPending}
        />
      )}

      {/* Модальне вікно створення нотатки */}
      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm onCancel={closeModal} />
        </Modal>
      )}

      <Toaster />
    </div>
  );
}
