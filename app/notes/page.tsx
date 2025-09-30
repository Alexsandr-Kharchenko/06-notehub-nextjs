'use client';

import { useState } from 'react';
import SearchBox from '@/app/components/SearchBox/SearchBox';
import Pagination from '@/app/components/Pagination/Pagination';
import NoteList from '@/app/components/NoteList/NoteList';
import Modal from '@/app/components/Modal/Modal';
import NoteForm from '@/app/components/NoteForm/NoteForm';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchNotes, deleteNote } from '@/app/lib/api';
import type { Note } from '@/app/types/note';
import noteDetailsStyles from './NoteDetails.module.css';
import notesPageStyles from './NotesPage.module.css';

export default function NotesPage() {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();

  // 📄 Отримання нотаток
  const {
    data: notes,
    isLoading,
    error,
  } = useQuery<Note[]>({
    queryKey: ['notes'],
    queryFn: fetchNotes,
  });

  // Мутація для видалення нотатки
  const mutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notes'] }),
  });

  // 🔹 Функція видалення
  const removeNote = mutation.mutate;

  // 🔹 Перевірка стану мутації
  const isDeleting = mutation.isPending;

  if (isLoading) return <p>Loading…</p>;
  if (error) return <p>Помилка завантаження</p>;
  if (!notes || notes.length === 0) return <p>Нотаток немає</p>;

  // 🔎 Фільтрація по пошуку
  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(search.toLowerCase())
  );

  // 📄 Пагінація (по 5 нотаток на сторінку)
  const perPage = 5;
  const pageCount = Math.ceil(filteredNotes.length / perPage);
  const start = (currentPage - 1) * perPage;
  const paginatedNotes = filteredNotes.slice(start, start + perPage);

  return (
    <div className={noteDetailsStyles.container}>
      <h1 className={noteDetailsStyles.title}>Your Notes</h1>

      {/* 🔎 Пошук */}
      <SearchBox value={search} onChange={setSearch} />

      {/* 📝 Кнопка для створення нотатки */}
      <button
        onClick={() => setIsModalOpen(true)}
        className={notesPageStyles.button}
      >
        + Add Note
      </button>

      {/* 📋 Список нотаток з підтримкою видалення */}
      <NoteList
        notes={paginatedNotes}
        removeNote={removeNote}
        isPending={isDeleting}
      />

      {/* 📄 Пагінація */}
      <Pagination
        pageCount={pageCount}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      {/* 🪟 Модальне вікно з формою */}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onCancel={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
