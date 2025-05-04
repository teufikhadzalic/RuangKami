import { Note } from '../types';
import NoteEditor from '../components/NoteEditor';

interface NewNoteProps {
  onAddNote: (note: Omit<Note, 'id' | 'created_at' | 'updated_at'>) => Promise<Note | undefined>;
}

export default function NewNote({ onAddNote }: NewNoteProps) {
  const handleSave = async (note: Partial<Note>) => {
    return await onAddNote(note as Omit<Note, 'id' | 'created_at' | 'updated_at'>);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Note</h1>
      <NoteEditor 
        isNew={true}
        onSave={handleSave}
      />
    </div>
  );
}