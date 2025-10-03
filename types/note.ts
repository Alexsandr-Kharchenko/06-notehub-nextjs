export type NoteTag = 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping';

export interface Note {
  id: string;
  title: string;
  content: string;
  tag: NoteTag;
  createdAt: string;
  updatedAt: string;
}

export interface NoteListProps {
  notes: Note[];
  removeNote?: (id: string) => void; // зробив optional
  isPending?: boolean;
}
