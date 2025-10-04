'use client';

import Link from 'next/link';
import type { Note } from '@/types/note';
import css from './NoteList.module.css'; // Припускаємо, що це шлях до CSS-модуля

interface NoteListProps {
  notes: Note[];
  // Очікуємо функцію видалення, яка викликає мутацію в батьківському компоненті
  removeNote: (id: string) => void;
  // ID нотатки, яка наразі видаляється (для контролю стану кнопки)
  isDeletingId: string | null;
}

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
          // Використовуємо key лише для li
          <li key={note.id} className={css.listItem}>
            <h2 className={css.title}>{note.title}</h2>
            {/* Обмежуємо контент, якщо він є */}
            <p className={css.content}>
              {note.content?.substring(0, 100) ?? 'No content'}
            </p>
            <div className={css.footer}>
              <span className={css.tag}>{note.tag}</span>

              {/* Посилання на детальну сторінку */}
              <Link href={`/notes/${note.id}`} className={css.link}>
                View details
              </Link>

              {/* Кнопка видалення */}
              <button
                className={css.button}
                onClick={() => removeNote(note.id)}
                // Вимикаємо кнопку, якщо видаляється саме ця нотатка або будь-яка інша
                disabled={isDeletingId !== null}
                aria-label={`Delete note titled ${note.title}`}
              >
                {/* Змінюємо текст, якщо видаляється саме ця нотатка */}
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
