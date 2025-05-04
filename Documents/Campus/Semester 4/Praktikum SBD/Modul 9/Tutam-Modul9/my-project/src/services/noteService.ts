const API_URL = 'http://localhost:5173';

export async function fetchNotes() {
  const response = await fetch(`${API_URL}/notes`);
  if (!response.ok) {
    throw new Error('Failed to fetch notes');
  }
  const data = await response.json();
  console.log('Fetched notes:', data); // Log untuk memeriksa data yang diterima
  return data;
}

export async function addNote(note: Omit<any, 'id'>) {
  const response = await fetch(`${API_URL}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(note),
  });
  if (!response.ok) {
    throw new Error('Failed to add note');
  }
  const data = await response.json();
  console.log('Response from backend:', data); // Log untuk memeriksa respons
  return data;
}

export async function updateNote(id: string, updates: Partial<any>) {
  const response = await fetch(`${API_URL}/notes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!response.ok) {
    throw new Error('Failed to update note');
  }
  return await response.json();
}

export async function deleteNote(id: string) {
  const response = await fetch(`${API_URL}/notes/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete note');
  }
  return await response.json();
}
