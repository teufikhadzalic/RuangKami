import { Note } from '../types';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface NoteViewerProps {
  note: Note;
}

export default function NoteViewer({ note }: NoteViewerProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="mb-6 flex flex-wrap gap-2 items-center">
        {note.folder && (
          <span className="px-3 py-1 text-sm rounded-md bg-gray-100 text-gray-800">
            {note.folder}
          </span>
        )}
        
        {note.tags && note.tags.length > 0 && 
          note.tags.map((tag, index) => (
            <span 
              key={index}
              className="px-3 py-1 text-sm rounded-md bg-blue-100 text-blue-800"
            >
              #{tag}
            </span>
          ))
        }
        
        <span className="text-sm text-gray-500 ml-auto">
          Last updated: {format(new Date(note.updated_at), 'MMM d, yyyy h:mm a')}
        </span>
      </div>
      
      <div className="prose max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {note.content}
        </ReactMarkdown>
      </div>
    </div>
  );
}