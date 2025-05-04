import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { Note } from '../types';
import { format } from 'date-fns';

interface NoteCardProps {
  note: Note;
  onDelete: (id: string) => void;
}

export default function NoteCard({ note, onDelete }: NoteCardProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this note?')) {
      onDelete(note.id);
    }
  };

  // Create a preview of the content (first 100 characters)
  const contentPreview = note.content.length > 100 
    ? note.content.substring(0, 100) + '...' 
    : note.content;

  return (
    <Link 
      to={`/notes/${note.id}`}
      className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-200"
    >
      <div className="p-5">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium text-gray-900 mb-1 line-clamp-1">{note.title}</h3>
          <button
            onClick={handleDelete}
            className="text-gray-400 hover:text-red-500 transition-colors duration-150"
            aria-label="Delete note"
          >
            <Trash2 size={18} />
          </button>
        </div>
        
        <p className="text-gray-600 text-sm line-clamp-3 mb-3">{contentPreview}</p>
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2">
            {note.tags && note.tags.length > 0 && (
              <div className="flex space-x-1">
                {note.tags.slice(0, 2).map((tag, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800"
                  >
                    {tag}
                  </span>
                ))}
                {note.tags.length > 2 && (
                  <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                    +{note.tags.length - 2}
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="text-xs text-gray-500">
            {format(new Date(note.updated_at), 'MMM d, yyyy')}
          </div>
        </div>
      </div>
    </Link>
  );
}