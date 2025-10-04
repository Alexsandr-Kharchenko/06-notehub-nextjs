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
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(searchInput);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchInput]);

  const queryParams = {
    page: currentPage,
    perPage: 12,
    ...(searchQuery && { search: searchQuery }),
  };

  const { data, isLoading, isError, isFetching } = useQuery<
    FetchNotesResponse,
    Error
  >({
    queryKey: ['notes', queryParams],
    queryFn: () => fetchNotes(queryParams),
    refetchOnWindowFocus: false,
    placeholderData: previousData => previousData,
  });

  const totalPages = data?.totalPages ?? 0;
  const notes = data?.notes ?? [];

  // Хук для видалення нотатки
  const deleteMutation = useMutation<void, Error, string>({
    // !!! ВИПРАВЛЕННЯ 1: Обгортаємо мутацію, щоб явно повернути Promise<void> !!!
    mutationFn: async (id: string) => {
      // Чекаємо завершення виклику API
      await deleteNote(id);
      // Явно не повертаємо значення, щоб відповідати типу <void, ...>
    },

    onMutate: async (id: string) => {
      setDeletingId(id);
    },

    // !!! ВИПРАВЛЕННЯ 2: Ігноруємо невикористані параметри в onSuccess, використовуючи лише логіку замикання !!!
    onSuccess: () => {
      toast.success('Note deleted');

      if (notes.length === 1 && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
      }

      queryClient.invalidateQueries({
        queryKey: ['notes'],
      });
    },

    onError: error => {
      toast.error(`Failed to delete note: ${error.message}`);
    },
    onSettled: () => {
      setDeletingId(null);
    },
  });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleRemoveNote = (id: string) => {
    deleteMutation.mutate(id);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchInput} onChange={setSearchInput} />

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

      {isLoading && <p>Loading, please wait...</p>}
      {isFetching && !isLoading && (
        <p className={css.fetchingIndicator}>Updating list...</p>
      )}
      {isError && <p>Something went wrong: Failed to load notes.</p>}

      {!isLoading && !isError && notes.length > 0 ? (
        <NoteList
          notes={notes}
          removeNote={handleRemoveNote}
          isDeletingId={deletingId}
        />
      ) : (
        !isLoading && !isError && notes.length === 0 && <p>No notes found</p>
      )}

      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm onCancel={closeModal} />
        </Modal>
      )}

      <Toaster />
    </div>
  );
}
