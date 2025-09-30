'use client';
import Link from 'next/link';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Note } from '@/app/types/note';
import { deleteNote } from '@/app/lib/api';
import styles from './NoteList.module.css';

interface Props {
  notes: Note[];
}

export default function NoteList({ notes }: Props) {
  const queryClient = useQueryClient();

  // Мутація для видалення нотатки
  const mutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  if (!notes || notes.length === 0) {
    return <p className={styles.empty}>Нотаток поки немає</p>;
  }

  return (
    <ul className={styles.list}>
      {notes.map(note => (
        <li key={note.id} className={styles.listItem}>
          <h2 className={styles.title}>{note.title}</h2>
          <p className={styles.content}>{note.content || 'Без тексту'}</p>

          <div className={styles.footer}>
            {note.tag && <span className={styles.tag}>{note.tag}</span>}
            <span className={styles.date}>
              {note.createdAt
                ? new Date(note.createdAt).toLocaleDateString()
                : ''}
            </span>

            <Link href={`/notes/${note.id}`} className={styles.link}>
              View details
            </Link>

            {/* Кнопка Delete */}
            <button
              className={styles.button}
              onClick={() => mutation.mutate(note.id)}
              disabled={mutation.status === 'pending'} // ✅ замінили 'loading' на 'pending'
            >
              {mutation.status === 'pending' ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
