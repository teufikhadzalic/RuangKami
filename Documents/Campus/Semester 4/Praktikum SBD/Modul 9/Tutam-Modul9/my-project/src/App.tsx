import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Home from './pages/Home';
import NotePage from './pages/NotePage';
import NotFound from './pages/NotFound';
import NewNote from './pages/NewNote';
import Settings from './pages/Settings';
import { Note } from './types';
import { fetchNotes, addNote, updateNote, deleteNote } from './services/noteService';

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch notes when the app loads
  useEffect(() => {
    async function loadNotes() {
      try {
        setLoading(true);
        const fetchedNotes = await fetchNotes();
        console.log('Notes loaded:', fetchedNotes); // Log untuk memeriksa data yang dimuat
        setNotes(fetchedNotes);
      } catch (error) {
        console.error('Error fetching notes:', error);
      } finally {
        setLoading(false);
      }
    }
    loadNotes();
  }, []);

  async function handleAddNote(newNote: Omit<Note, 'id' | 'created_at' | 'updated_at'>): Promise<Note | undefined> {
    try {
      console.log('Adding note:', newNote); // Log untuk memeriksa data yang dikirim
      const addedNote = await addNote(newNote);
      console.log('Added note:', addedNote); // Log untuk memeriksa data yang diterima dari backend
      setNotes([addedNote, ...notes]); // Perbarui state notes
      return addedNote;
    } catch (error) {
      console.error('Error adding note:', error);
    }
    return undefined;
  }

  // Update an existing note
  async function handleUpdateNote(id: string, updates: Partial<Note>) {
    try {
      const success = await updateNote(id, updates);
      if (success) {
        setNotes(notes.map(note => (note.id === id ? { ...note, ...updates } : note)));
      }
    } catch (error) {
      console.error('Error updating note:', error);
    }
  }

  // Delete a note
  async function handleDeleteNote(id: string) {
    try {
      const success = await deleteNote(id);
      if (success) {
        setNotes(notes.filter(note => note.id !== id));
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={
              <Home
                notes={notes}
                loading={loading}
                onDelete={handleDeleteNote}
              />
            }
          />
          <Route path="notes">
            <Route path="new" element={<NewNote onAddNote={handleAddNote} />} />
            <Route
              path=":id"
              element={
                <NotePage
                  notes={notes}
                  onUpdateNote={handleUpdateNote}
                  onDeleteNote={handleDeleteNote}
                />
              }
            />
          </Route>
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;