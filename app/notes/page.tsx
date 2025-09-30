'use client';

import { useState } from 'react';
import SearchBox from '@/app/components/SearchBox/SearchBox';
import Pagination from '@/app/components/Pagination/Pagination';
import NoteList from '@/app/components/NoteList/NoteList';
import Modal from '@/app/components/Modal/Modal';
import NoteForm from '@/app/components/NoteForm/NoteForm';
import { useQuery } from '@tanstack/react-query';
import { fetchNotes } from '@/app/lib/api';
import type { Note } from '@/app/types/note';
import noteDetailsStyles from './NoteDetails.module.css';
import notesPageStyles from './NotesPage.module.css';

export default function NotesPage() {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: notes,
    isLoading,
    error,
  } = useQuery<Note[]>({
    queryKey: ['notes'],
    queryFn: fetchNotes,
  });

  if (isLoading) return <p>Loading…</p>;
  if (error) return <p>Помилка завантаження</p>;
  if (!notes) return <p>Нотаток немає</p>;

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

      {/* 📋 Список нотаток */}
      <NoteList notes={paginatedNotes} />

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
