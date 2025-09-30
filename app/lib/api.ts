import axios from 'axios';
import type { Note } from '@/app/types/note';

const BASE_URL = 'https://notehub-public.goit.study/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
    'Content-Type': 'application/json;charset=utf-8',
  },
});

export type DeleteNote = Note;

export interface CreateNote {
  title: string;
  content?: string;
  tag: Note['tag'];
}

export const fetchNotes = async (): Promise<Note[]> => {
  const { data } = await api.get<{ notes: Note[] }>('/notes');
  return data.notes;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  if (!id) throw new Error('Note id is required');
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
};

export const createNote = async (note: CreateNote): Promise<Note> => {
  const { data } = await api.post<Note>('/notes', note);
  return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
};
