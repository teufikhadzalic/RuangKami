import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Note } from '../types';
import NoteEditor from '../components/NoteEditor';
import NoteViewer from '../components/NoteViewer';
import { Trash2, Edit2 } from 'lucide-react';

interface NotePageProps {
  notes: Note[];
  onUpdateNote: (id: string, updates: Partial<Note>) => void;
  onDeleteNote: (id: string) => void;
}

export default function NotePage({ notes, onUpdateNote, onDeleteNote }: NotePageProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [note, setNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && notes.length > 0) {
      const foundNote = notes.find(n => n.id === id);
      if (foundNote) {
        setNote(foundNote);
      } else {
        // Note not found
        navigate('/not-found', { replace: true });
      }
    }
    setLoading(false);
  }, [id, notes, navigate]);

  const handleDelete = () => {
    if (!note) return;
    
    if (confirm('Are you sure you want to delete this note?')) {
      onDeleteNote(note.id);
      navigate('/', { replace: true });
    }
  };

  const handleSave = async (updatedNote: Partial<Note>) => {
    if (!note || !id) return;
    
    await onUpdateNote(id, updatedNote);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Note not found</h2>
        <p className="text-gray-600 mb-6">The note you're looking for doesn't exist or has been deleted.</p>
      </div>
    );
  }

  return (
    <div>
      {isEditing ? (
        <NoteEditor
          note={note}
          onSave={handleSave}
        />
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{note.title}</h1>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors duration-150"
                aria-label="Edit note"
              >
                <Edit2 size={20} />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors duration-150"
                aria-label="Delete note"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
          
          <NoteViewer note={note} />
        </>
      )}
    </div>
  );
}