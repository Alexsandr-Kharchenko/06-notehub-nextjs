'use client';

import Link from 'next/link';
import type { Note } from '@/types/note';
import css from './NoteList.module.css';

interface NoteListProps {
  notes: Note[];
  // Змінили тип для асинхронної функції
  removeNote: (id: string) => void;

  isDeletingId: string | null;
}

// Приймаємо isDeletingId замість isPending
const NoteList = ({ notes, removeNote, isDeletingId }: NoteListProps) => {
  if (!notes || notes.length === 0) {
    return (
      <div className={css.emptyState}>
        <h3>No notes found</h3>
        <p>Create your first note to get started!</p>
      </div>
    );
  }

  return (
    <ul className={css.list}>
      {notes.map(note => {
        // Визначаємо, чи видаляється саме ця нотатка
        const isPending = isDeletingId === note.id;

        return (
          <li key={note.id} className={css.listItem}>
            <h2 className={css.title}>{note.title}</h2>
            {}
            <p className={css.content}>{note.content ?? 'No content'}</p>
            <div className={css.footer}>
              <span className={css.tag}>{note.tag}</span>

              <Link href={`/notes/${note.id}`} className={css.link}>
                View details
              </Link>

              <button
                className={css.button}
                onClick={() => removeNote(note.id)}
                disabled={isPending}
                aria-label={`Delete note titled ${note.title}`}
              >
                {isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default NoteList;
