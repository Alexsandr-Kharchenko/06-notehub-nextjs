'use client';

import type { UseMutateFunction } from '@tanstack/react-query';
import Link from 'next/link';
import type { Note } from '@/app/types/note';
import styles from './NoteList.module.css';

interface Props {
  notes: Note[];
  removeNote: UseMutateFunction<Note, Error, string, unknown>;
  isPending?: boolean;
}

export default function NoteList({ notes, removeNote, isPending }: Props) {
  if (!notes || notes.length === 0)
    return <p className={styles.empty}>No notes yet</p>;

  return (
    <ul className={styles.list}>
      {notes.map(note => (
        <li key={note.id} className={styles.listItem}>
          <h2 className={styles.title}>{note.title}</h2>
          <p className={styles.content}>{note.content || 'No content'}</p>

          <div className={styles.footer}>
            {note.tag && <span className={styles.tag}>{note.tag}</span>}
            <span className={styles.date}>
              {note.createdAt
                ? new Date(note.createdAt).toLocaleDateString()
                : ''}
            </span>

            <Link href={`/notes/${note.id}`} className={styles.link}>
              View
            </Link>

            <button
              className={styles.button}
              onClick={() => removeNote(note.id)}
              disabled={isPending}
            >
              {isPending ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
