// app/notes/[id]/page.tsx
import { Suspense } from 'react';
import NoteDetailsClient from './NoteDetails.client';

interface Props {
  params: {
    id: string;
  };
}

export default function NoteDetailsPage({ params }: Props) {
  const { id } = params;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Note Details</h1>

      {/* Suspense для клієнтського компонента */}
      <Suspense fallback={<p>Loading note...</p>}>
        <NoteDetailsClient noteId={id} />
      </Suspense>
    </div>
  );
}
