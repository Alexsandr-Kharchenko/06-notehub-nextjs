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
  // Доданий стан для відстеження ID нотатки, що видаляється
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(searchInput);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchInput]);

  // Створення чистого об'єкта параметрів для queryKey та queryFn
  const queryParams = {
    page: currentPage,
    perPage: 12,
    ...(searchQuery && { search: searchQuery }), // Додаємо search лише якщо він не порожній
  };

  // Запит нотаток з серверу
  const { data, isLoading, isError } = useQuery<FetchNotesResponse, Error>({
    // queryKey тепер містить об'єкт параметрів
    queryKey: ['notes', queryParams],
    // queryFn використовує чисту функцію, передаючи їй об'єкт параметрів
    queryFn: () => fetchNotes(queryParams),
    refetchOnWindowFocus: false,
  });

  const totalPages = data?.totalPages ?? 0;
  const notes = data?.notes ?? [];

  const deleteMutation = useMutation<void, Error, string>({
    mutationFn: async (id: string) => {
      await deleteNote(id);
    },
    onMutate: async (id: string) => {
      // 1. Встановлюємо ID нотатки, що видаляється
      setDeletingId(id);
    },
    onSuccess: () => {
      toast.success('Note deleted');
      // 2. Очищуємо ID
      setDeletingId(null);

      // 3. Оптимізована валідація кешу:
      // Валідуємо лише базовий ключ 'notes'.
      queryClient.invalidateQueries({
        queryKey: ['notes'],
      });

      // 4. Логіка для переходу на попередню сторінку, якщо поточна стала порожньою
      if (notes.length === 1 && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
      }
    },
    onError: () => {
      toast.error('Failed to delete note');
      setDeletingId(null); // Очищуємо ID навіть при помилці
    },
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

      {/* Оновлені умови відображення */}
      {isLoading && <p>Loading, please wait...</p>}
      {isError && <p>Something went wrong.</p>}
      {/* Показуємо "No notes found" лише коли завантаження завершено і помилок немає */}
      {!isLoading && !isError && notes.length === 0 && <p>No notes found</p>}

      {/* NoteList рендериться лише якщо є нотатки */}
      {notes.length > 0 && (
        <NoteList
          notes={notes}
          removeNote={deleteMutation.mutate}
          // Передаємо ID нотатки, що видаляється, замість isPending
          isDeletingId={deletingId}
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
