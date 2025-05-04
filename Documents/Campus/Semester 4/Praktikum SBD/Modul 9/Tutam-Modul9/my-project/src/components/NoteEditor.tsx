import { useState, useEffect } from 'react';
import { Note } from '../types';
import { ChevronLeft, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NoteEditorProps {
  note?: Note;
  isNew?: boolean;
  onSave: (note: Partial<Note>) => void;
}

export default function NoteEditor({ note, isNew = false, onSave }: NoteEditorProps) {
  const navigate = useNavigate();
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [folder, setFolder] = useState(note?.folder || '');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(note?.tags || []);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setFolder(note.folder);
      setTags(note.tags || []);
    }
  }, [note]);

  const handleSave = async () => {
    if (!title.trim()) {
      alert('Please enter a title for your note');
      return;
    }

    setIsSaving(true);
    
    try {
      const updatedNote = {
        title,
        content,
        folder,
        tags,
        ...(isNew ? {} : { id: note?.id })
      };
      
      await onSave(updatedNote);
      
      if (isNew) {
        navigate('/');
      }
    } catch (error) {
      console.error('Error saving note:', error);
      alert('Failed to save note. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput) {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft size={20} className="mr-1" />
          <span>Back</span>
        </button>
        
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`flex items-center px-4 py-2 rounded-md text-white ${
            isSaving 
              ? 'bg-blue-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          } transition-colors duration-150`}
        >
          <Save size={18} className="mr-2" />
          <span>{isSaving ? 'Saving...' : 'Save'}</span>
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <input
            type="text"
            placeholder="Untitled"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-3xl font-bold border-0 focus:ring-0 focus:outline-none placeholder-gray-300"
          />
        </div>

        <div className="flex flex-wrap items-center space-x-2 mb-4">
          <label className="text-sm font-medium text-gray-700">Tags:</label>
          <div className="flex flex-wrap gap-2 items-center">
            {tags.map((tag, index) => (
              <span 
                key={index}
                className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 flex items-center"
              >
                {tag}
                <button 
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 text-blue-500 hover:text-blue-700"
                >
                  &times;
                </button>
              </span>
            ))}
            <div className="relative">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add tag..."
                className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                onClick={handleAddTag}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 mb-4">
          <label htmlFor="folder" className="text-sm font-medium text-gray-700">
            Folder:
          </label>
          <select
            id="folder"
            value={folder}
            onChange={(e) => setFolder(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          >
            <option value="">Select folder</option>
            <option value="Personal">Personal</option>
            <option value="Work">Work</option>
            <option value="Projects">Projects</option>
          </select>
        </div>

        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing..."
            className="w-full h-64 p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none placeholder-gray-400"
          />
        </div>
      </div>
    </div>
  );
}