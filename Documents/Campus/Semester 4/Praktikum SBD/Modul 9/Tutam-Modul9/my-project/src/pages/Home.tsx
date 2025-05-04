import { useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PlusCircle, Search } from 'lucide-react';
import NoteCard from '../components/NoteCard';
import { Note } from '../types';

interface HomeProps {
  notes: Note[];
  loading: boolean;
  onDelete: (id: string) => void;
}

export default function Home({ notes, loading, onDelete }: HomeProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const folderFilter = queryParams.get('folder');
  const tagFilter = queryParams.get('tag');
  
  const filteredNotes = useMemo(() => {
    return notes.filter(note => {
      // Apply folder filter if present
      if (folderFilter && note.folder !== folderFilter) {
        return false;
      }
      
      // Apply tag filter if present
      if (tagFilter && (!note.tags || !note.tags.includes(tagFilter))) {
        return false;
      }
      
      // Apply search query if present
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          note.title.toLowerCase().includes(query) ||
          note.content.toLowerCase().includes(query) ||
          note.tags?.some(tag => tag.toLowerCase().includes(query))
        );
      }
      
      return true;
    });
  }, [notes, searchQuery, folderFilter, tagFilter]);

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-900">
          {folderFilter ? folderFilter : tagFilter ? `#${tagFilter}` : 'All Notes'}
        </h1>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search notes..."
              className="pl-9 pr-4 py-2 w-full md:w-64 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
          
          <Link
            to="/notes/new"
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-150"
          >
            <PlusCircle size={18} className="mr-2" />
            <span>New Note</span>
          </Link>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <h3 className="text-xl font-medium text-gray-900 mb-2">No notes found</h3>
          <p className="text-gray-600 mb-6">
            {searchQuery 
              ? "No notes match your search. Try a different query."
              : folderFilter || tagFilter
                ? "No notes in this category. Create a new note to get started."
                : "You don't have any notes yet. Create your first note to get started."}
          </p>
          <Link
            to="/notes/new"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-150"
          >
            <PlusCircle size={18} className="mr-2" />
            <span>Create your first note</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map(note => (
            <NoteCard 
              key={note.id} 
              note={note} 
              onDelete={onDelete} 
            />
          ))}
        </div>
      )}
    </div>
  );
}