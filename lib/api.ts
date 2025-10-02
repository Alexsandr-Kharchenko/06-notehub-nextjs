import axios from 'axios';
import type { Note } from '@/types/note';

const BASE_URL = 'https://notehub-public.goit.study/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
    'Content-Type': 'application/json;charset=utf-8',
  },
});

// Типи для створення та видалення нотатки
export type DeleteNote = Note;

export interface CreateNote {
  title: string;
  content?: string;
  tag: Note['tag'];
}

// Тип для відповіді при отриманні нотаток
export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

// Отримати всі нотатки з інформацією про загальну кількість сторінок
export const fetchNotes = async (): Promise<FetchNotesResponse> => {
  const { data } = await api.get<FetchNotesResponse>('/notes');
  return data;
};

// Отримати одну нотатку за ID
export const fetchNoteById = async (id: string): Promise<Note> => {
  if (!id) throw new Error('Note id is required');
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
};

// Створити нову нотатку
export const createNote = async (note: CreateNote): Promise<Note> => {
  const { data } = await api.post<Note>('/notes', note);
  return data;
};

// Видалити нотатку
export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
};
